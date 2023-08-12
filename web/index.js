// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import { createProxyMiddleware } from "http-proxy-middleware";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import descriptionUpdate from "./product-update.js";
import { updateProductVariantMetafields } from "./variant-update.js";
import webhookHandlers from "./webhook-handlers.js";
import getProducts from "./product-paging.js";
import * as util from "util";
import { connectToRedis } from "./redis.js";
import { setupBullMQServer, serverSideEvent } from "./bull-queue.js";
import { body, validationResult } from "express-validator";
import { request } from "./cache-to-file.js";
import { billingConfig, createUsageRecord } from "./billing.js";
import { updateSubscription } from "./subscriptionManager.js";
import productTagger from "./product-tagger.js";
import { contentGenerator } from "./shopifyContentGenerator.js";
import {
  handleDescriptionEndpoints,
  handleArticleEndpoints,
  handlePostEndpoints,
} from "./description-requests.js";



import * as userStore from "./userStore.js";
const isTest = true;
const reconciliation = {};
const log = (message, obj) =>
  console.log(message + ": ", util.inspect(obj, { depth: null, colors: true, showHidden:false, compact:true }));

async function startServer() {
  try {
    const redisClient = await connectToRedis();

    const { queue, worker } = await setupBullMQServer(redisClient);

    // Middleware to handle async function errors
    const asyncErrorHandler = (asyncFn) => (req, res, next) => {
      asyncFn(req, res, next).catch(next);
    };

    const PORT = parseInt(
      process.env.BACKEND_PORT || process.env.PORT || "3000",
      10
    );

    const STATIC_PATH =
      process.env.NODE_ENV === "production"
        ? `${process.cwd()}/frontend/dist`
        : `${process.cwd()}/frontend`;

    const app = express();

    // Set up Shopify authentication and webhook handling
    app.get(shopify.config.auth.path, shopify.auth.begin());

    app.get(
      shopify.config.auth.callbackPath,
      shopify.auth.callback(),
      // Request payment if required
      async (req, res, next) => {
        const plans = Object.keys(billingConfig);
        const session = res.locals.shopify.session;
        const hasPayment = await shopify.api.billing.check({
          session,
          plans: plans,
          isTest: isTest, // need to change to false when ready for production
        });

        if (hasPayment) {
          next();
        } else {
          res.redirect(
            await shopify.api.billing.request({
              session,
              plan: plans[0],
              isTest: isTest,
            })
          );
        }
      },
      // Load the app otherwise
      shopify.redirectToShopifyOrAppRoot()
    );
    //order matters for webhooks it needs to be placed before app.use(express.json())
    app.post(
      shopify.config.webhooks.path,
      shopify.processWebhooks({
        webhookHandlers,
      })
    );

    // If you are adding routes outside of the /api path, remember to
    // also add a proxy rule for them in web/frontend/vite.config.js
    // app.use("/sse/*", shopify.validateAuthenticatedSession());

    app.use("/api/*", shopify.validateAuthenticatedSession());

    app.use(express.json());

    handleDescriptionEndpoints(app, queue);
    handleArticleEndpoints(app, queue);
    handlePostEndpoints(app, queue);

    app.get("/api/current/subscription/status", async (req, res) => {
      try {
        const session = res.locals.shopify.session;
        const subscriptions = await shopify.api.billing.subscriptions({
          session,
        });
        const shop = session.shop;
        subscriptions.activeSubscriptions.forEach((subscription) => {
          updateSubscription(shop, subscription.name);
        });

        const activeSubscriptions = subscriptions.activeSubscriptions.map(
          (sub) => sub.name
        );
        if (!activeSubscriptions.length) {
          activeSubscriptions.push("free");
        }
        
        
        
        
        
        res
          .status(200)
          .json({ activeSubscriptions, session: res.locals.shopify.session });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Failed to retrieve subscription status" });
      }
    });

    app.post(
      "/api/subscription/selection",
      [
        body("plan").notEmpty().withMessage("Plan is required"),
        body("plan").trim().escape(),
      ],
      async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }

          const { plan } = req.body;
          const session = res.locals.shopify.session;

          const plans = Object.keys(billingConfig);

          const hasPayment = await shopify.api.billing.check({
            session,
            plans: plans,
            isTest: true,
          });

          if (hasPayment) {
            const subscriptions = await shopify.api.billing.subscriptions({
              session,
            });

            const { activeSubscriptions } = subscriptions;
            for (const { id, name, test } of activeSubscriptions) {
              try {
                await shopify.api.billing.cancel({
                  session,
                  subscriptionId: id,
                });
              } catch (err) {
                console.error("Error cancelling subscription:", err);
              }
            }
          }

          if (plans.includes(plan)) {
            const redirectUrl = await shopify.api.billing.request({
              session,
              plan: plan,
              isTest: true,
            });

            res.status(200).send({ redirectUrl, subscriptions: [] });
          } else {
            res.status(200).send({
              message: {
                header: "Successfully Unsubscribed",
                body: "You Have Been Successfully Unsubscribed",
              },
              subscriptions: ["free"],
            });
          }
        } catch (err) {
          console.error("Error processing subscription:", err);
          res.status(500).send({
            error: "An error occurred while processing the subscription.",
          });
        }
      }
    );
    

    app.post(
      "/api/store-api",
      asyncErrorHandler(async (req, res) => {
        const storeName = req.body.storeName;
        const userData = req.body.userData;
        console.log("---/api/store-api--");
        await userStore.createUsersFolderAsync();
        await userStore.writeJSONToFileAsync(storeName, userData);

        res.status(201).json({ message: "User data written successfully." });
      })
    );
contentGenerator(app)
    app.get("/api/user", async (_req, res) => {
      const userData = await shopify.api.rest.User.all({
        session: res.locals.shopify.session,
      });
      res.status(200).send(userData);
    });

    app.get("/api/products/tag", async (req, res) => {
      const session = res.locals.shopify.session;
      const client = new shopify.api.clients.Rest({ session });

      let status = 200;
      let error = null;

      try {
        let params = {
          path: "/products",
          query: {
            limit: 250,
            fields: "id, images, tags",
            // Lean on `updated_at_min` to only fetch products which
            // have been updated since the last time this process ran
            updated_at_min: reconciliation[session.shop] || "",
          },
        };
        // Step through pagination
        do {
          const products = await client.get(params);
          // Check tags
          for (const product of products.body.products) {
            await productTagger(client, product);
          }
          params = products?.pageInfo?.nextPage;
        } while (params !== undefined);
        // Keep track of the last time this process runs
        reconciliation[session.shop] = new Date().toISOString();
        res.status(status).send({ success: status === 200, error });
      } catch (e) {
        console.log(`Failed to reconcile products: ${e.message}`);
        status = 500;
        error = e.message;
      }
    });

    app.get("/api/products/all", async (_req, res) => {
      try {
        const all = await shopify.api.rest.Product.all({
          session: res.locals.shopify.session,

          fields:
            "cursor,id,image,title,body_html,collection_type,handle,published_scope,published_status,vendor,options,tags,variants",
        });

        // log(all);

        res.status(200).send(all);
      } catch (error) {
        console.log("error message--->", error.message);
      }
    });

    app.get("/api/inventory-item/", async (_req, res) => {
      if (_req.params.id && _req.params.id !== "") {
        const item = await shopify.api.rest.InventoryItem.find({
          session: res.locals.shopify.session,
          id: _req.params.id,
        });
        res.status(200).send(item);
      } else {
        res.status(400).send({ success: false, error: "No ID provided" });
      }
    });

    app.get("/api/country/all", async (_req, res) => {
      const all = await shopify.api.rest.Country.all({
        session: res.locals.shopify.session,
      });
      res.status(200).send(all);
    });

    app.get("/api/usage/create", async (_req, res) => {
      let status = 200;
      let error = null;
      let resp = null;
      let capacityReached = false;

      try {
        console.log("session", res.locals.shopify.session);
        resp = await createUsageRecord(res.locals.shopify.session);
        capacityReached = resp.capacityReached;
        if (capacityReached && !resp.createdRecord) {
          error = "Could not create record because capacity was reached";
          status = 400;
        }
      } catch (e) {
        console.log(`Failed to process usage/create: ${e.message}`);
        status = 500;
        error = e.message;
      }
      res.status(status).send({
        success: status === 200,
        capacityReach: capacityReached,
        error,
      });
    });

    app.post("/api/product/variant/metafields", async (req, res) => {
      let status = 200;
      let error = null;
      try {
        if (req.body.variantId && req.body.metafields) {
          const { variantId, metafieldsArray } = req.body;
          await updateProductVariantMetafields(
            res.locals.shopify.session,
            `gid://shopify/ProductVariant/${variantId}`,
            metafieldsArray
          );
        }
      } catch (e) {
        status = 500;
        error = e.message;
      }
      res.status(status).send({ success: status === 200, error });
    });

    // app.post("/api/ai/options", async (req, res) => {
    //   let status = 200;
    //   let error = null;
    //   console.log("options:", JSON.stringify(req.body));

    //   try {
    //   } catch (e) {
    //     status = 500;
    //     error = e.message;
    //   }
    //   const { options } = req.body;
    //   res.status(status).send({ options, success: status === 200, error });
    // });

    // app.post("/api/ai/focused-request", async (req, res) => {
    //   let status = 200;
    //   let error = null;
    //   let data = null;
    //   try {
    //     let firstArg = 5;
    //     let afterArg = null;
    //     let beforeArg = null;
    //     const { options } = req.body;
    //     data = options;

    //     console.log("data-f-->", data);

    //     data = "our paragraph is";
    //   } catch (err) {
    //     console.log("Error-->", err);
    //     status = 500;
    //     error = err.message;
    //     data = null; // Reset data to null in case of an error
    //   }
    //   res.status(status).send({ success: status === 200, data, error });
    // });

    app.post("/api/products/paging", async (req, res) => {
      let status = 200;
      let error = null;
      let data = null;
      try {
        let firstArg = 5;
        let afterArg = null;
    
        const { first, after } = req.body;

        firstArg = first || 5;
        afterArg = after || null;
  
      
        data = await getProducts(
          res.locals.shopify.session,
          firstArg,
          afterArg,
        
        );
      } catch (err) {
        console.log("Error-->", err);
        status = 500;
        error = err.message;
        data = null; // Reset data to null in case of an error
      }
      res.status(status).send({ success: status === 200, data, error });
    });


    app.post("/api/products/update/description", async (req, res) => {
      let status = 200;
      let error = null;
      let data = null
      try {
        if (req.body.productId && req.body.descriptionHtml) {
          const { productId, descriptionHtml } = req.body;
           data = await descriptionUpdate(
            res.locals.shopify.session,
            `gid://shopify/Product/${productId}`,
            descriptionHtml
          );
        }
      } catch (e) {
        status = 500;
        error = e.message;
      }
      res.status(status).send({ success: status === 200,data, error });
    });

    // app.get("/api/products/create", async (_req, res) => {
    //   let status = 200;
    //   let error = null;

    //   try {
    //     await productCreator(res.locals.shopify.session);
    //   } catch (e) {
    //     console.log(`Failed to process products/create: ${e.message}`);
    //     status = 500;
    //     error = e.message;
    //   }
    //   res.status(status).send({ success: status === 200, error });
    // });

    app.use(shopify.cspHeaders());

    // Proxy specific routes to the Ionic development server
    // const proxyOptions = {
    //   target: "http://localhost:8100", // Replace with your Ionic development server URL
    //   changeOrigin: true,
    // };

    // const proxy = createProxyMiddleware(["/your-proxy-path"], proxyOptions);
    // app.use(proxy);

    // Serve static files for other routes
    serverSideEvent(app, redisClient, queue);
    app.use(serveStatic(STATIC_PATH, { index: false }));

    const skipEnsureInstalledOnShop = (req, res, next) => {
      //   log("ensure installed------->", req);
      if (req.path === "/sse/stream") {
     
        res.locals.shopify = req.query.locals;

        // Skip the shopify.ensureInstalledOnShop() middleware for /sse/stream
        next();
      } else {
        // Continue with the shopify.ensureInstalledOnShop() middleware for other routes
        shopify.ensureInstalledOnShop()(req, res, next);
      }
    };

    app.use(skipEnsureInstalledOnShop);

    app.use(
      "/*",
      //     (req, res, next)=>{
      //       if (req.path === "/sse/stream") {
      //         console.log('req---->', req.query.locals)
      //       if(req.query.locals){
      //         res.locals.shopify =  req.query.locals
      //  console.log('req---->', req.query.locals)
      //         // Skip the shopify.ensureInstalledOnShop() middleware for /sse/stream
      //       }
      //         next();

      //       }else{ next()
      //       }

      //     },
      //       shopify.ensureInstalledOnShop(),
      async (_req, res, _next) => {
        // console.log('middleware', shopify.ensureInstalledOnShop())

        return res
          .status(200)
          .set("Content-Type", "text/html")
          .send(readFileSync(join(STATIC_PATH, "index.html")));
      }
    );
    app.use((err, req, res, next) => {
      console.error("Error:", err);
      res.status(500).json({ error: "Something went wrong." });
    });

    app.listen(PORT);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();

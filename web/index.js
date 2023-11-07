// @ts-check
import { env } from "./envVars.js";
import { join } from "path";
import * as util from "util";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import { shopify } from "./shopify.js";
import productCreator from "./product-creator.js";
import descriptionUpdate from "./product-update.js";
import { updateProductVariantMetafields } from "./variant-update.js";
import webhookHandlers from "./webhook-handlers.js";
import getProducts from "./product-paging.js";
import path from "path";
import { connectToRedis } from "./redis.js";
import { setupBullMQServer, serverSideEvent } from "./bull-queue.js";
import { body, validationResult } from "express-validator";
import { billingConfig, createUsageRecord, isTest } from "./billing.js";
import {
  updateSubscription,
  getUserByShopName,
} from "./subscriptionManager.js";
import productTagger from "./product-tagger.js";
import { contentGenerator } from "./shopifyContentGenerator.js";
import { productSearch } from "./product-search.js";
import { authentication } from "./authentication.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { request } from "./cache-to-file.js";
import compression from "compression";

import dnscache from "dnscache";
import {
  handleDescriptionEndpoints,
  handleArticleEndpoints,
  handlePostEndpoints,
} from "./description-requests.js";
import { sendEmail } from "./sendEmail.js";
import * as userStore from "./userStore.js";





// dnscache({
//   enable: true,
//    "ttl" : 300,
//   cachesize: 1000, // Set TTL to 5 minutes (300 seconds)
// });


const { writeJSONToFileAsync } = userStore;

const reconciliation = {};
const log = (message, obj) =>
  console.log(
    message + ": ",
    util.inspect(obj, {
      depth: null,
      colors: true,
      showHidden: false,
      compact: true,
    })
  );

async function startServer() {
  try {
    const redisClient = await connectToRedis();

    userStore.setRedis(redisClient);
    await userStore.createUsersFolderAsync();
    const { queue, worker } = await setupBullMQServer(redisClient);

    // Middleware to handle async function errors
    // const asyncErrorHandler = (asyncFn) => (req, res, next) => {
    //   asyncFn(req, res, next).catch(next);
    // };

    const PORT = parseInt(
      process.env.BACKEND_PORT || process.env.PORT || "3000",
      10
    );
    console.log("NODE_ENV--->", process.env.NODE_ENV);
    // process.env.NODE_ENV = "production";

    const STATIC_PATH =
      process.env.NODE_ENV === "production"
        ? `${process.cwd()}/frontend/dist`
        : `${process.cwd()}/frontend`;

    const app = await authentication();
    // const csp = "frame-ancestors 'self' neuralnectar.fly.dev";

    
    serverSideEvent(app, redisClient, queue);
    app.use(compression({ threshold: 9 }));
    handleDescriptionEndpoints(app, queue);
    handleArticleEndpoints(app, queue);
    handlePostEndpoints(app, queue);

    app.post("/api/bug/report", async (req, res) => {
      let status = 200;
      let error = null;
      let data = null;
      let required = ["text", "subject", "to", "from"].every(
        (key) => key in req.body
      );
      if (required) {
        const { text, subject, to, from } = req.body;
        let data = req.body;
        try {
          sendEmail({
            text,
            subject,
            to,
            from,
            callback: (error, info) => {
              if (error) {
                error = error;
              } else {
                data = info;
              }
            },
          });
        } catch (err) {
          status = 500;
          error = err;
          data = null;
        }

        res.status(status).send({ success: status === 200, data, error });
      }
    });
    app.get("/api/current/subscription/status", async (req, res) => {
      try {
        const session = res.locals.shopify.session;

        const subscriptions = await shopify.api.billing.subscriptions({
          session
        });

        // const host = shopify.api.utils.sanitizeHost(req.query.host, true);
        // console.log('hots',host)

        const plans = Object.keys(billingConfig);

        const shop = shopify.api.utils.sanitizeShop(session.shop);
        let user = null;

        for (const subscription of subscriptions.activeSubscriptions) {
          user = await updateSubscription(shop, subscription.name);
        }

        const activeSubscriptions = subscriptions.activeSubscriptions.map(
          (sub) => sub.name
        );

        let redirectUri = null;

        if (activeSubscriptions.length === 0) {
          redirectUri = await shopify.api.billing.request({
            session,
            plan: plans[0],
            isTest,
          });

          activeSubscriptions.push("free");
          user = {
            shop,
            capped_usage: 0,
            subscription_name: "free",
            usage_limit: 0,
            capped_amount: 0,
            seen: true,
          };
        }

        res.status(200).json({
          user,
          activeSubscriptions,
          plans: billingConfig,
          session: res.locals.shopify.session,
          // redirectUri,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          plans: billingConfig,
          error: "Failed to retrieve subscription status",
        });
      }
    });

    app.post(
      "/api/subscription/selection",
      [
        body("plan").notEmpty().withMessage("Plan is required"),
        body("plan").trim().escape(),
      ],
      async (req, res, next) => {
        console.log("req", req.url);
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }

          // {
          //   "application_charges": [
          //     {
          //       "id": 556467234,
          //       "name": "Green theme",
          //       "api_client_id": 755357713,
          //       "price": "120.00",
          //       "status": "accepted",
          //       "return_url": "http://google.com",
          //       "test": null,
          //       "external_id": null,
          //       "created_at": "2023-07-11T17:47:36-04:00",
          //       "updated_at": "2023-07-11T17:47:36-04:00",
          //       "currency": "USD",
          //       "charge_type": "theme",
          //       "decorated_return_url": "http://google.com?charge_id=556467234"
          //     },
          //     {
          //       "id": 675931192,
          //       "name": "iPod Cleaning",
          //       "api_client_id": 755357713,
          //       "price": "5.00",
          //       "status": "accepted",
          //       "return_url": "http://google.com",
          //       "test": null,
          //       "created_at": "2023-07-11T17:47:36-04:00",
          //       "updated_at": "2023-07-11T17:47:36-04:00",
          //       "currency": "USD",
          //       "charge_type": null,
          //       "decorated_return_url": "http://google.com?charge_id=675931192"
          //     },
          //     {
          //       "id": 1017262346,
          //       "name": "Create me a logo",
          //       "api_client_id": 755357713,
          //       "price": "123.00",
          //       "status": "accepted",
          //       "return_url": "http://google.com",
          //       "test": null,
          //       "created_at": "2023-07-11T17:47:36-04:00",
          //       "updated_at": "2023-07-11T17:47:36-04:00",
          //       "currency": "USD",
          //       "charge_type": "brokered_service",
          //       "decorated_return_url": "http://google.com?charge_id=1017262346"
          //     }
          //   ]
          // }
          // await shopify.rest.ApplicationCharge.all({
          //   session: session,
          // });

          
          const { plan } = req.body;
          const { session } = res.locals.shopify;

          const plans = Object.keys(billingConfig);

          const hasPayment = await shopify.api.billing.check({
            session,
            plans: plans,
            isTest,
          });

          let activeSubs;
          if (hasPayment) {
            const subscriptions = await shopify.api.billing.subscriptions({
              session,
            });

            const { activeSubscriptions } = subscriptions;
            activeSubs = activeSubscriptions;
            for (const { id, name, test } of activeSubscriptions) {
              try {
                // await shopify.api.billing.cancel({
                //   session,
                //   subscriptionId: id,
                // });
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
            activeSubs = activeSubs
              ? activeSubs.map((sub) => sub.name).pop()
              : "free";
            console.log("returnUrl", redirectUrl);
            res.status(200).send({ redirectUrl, subscriptions: [activeSubs] });
          } else {
            res.status(200).send({
              message: {
                header: "Successfully Unsubscribed",
                body: "You Have Been Successfully Unsubscribed",
              },
              subscriptions: [activeSubs],
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

    app.post("/api/welcome/subscriber", async (req, res) => {
      let status = 200;
      let error = null;
      let data = null;
      const shop = shopify.api.utils.sanitizeShop(
        res.locals.shopify.session.shop
      );
      console.log("shop: ", shop);
      try {
        const user = await getUserByShopName(shop);
        user.seen = true;
        await writeJSONToFileAsync(shop, user);

        data = user;
      } catch (err) {
        status = 500;
        error = err;
      }
      res.status(status).send({ success: status === 200, data, error });
    });

    // app.post(
    //   "/api/store-api",
    //   asyncErrorHandler(async (req, res) => {
    //     const storeName = req.body.storeName;
    //     const userData = req.body.userData;
    //     console.log("---/api/store-api--");

    //     await userStore.writeJSONToFileAsync(storeName, userData);

    //     res.status(201).json({ message: "User data written successfully." });
    //   })
    // );

    contentGenerator(app);
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
          try {
            const products = (await client?.get(params)) || {
              body: { products: [] },
            };
            // Check tags
            // @ts-ignore
            for (const product of products?.body?.products) {
              await productTagger(client, product);
            }
            // @ts-ignore
            params = products?.pageInfo?.nextPage;
          } catch (err) {
            console.log("error products tags", err);
          }
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

    productSearch(app);
    app.get("/api/inventory-item/", async (_req, res) => {
      // @ts-ignore
      if (_req.params && _req.params?.id && _req.params?.id !== "") {
        const item = await shopify.api.rest.InventoryItem.find({
          session: res.locals.shopify.session,
          // @ts-ignore
          id: _req.params?.id,
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
      let data = null;
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
      res.status(status).send({ success: status === 200, data, error });
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

    app.post("/api/products/paging", async (req, res) => {
      // X-Shopify-Shop-Api-Call-Limit: 40/40
      // Retry-After: 2.0

      // Past the limit, the API will return a 429 Too Many Requests error.

      // All REST API responses include the X-Shopify-Shop-Api-Call-Limit header, which shows how many requests the client has made, and the total number allowed per minute.

      // A 429 response will also include a Retry-After header with the number of seconds to wait until retrying your query.
      //     let pageInfo;

      //     const response = await shopify.api.rest.Product.all({
      //       ...pageInfo?.nextPage?.query,
      //       session,
      //       limit: 10,
      //     });

      //     const pageProducts = response.data;
      //     // ... use pageProducts

      //  console.log('product Data--->  ', pageProducts)
      //     pageInfo = response.pageInfo;
      //   console.log('pageInfo-->', pageInfo)

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
          afterArg
        );
      } catch (err) {
        // console.log("Error-->", err);
        status = 500;
        error = err.message;
        data = null; // Reset data to null in case of an error
      }
      // console.log("data-->", data);
      // console.log("paging Data====>:", data);
      res.status(status).send({ success: status === 200, data, error });
    });

    
    app.post("/api/products/update/description", async (req, res) => {
      let status = 200;
      let error = null;
      let data = null;
      try {
        if (req.body.productId && req.body.descriptionHtml) {
          const { productId, descriptionHtml } = req.body;
          data = await descriptionUpdate(
            res.locals.shopify.session,
            `gid://shopify/Product/${productId}`,
            descriptionHtml
          );
          console.log("description update:", data);
        }
      } catch (e) {
        status = 500;
        error = e.message;
      }
      res.status(status).send({ success: status === 200, data, error });
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




    const dir_name = dirname(fileURLToPath(import.meta.url));
 

    const completePath = path
      .join(dir_name, "node_modules", "tinymce")
      .replace("/web/", "/");
    console.log("processCW", process.cwd());
    console.log("complete path: " + completePath);
    app.use("/tinymce", express.static(completePath));

    app.use(shopify.cspHeaders());

    // setting the index to true will fail, because it is checked by shopify.
    app.use(serveStatic(STATIC_PATH, { index: false }));

    // app.use(express.urlencoded({ extended: false }));

    // const ensureInstalledOnShop = (req, res, next) => {
    //   console.log("ensure installed on shopify");
    //   if (req.path.includes("/sse/stream")) {
    //     res.locals.shopify = req.query.locals;

    //     next();
    //   } else {
    //     // Continue with the shopify.ensureInstalledOnShop() middleware for other routes
    //     shopify.ensureInstalledOnShop()(req, res, next);
    //   }
    // };

    // app.use("/*", shopify.ensureInstalledOnShop());
// app.use( (req, res, next) => {
//   res.set('Cache-control', 'public, max-age=300')
//   next();
// })


    app.use(
      "/*",
      (req, res, next) => {
        console.log("query:==>", req.query);
        console.log("body:==>", req.body);
        console.log("query:==>", req.params);
        console.log("url:==>", req.url);
        console.log("originalurl:==>", req.originalUrl);

        next();
      },
      shopify.ensureInstalledOnShop(),
      async (_req, res, _next) => {
        // console.log('middleware', shopify.ensureInstalledOnShop())

        return res
          .status(200)
          .set("Content-Type", "text/html")
          .send(readFileSync(join(STATIC_PATH, "index.html")));
      }
    );

    app.listen(PORT);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();

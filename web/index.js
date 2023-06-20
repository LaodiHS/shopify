// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import { createProxyMiddleware } from "http-proxy-middleware";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import * as util from "util";

const log = (obj) =>
  console.log(util.inspect(obj, { depth: null, colors: true }));

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend`;

const app = express();
app.use(express.json());
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.get("/api/user", async (_req, res) => {
  const userData = await shopify.api.rest.User.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(userData);
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/all", async (_req, res) => {
  try {
    const all = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
      limit: 150,
      fields:
        "id,image,title,body_html,collection_type,handle,published_scope,published_status,vendor,options,tags,variants",
    });
    log(all);

    res.status(200).send(all);
  } catch (error) {
    console.log("error message--->", error.message);
  }
});

app.get("/api/inventory-item/", async (_req, res) => {
  // if (_req.params.id && _req.params.id !== "") {
  //   const item = await shopify.api.rest.InventoryItem.find({
  //     session: res.locals.shopify.session,
  //     id: _req.params.id
  //   });
  //   res.status(200).send(item);
  // }
  // else {
  //   res.status(400).send({ success: false, error: "No ID provided" });
  // }
});

app.get("/api/country/all", async (_req, res) => {
  const all = await shopify.api.rest.Country.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(all);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());

// Proxy specific routes to the Ionic development server
// const proxyOptions = {
//   target: "http://localhost:8100", // Replace with your Ionic development server URL
//   changeOrigin: true,
// };

// const proxy = createProxyMiddleware(["/your-proxy-path"], proxyOptions);
// app.use(proxy);

// Serve static files for other routes

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);

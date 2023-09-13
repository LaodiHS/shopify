import express from "express";
import { shopify } from "./shopify.js";
import { billingConfig, isTest } from "./billing.js";
import webhookHandlers from "./webhook-handlers.js";
export async function authentication() {
  /* !!!!!!!!!!!!!!!!!!!
  Start this order is important, the app will break if changed. Do not change the order app.use is order sensitive to shopify authentication flow */

  const app = express();

  try {
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
        console.log("has payment: " + hasPayment);
        if (hasPayment) {
          console.log('has payment: ' + hasPayment);
          next();
        } else {
          const redirectUrl = await shopify.api.billing.request({
            session,
            plan: plans[0],
            isTest: isTest,
          });
          res.redirect(redirectUrl)
          // redirectOutOfAPP(req, res, session.shop, redirectUrl);
        }
      },
      // Load the app otherwise
      shopify.redirectToShopifyOrAppRoot()
    );
    app.post(
      shopify.config.webhooks.path,
      shopify.processWebhooks({
        webhookHandlers,
      })
    );
    // If you are adding routes outside of the /api path, remember to
    // also add a proxy rule for them in web/frontend/vite.config.js
    app.use("/api/*", shopify.validateAuthenticatedSession());
    app.use(express.json());
  } catch (e) {
    console.log("error", e);
  }
  return app;
}



export async function redirectOutOfAPP(req, res, shop, redirectUri) {
  if (redirectUri.length) {
    console.log("redirect uri", redirectUri);
    try {
      const r = shopify.redirectOutOfApp({
        req,
        res,
        redirectUri: redirectUri,
        shop: shopify.api.utils.sanitizeShop(shop),
      });
    } catch (error) {
      console.log("errror---->", error);
      //throw error;
    }
  }
}

import express from "express";
import { shopify } from "./shopify.js";
import { billingConfig, isTest } from "./billing.js";
import webhookHandlers from "./webhook-handlers.js";
import compression from "compression"
import crypto from "crypto"
import { Shopify } from "@shopify/shopify-api";



function generateETagForResponse(req, content) {
  const hash = crypto.createHash('md5'); // You can use a different hashing algorithm if preferred
  hash.update(content);
  return hash.digest('hex');
}



export async function authentication() {
  /* !!!!!!!!!!!!!!!!!!!
  Start this order is important, the app will break if changed. Do not change the order app.use is order sensitive to shopify authentication flow */

  const app = express();
// debug(app, []);
//   app.use(async (req, res, next) => {
//     const shop = shopify.api.utils.sanitizeShop(req.query.shop);

//     res.setHeader(
//         'Content-Security-Policy',
//         `frame-ancestors https://admin.shopify.com ${shop ? 'https://' + encodeURIComponent(shop) : ''}`,
//     );
//     next();
// });


// Example usage in your middleware
// app.use((req, res, next) => {
//   // Generate the ETag based on the response content
//   const responseContent = 'Your response content here';
//   const etag = generateETagForResponse(req, responseContent);

//   // Set the ETag header
//   res.setHeader('ETag', etag);

//   // Check If-None-Match header from the client and respond with 304 if matched
//   if (req.headers['if-none-match'] === etag) {
//     return res.sendStatus(304); // Not Modified
//   }

//   // Continue with the request if no match
//   next();
// });

 


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
        if (true || hasPayment) {
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
        // All endpoints after this point will require an active session
    app.use("/api/*", shopify.validateAuthenticatedSession());

    // All endpoints after this point will have access to a request.body
    // attribute, as a result of the express.json() middleware
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

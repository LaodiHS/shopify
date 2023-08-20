import shopify from "./shopify.js";
import { billingConfig, isTest } from "./billing.js";

export function authentication(app) {
  app.get(
    shopify.config.auth.callbackPath,
    shopify.auth.callback(),

    async (req, res, next) => {
      console.log("callback path-----> ");
    },
    // Load the app otherwise
    shopify.redirectToShopifyOrAppRoot()
  );

  app.get(
    "/api/endpoint-that-redirects",
    shopify.validateAuthenticatedSession(),
    // redirectOutOfApp will cause App Bridge to trigger the redirect
    subscriptionMiddleWearCheck,
    (req, res) => {
      // Handle request as usual
    }
  );
  app.get(
    "/api/auth/callback",
    // shopify.validateAuthenticatedSession(),
    // redirectOutOfApp will cause App Bridge to trigger the redirect

    (req, res) => {
      console.log("callback path here =====>");
      // Handle request as usual
    }
  );

  app.get(
    "/html-endpoint",
    shopify.ensureInstalledOnShop(),
    // redirectOutOfApp will cause the app to break out of the iframe
    subscriptionMiddleWearCheck,
    (req, res) => {
      // Handle request as usual
    }
  );
}
// const {
//     embedded: '1',
//     hmac: 'c8a4e05896fcfd230f4aa23c64eee32c7e3eaaf469aff7b88c7d5ec567fa5039',
//    host: 'cXVpY2tzdGFydC1iODBjZDE0OS5teXNob3BpZnkuY29tL2FkbWlu',
//       locale: 'en',
//       session: 'd0916e0dacfa170de896e86e73237e114572be1baf6488166c0894fc38ae33fb',
//      shop: 'quickstart-b80cd149.myshopify.com',
//      timestamp: '1692555551'
//     11:19:12 } = req.query;
export async function subscriptionMiddleWearCheck(req, res, next) {
  console.log("shop", req.query,'---locals---', res.locals.shopify.session);
  const {shop} = res.locals.shopify.session;
//   let session; 
//   if(req.query  && Object.keys(req.query).length ){
//   const { embedded, hmac, host, locale, session, shop, timestamp } = req.query;
//   session = session;
//   }else if(res?.locals?.shopify?.session && Object.keys(res?.locals?.shopify?.session).length){
//     const {session, shop, }
//   }
// return ;

  const session = res.locals.shopify.session;
  console.log("redirectRequired---->", session);

  const plans = Object.keys(billingConfig);
  console.log("has plan", shopify.config.auth.path);

  const hasPayment = await shopify.api.billing.check({
    session,
    plans: plans,
    isTest,
  });

  if (hasPayment) {
    next();
  } else {
    console.log("has no plan");

    const redirectUri = await shopify.api.billing.request({
      session,
      plan: plans[0],
      isTest: isTest,
    });
    try {
     await redirectOutOfAPP(req, res, shop, redirectUri);
    } catch (err) {
      console.error("redirect failure", err);
    }
  }
}

export async function redirectOutOfAPP(req, res,shop, redirectUri) {
  if (redirectUri.length) {
    console.log('redirect uri', redirectUri);
    try {
  const r =   shopify.redirectOutOfApp({
        req,
        res,
        redirectUri: redirectUri,
        shop: shopify.api.utils.sanitizeShop(shop),
      });
      console.log('r--->', r)
    } catch (error) {
        console.log('errror---->',error)
     //throw error;
    }
  }
}

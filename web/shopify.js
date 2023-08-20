import { env } from "./envVars.js";
import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-07";

// let { restResources }  = await import( `@shopify/shopify-api/rest/admin/${LATEST_API_VERSION}`);
import { billingConfig } from "./billing.js";
const DB_PATH = `${process.cwd()}/database.sqlite`;

const { SCOPES, SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_URL } =
  process.env;

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.

const shopify = shopifyApp({
  api: {
    apiKey: SHOPIFY_API_KEY,
    apiSecretKey: SHOPIFY_API_SECRET,
    // scopes:[SCOPES],
    scopes: SCOPES?.split(","),

    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: billingConfig, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new SQLiteSessionStorage(DB_PATH),
});

export default shopify;




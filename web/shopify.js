import { env } from "./envVars.js";
import {
  BillingInterval,
  LATEST_API_VERSION,
  LogSeverity,
} from "@shopify/shopify-api";

import { shopifyApp } from "@shopify/shopify-app-express";
import { RedisSessionStorage } from "@shopify/shopify-app-session-storage-redis";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-07";
// let { restResources }  = await import( `@shopify/shopify-api/rest/admin/${LATEST_API_VERSION}`);
import { billingConfig } from "./billing.js";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { RedisConnectionString } from "./dev_production_vars.js";
const { SCOPES, SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = process.env;
const DB_PATH = `${process.cwd()}/database.sqlite`;
// const sessionStorage = new RedisSessionStorage(RedisConnectionString);

const shopify = shopifyApp({
  api: {
    apiKey: SHOPIFY_API_KEY,
    apiSecretKey: SHOPIFY_API_SECRET,
    scopes: SCOPES?.split(","),
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: billingConfig, // or replace with billingConfig above to enable example billing
    logger: {
      level: LogSeverity.Debug,
    },
  },

  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },

  sessionStorage: new RedisSessionStorage(
    RedisConnectionString
  ),
  //new SQLiteSessionStorage(DB_PATH),
  useOnlineTokens: true,
});

// export { sessionStorage };

export { shopify };

// storeSession(session: Session): Promise<boolean>;
// loadSession(id: string): Promise<Session | undefined>;
// deleteSession(id: string): Promise<boolean>;
// deleteSessions(ids: string[]): Promise<boolean>;
// findSessionsByShop(shop: string): Promise<Session[]>;

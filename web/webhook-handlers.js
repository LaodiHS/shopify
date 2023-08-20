import { DeliveryMethod } from "@shopify/shopify-api";
import productTaggingQueue from "./product-tagging-queue.js";
import * as userStore from "./userStore.js";
import { billingConfig } from "./billing.js";
const receievedWebhooks = {};
/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      // Check we haven't already receieved this webhook
      console.log("hit====>", webhookId);
      if (receievedWebhooks[webhookId]) return;
      // Add to our list of receieved webhooks
      receievedWebhooks[webhookId] = true;
      // Add to our queue for processing
      const product = JSON.parse(body);
      console.log("product===>", product);
      productTaggingQueue.push({ shop, product });
    },
  },

  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }
      console.log("customer Data request==>", JSON.stringify(payload));
    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
      console.log("customer redact payload: ", JSON.stringify(payload));
    },
  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */

  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
      console.log("shop Redact====>", JSON.stringify(payload));
    },
  },

  //   {"app_subscription":{
  //     "admin_graphql_api_id":"gid://shopify/AppSubscription/30376821056",
  //     "name":"basic",
  //     "status":"CANCELLED",
  //     "admin_graphql_api_shop_id":"gid://shopify/Shop/77950779712",
  //     "created_at":"2023-08-15T12:20:39-04:00",
  //     "updated_at":"2023-08-15T13:48:51-04:00",
  //     "currency":"USD",
  //     "capped_amount":null
  //   }
  // }

  APP_SUBSCRIPTIONS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(shop, "shop");
      if (payload.app_subscription) {
        let {
          name,
          status,
          admin_graphql_api_shop_id,
          created_at,
          updated_at,
          currency,
          capped_amount,
        } = payload.app_subscription;
        if (capped_amount === null) {
          capped_amount = 0;
        }
        const userData = {
          shop,
          gptText: "",
          capped_usage: billingConfig[name.trim()].tokens,
          current_usage: 0,
          subscription_name: name,
          created_at,
          currency,
          capped_amount,
          status,
          updated_at,
          seen: false,
        };

        try {
          await userStore.writeJSONToFileAsync(shop, userData);
        } catch (err) {
          console.log("error writing", err);
        }
      }
      console.log("payload subscription update==>", JSON.stringify(payload));
    },
  },
};

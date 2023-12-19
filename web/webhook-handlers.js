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
      // console.log("hit====>", webhookId);
      if (receievedWebhooks[webhookId]) return;
      // Add to our list of receieved webhooks
      receievedWebhooks[webhookId] = true;
      // Add to our queue for processing
      const product = JSON.parse(body);
      // console.log("product===>", product);
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
      // console.log("customer Data request==>", JSON.stringify(payload));
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
      // console.log("customer redact payload: ", JSON.stringify(payload));
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
      // console.log("shop Redact====>", JSON.stringify(payload));
    },
  },

  // {
  //   "id": 77950779712,
  //   "name": "brain-ai",
  //   "email": "hasanseirafi69@gmail.com",
  //   "domain": "quickstart-b80cd149.myshopify.com",
  //   "province": "California",
  //   "country": "US",
  //   "address1": " 10421 Comanche 
  //   ave ","
  //   zip ":"
  //   92503 ","
  //   city ":"
  //   Riverside ","
  //   source ":null,"
  //   phone ":"
  //   9515983130 ","
  //   latitude ":33.902567,"
  //   longitude ":-117.4573594,"
  //   primary_locale ":"
  //   en ","
  //   address2 ":"
  //   ","
  //   created_at ":"
  //   2023 - 06 - 10 T13: 13: 09 - 04: 00 ","
  //   updated_at ":"
  //   2023 - 06 - 10 T19: 25: 36 - 04: 00 ","
  //   country_cod
  //   e ":"
  //   US ","
  //   country_name ":"
  //   United States ","
  //   currency ":"
  //   USD ","
  //   customer_email ":"
  //   hasanseirafi69 @gmail.com ","
  //   timezone ":" (GMT - 05: 00) America / New_York ","
  //   iana_timezone ":"
  //   America / New_York ","
  //   shop_owner ":"
  //   Hasan
  //   Seirafi ","
  //   money_format ":"
  //   $ {
  //       {
  //           amount
  //       }
  //   }
  //   ","
  //   money_with_currency_format ":"
  //   $ {
  //       {
  //           amount
  //       }
  //   }
  //   USD ","
  //   weight_unit ":"
  //   lb ","
  //   province_code ":"
  //   CA ","
  //   taxes_included ":false,"
  //   auto_configure_tax_inclusivity ":null,"
  //   tax_shipping ":null,"
  //   county_taxes ":true,"
  //   plan_display_name ":"
  //   Developer Preview ","
  //   plan_name ":"
  //   partner_test ","
  //   has_discounts ":true,"
  //   has_gift_cards ":true,"
  //   myshopify_domain ":"
  //   quickstart - b80cd149.myshopify.com ","
  //   google_apps_domain ":null,"
  //   google_apps_login_enabled ":null,"
  //   money_in_emails_format ":"
  //   $ {
  //       {
  //           amount
  //       }
  //   }
  //   ","
  //   money_with_currency_in_emails_format ":"
  //   $ {
  //       {
  //           amount
  //       }
  //   }
  //   USD ","
  //   eligible_for_payments ":true,"
  //   requires_extra_payments_agreement ":false,"
  //   password_enabled ":true,"
  //   has_storefront ":true,"
  //   finances ":true,"
  //   primary_location_id ":85641789760,"
  //   checkout_api_supported ":true,"
  //   multi_location_enabled ":true,"
  //   setup_required ":false,"
  //   pre_launch_enabled ":false,"
  //   ena
  //   bled_presentment_currencies ":["
  //   AED ","
  //   AUD ","
  //   CAD ","
  //   CHF ","
  //   CZK ","
  //   DKK ","
  //   EUR ","
  //   GBP ","
  //   HKD ","
  //   ILS ","
  //   JPY ","
  //   KRW ","
  //   MXN ","
  //   MYR ","
  //   NZD ","
  //   PLN ","
  //   SEK ","
  //   SGD ","
  //   USD "],"
  //   transactional_sms_disabled ":false,"
  //   marketing_sms_consent_enabled_at_checkout ":false}

  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(shop, "shop");
      if (payload.app_subscription) {
        let {
          name,
          email,
          country,
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
      // console.log("app uninstalled==>", JSON.stringify(payload));
    },
  },

  
  //   {"app_subscription":{
  //     "admin_graphql_api_id":"gid://shopify/AppSubscription/30376821056",
  //     "name":"chestnut",
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
      console.log('payload', payload);
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
      // console.log("payload subscription update==>", JSON.stringify(payload));
    },
  },
};

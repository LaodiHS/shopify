import { GraphqlQueryError, BillingInterval } from "@shopify/shopify-api";
import {shopify} from "./shopify.js";

const USAGE_CHARGE_INCREMENT_AMOUNT = 1.0;
export const isTest = true;
export const monthlySubscriptionsTokens = {
  basic: { tokens: 469618 },
  crafted: { tokens: 939236 },
  advanced: { tokens: 1878472 },
};
export const billingConfig = {
  // "usage": {
  //   // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  //   amount: 9.0,
  //   currencyCode: "USD",
  //   interval: BillingInterval.Usage,
  //   usageTerms: "One dollar per button click",
  // },
  basic: {
    amount: 30.0,
    tokens: 469618,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
    usageTerms: [
      "preview your rendered descriptions",
      "Generate descriptions from a selection of contextual templates",
      "select key points from your products, variants, and collections",
      "expand on an existing description",
      "track key points in the composition",
    ],
  },
  crafted: {
    amount: 60.0,
    tokens: 939236,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
    usageTerms: [
      "preview your rendered html descriptions",
      "Generate descriptions from a selection of advanced contextual templates",
      "select key points from your products, variants, and collections",
      "expand on an existing description",
      "track key points in the composition",
      "access to advanced markup tools, Html, Markdown, and Katex",
      "real time markup rendering, so you can see the results of your composition in real time",
      "markup inspection and auto fix",
    ],
  },
  advanced: {
    amount: 100.0,
    tokens: 1878472,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
    usageTerms: [
      "Generate descriptions from template",
      "Select key points from your product",
      "Include variant selections",
      "Image analysis",
      "Generate articles and social posts",
      "Advanced language options",
      "Advanced document formats",
      "Regional audience selection",
    ],
  },
};

export async function requestBilling(res, next) {
  const plans = Object.keys(billingConfig);
  const session = res.locals.shopify.session;
  const hasPayment = await shopify.api.billing.check({
    session,
    plans: plans,
    isTest: true,
  });

  if (hasPayment) {
    next();
  } else {
    res.redirect(
      await shopify.api.billing.request({
        session,
        plan: plans[0],
        isTest: true,
      })
    );
  }
}

const CREATE_USAGE_RECORD = `
mutation appUsageRecordCreate($subscriptionLineItemId: ID!, $amount: Decimal!, $description: String!){
    appUsageRecordCreate(
      subscriptionLineItemId: $subscriptionLineItemId,
      description: $description,
      price: { amount: $amount, currencyCode: USD }
    ) {
      userErrors {
        field
        message
      }
      appUsageRecord {
        id
      }
    }
  }
`;

const HAS_PAYMENTS_QUERY = `
query appSubscription {
  currentAppInstallation {
    activeSubscriptions {
          id
          name
          lineItems {
                id
                plan {
                  pricingDetails {
                    __typename
                    ... on AppUsagePricing {
                      terms
                      balanceUsed {
                        amount
                      }
                      cappedAmount {
                        amount
                      }
                    }
                  }
                }
              }
          }
        }
    }
`;
/*
 * This function creates a usage record for the app subscription.
 * To create a usage record, we need to know the app subscription line item ID.
 * You may want to store this ID in your database, but for simplicity, we are
 * querying the API for it here.
 */
export async function createUsageRecord(session) {
  const client = new shopify.api.clients.Graphql({ session });
  const subscriptionLineItem = await getAppSubscription(session);
  const plan = Object.keys(billingConfig)[0];
  const res = {
    capacityReached: false,
    createdRecord: false,
  };

  // If the capacity has already been reached, we will not attempt to create the usage record
  // On production shops, if you attempt to create a usage record and the capacity and been
  // reached Shopify will return an error. On development shops, the usage record will be created
  if (
    subscriptionLineItem.balanceUsed + USAGE_CHARGE_INCREMENT_AMOUNT >
    subscriptionLineItem.cappedAmount
  ) {
    res.capacityReached = true;
    return res;
  }

  try {
    // This makes an API call to Shopify to create a usage record
    await client.query({
      data: {
        query: CREATE_USAGE_RECORD,
        variables: {
          subscriptionLineItemId: subscriptionLineItem.id,
          amount: USAGE_CHARGE_INCREMENT_AMOUNT,
          description: billingConfig[plan].usageTerms.join(",\n"),
        },
      },
    });
    res.createdRecord = true;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }

  if (
    subscriptionLineItem.balanceUsed + USAGE_CHARGE_INCREMENT_AMOUNT >=
    subscriptionLineItem.cappedAmount
  ) {
    res.capacityReached = true;
  }
  return res;
}

/*
 * This function queries the API to get the app subscription line item ID by the
 * plan name and usage terms. You may want to store this ID in your database, but
 * for simplicity, we are querying the API for it here.
 */
async function getAppSubscription(session) {
  const client = new shopify.api.clients.Graphql({ session });
  let subscriptionLineItem = {};
  const planName = Object.keys(billingConfig)[0];
  const planDescription = billingConfig[planName].usageTerms.join(",\n");

  try {
    const response = await client.query({
      data: {
        query: HAS_PAYMENTS_QUERY,
      },
    });
    response.body.data.currentAppInstallation.activeSubscriptions.forEach(
      (subscription) => {
        if (subscription.name === planName) {
          subscription.lineItems.forEach((lineItem) => {
            if (lineItem.plan.pricingDetails.terms === planDescription) {
              subscriptionLineItem = {
                id: lineItem.id,
                balanceUsed: parseFloat(
                  lineItem.plan.pricingDetails.balanceUsed.amount
                ),
                cappedAmount: parseFloat(
                  lineItem.plan.pricingDetails.cappedAmount.amount
                ),
              };
            }
          });
        }
      }
    );
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
  return subscriptionLineItem;
}

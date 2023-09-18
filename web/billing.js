import { GraphqlQueryError, BillingInterval } from "@shopify/shopify-api";
import { shopify } from "./shopify.js";
import { numberToWords } from "./utility.js";
const USAGE_CHARGE_INCREMENT_AMOUNT = 1.0;
export const isTest = true;
export const monthlySubscriptionsTokens = {
  chestnut: { tokens: 469618 },
  sourwood: { tokens: 939236 },
  acacia: { tokens: 1878472 },
};

const margin = 0.3;
const hoursLogged = 2 * ((12 - 4 + 15) * 30);
const Tokens = { chestnut: 469618, sourwood: 939236, acacia: 1878472 };
const removeMargin = (tokens) => Math.floor(tokens - tokens * margin);
const getWordCount = (tokens) => Math.floor(removeMargin(tokens / 1000) * 750);
const getNovelCount = (words) => Math.floor(getWordCount(words) / 50000);
const dollarFormat = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

const TokenTransForm = (Tokens) => {
  return Object.entries(Tokens).reduce((tokenObject, [subscription, token]) => {
    tokenObject[subscription] = {
      tokens: removeMargin(token),
      novel: getNovelCount(token),
      wordCount: getWordCount(token),
      developmentCost: dollarFormat(72.0 * hoursLogged),
      apiCost: dollarFormat(0.004 * (token / 1000)),
    };

    return tokenObject;
  }, {});
};

const Allotment = TokenTransForm(Tokens);
// console.log('Allotment--------->', Allotment.acacia.wordCount);
export const billingConfig = {
  // "usage": {
  //   // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  //   amount: 9.0,
  //   currencyCode: "USD",
  //   interval: BillingInterval.Usage,
  //   usageTerms: "One dollar per button click",
  // },

  chestnut: {
    amount: 30.0,
    tokens: Allotment.chestnut.tokens,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
    usageTerms: [
      {
        name: "Real-time AI Streaming",
        description:
          "Unleash the power of AI in the blink of an eye! Experience instant intelligence with our real-time streaming.",
      },
      {
        name: "AI-Assisted Description Generation",
        description:
          "Transform your thoughts into captivating words effortlessly! Let AI be your literary companion.",
      },
      {
        name: "AI-Curated Descriptions",
        description:
          "Polish your product's persona with AI finesse! Let the virtual curator bring out its best.",
      },
      {
        name: "Rendered HTML Descriptions",
        description:
          "Dress your products in the finest digital attire! Our HTML descriptions are tailored for the runway of the web.",
      },
      {
        name: "Tone Template Options",
        description:
          "Speak your brand's language, loud and clear! Choose from a symphony of tones with our template orchestra.",
      },
      {
        name: "Generate Descriptions from Contextual Templates",
        description:
          "Dive deep into your product's world! Craft descriptions that feel like they were written just for your audience.",
      },
      // {
      //   name: "SEO Tracker",
      //   description:
      //     "Give your products a compass in the digital wilderness! Our SEO tracker is the pathfinder for top search rankings.",
      // },
      {
        name: "Targeted SEO Strategies",
        description:
          "Arm your products with precision! Hit the SEO bullseye by pinpointing the essence of each offering.",
      },
      {
        name: "Enhance Existing Product Descriptions",
        description:
          "Breathe new life into your product's story! Let AI sprinkle its magic dust on your existing descriptions.",
      },
      {
        name: "Trackable SEO Requirements",
        description:
          "Turn compliance into clarity! Our trackable requirements keep your product descriptions on the SEO radar.",
      },
      {
        name: "Generous Word Limit ",
        description:
          "Write novels, not just descriptions! Enjoy the freedom of expression with a monthly word limit that's truly novel.",
        details: {
          wordCount:
            numberToWords(Allotment.chestnut.wordCount) +
            "-word monthly allowance",
          novel:
            "Equivalent to " +
            numberToWords(Allotment.chestnut.novel) +
            " novels worth of text each month.",
        },
      },
    ],
  },
  sourwood: {
    amount: 60.0,
    tokens: Allotment.sourwood.tokens,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
    usageTerms: [
      {
        name: "Real-time AI Streaming",
        description:
          "Unleash the power of AI in the blink of an eye! Experience instant intelligence with our real-time streaming.",
      },
      {
        name: "AI-Assisted Description Generation",
        description:
          "Transform your thoughts into captivating words effortlessly! Let AI be your literary companion.",
      },
      {
        name: "AI-Curated Descriptions",
        description:
          "Polish your product's persona with AI finesse! Let the virtual curator bring out its best.",
      },
      {
        name: "Rendered HTML Descriptions",
        description:
          "Dress your products in the finest digital attire! Our HTML descriptions are tailored for the runway of the web.",
      },
      {
        name: "Tone Template Options",
        description:
          "Speak your brand's language, loud and clear! Choose from a symphony of tones with our template orchestra.",
      },
      {
        name: "Generate Descriptions from Contextual Templates",
        description:
          "Dive deep into your product's world! Craft descriptions that feel like they were written just for your audience.",
      },
      {
        name: "SEO Tracker",
        description:
          "Give your products a compass in the digital wilderness! Our SEO tracker is the pathfinder for top search rankings.",
      },
      {
        name: "Targeted SEO Strategies",
        description:
          "Arm your products with precision! Hit the SEO bullseye by pinpointing the essence of each offering.",
      },
      {
        name: "Enhance Existing Product Descriptions",
        description:
          "Breathe new life into your product's story! Let AI sprinkle its magic dust on your existing descriptions.",
      },
      {
        name: "Trackable SEO Requirements",
        description:
          "Turn compliance into clarity! Our trackable requirements keep your product descriptions on the SEO radar.",
      },
      {
        name: "Preview Rendered HTML Descriptions",
        description:
          "Get a sneak peek of your products' digital elegance! Preview rendered HTML descriptions before they go live.",
      },
      {
        name: "Generate Advanced Contextual Templates",
        description:
          "Unlock a treasure trove of acacia contextual templates! Craft descriptions that resonate on a deeper level.",
      },
      {
        name: "Select Key Points for Precision",
        description:
          "Handpick critical points for a targeted approach! Select key features from your products, variants, and collections.",
      },
      {
        name: "Diverse Templates for Diverse Audiences",
        description:
          "Speak to every corner of your audience with a wider template selection! Tailor descriptions for specific SEO purposes.",
      },
      {
        name: "Expand on Existing Descriptions",
        description:
          "Let your products' stories flourish! Expand and enrich existing descriptions with AI-powered creativity.",
      },
      {
        name: "Track Composition Key Points",
        description:
          "Keep your composition on point! Track crucial elements in your product descriptions for maximum impact.",
      },
      {
        name: "SEO Analysis in Real Time",
        description:
          "Stay ahead of the curve with instant SEO insights! Get real-time analysis to boost your search rankings.",
      },
      {
        name: "Real-time Document Analysis",
        description:
          "See your documents come to life in real time! Get instant insights and improvements for your product descriptions.",
      },
      {
        name: "Access Readability Metrics in Real Time",
        description:
          "Ensure your content is a breeze to read! Access real-time readability metrics for clear, engaging descriptions.",
      },
      {
        name: "Access Sentiment Analysis in Real Time",
        description:
          "Feel the pulse of your audience! Get real-time sentiment analysis to craft descriptions that resonate emotionally.",
      },
      {
        name: "Create Shopify Blogs Generate Compelling Articles",
        description:
          "Elevate your content game! Generate articles that engage and inform your audience like never before.",
      },
      {
        name: "Unlock Advanced Language Capabilities",
        description:
          "Unleash the full power of language! Access acacia linguistic features for descriptions that truly stand out.",
      },
      {
        name: "Unprecedented Word Limit",
        description:
          "Write epics, not just descriptions! Enjoy an astounding " +
          numberToWords(Allotment.sourwood.wordCount) +
          "-word monthly allowance — equivalent to " +
          numberToWords(Allotment.sourwood.novel) +
          " full-length novels!",
        details: {
          wordCount:
            numberToWords(Allotment.sourwood.wordCount) +
            "-word monthly allowance",
          novel:
            "Equivalent to " +
            numberToWords(Allotment.sourwood.novel) +
            " novels worth of text each month.",
        },
      },
    ],
  },
  acacia: {
    amount: 100.0,
    tokens: Allotment.acacia.tokens,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
    usageTerms: [
      {
        name: "Enhance Existing Product Descriptions",
        description: "Revitalize your product's narrative! Let AI infuse a touch of magic into your current descriptions."
      },
      {
        name: "Trackable SEO Requirements",
        description: "Transform compliance into crystal clarity! Our traceable requirements ensure your product descriptions are SEO-ready."
      },
      {
        name: "Preview Rendered HTML Descriptions",
        description: "Sneak a peek at your products' digital allure! Preview rendered HTML descriptions before they make their grand debut."
      },
      {
        name: "Generate Advanced Contextual Templates",
        description: "Unearth a trove of acacia contextual templates! Craft descriptions that resonate on a profound level."
      },
      {
        name: "Select Key Points for Precision",
        description: "Curate essential features for a laser-focused approach! Handpick critical elements from your products, variants, and collections."
      },
      {
        name: "Diverse Templates for Diverse Audiences",
        description: "Speak to every corner of your audience with an expansive template selection! Tailor descriptions for specific SEO strategies."
      },
      {
        name: "Expand on Existing Descriptions",
        description: "Let your product stories flourish! Expand and enrich existing descriptions with a dash of AI-powered creativity."
      },
      {
        name: "Track Composition Key Points",
        description: "Maintain compositional excellence! Keep an eye on pivotal elements in your product descriptions for maximum impact."
      },
      {
        name: "SEO Analysis in Real Time",
        description: "Stay ahead with instant SEO insights! Receive real-time analysis to propel your search rankings."
      },
      {
        name: "Real-time Document Analysis",
        description: "Witness your documents come alive in real time! Gain immediate insights and enhancements for your product descriptions."
      },
      {
        name: "Access Readability Metrics in Real Time",
        description: "Ensure your content is effortlessly readable! Access real-time readability metrics for descriptions that captivate."
      },
      {
        name: "Access Sentiment Analysis in Real Time",
        description: "Feel the heartbeat of your audience! Obtain real-time sentiment analysis to craft emotionally resonant descriptions."
      },
      {
        name: "Create Shopify Blogs Generate Compelling Articles",
        description: "Elevate your content game! Generate articles that engage and inform your audience like never before."
      },
      {
        name: "Unlock Advanced Language Capabilities",
        description: "Unleash the full linguistic prowess! Access acacia language features for descriptions that truly stand out."
      },
      {
        name: "Select Key Points for Precision",
        description: "Empower your product's voice! Handpick the spotlight for a narrative that truly sings."
      },
      {
        name: "SEO Analysis",
        description: "Be the SEO maestro! Conduct symphonies of search success with our powerful analysis tool."
      },
      {
        name: "Real Time Document Analysis",
        description: "Witness evolution in ink! Watch your content transform in real time with instant insights."
      },
      {
        name: "Access to Real Time Readability Metrics",
        description: "Become the readability virtuoso! Tune your content for clarity with real-time metrics."
      },
      {
        name: "Access to Real Time Sentiment Analysis",
        description: "Feel the pulse of your audience's heartstrings! Dive into real-time emotions for captivating descriptions."
      },
      {
        name: "Generate Descriptions from Templates",
        description: "Turn your products into poetry! Craft compelling narratives effortlessly with template magic."
      },
      {
        name: "Advanced Template Selections",
        description: "Design your descriptions like a virtuoso! Choose from an orchestra of acacia templates."
      },
      {
        name: "Image Analysis and Placement",
        description: "Paint your story with pixels! Analyze and position images for an eye-catching masterpiece."
      },
      {
        name: "Advanced Support Options",
        description: "Embark on a personalized support journey! Your success story, our dedicated soundtrack."
      },
      {
        name: "Dedicated Support Channel and Feature Request Options",
        description: "Your VIP pass to excellence! Gain exclusive access to a concierge of support."
      },
      {
        name: "Early Access to Advanced Features",
        description: "Be the pioneer of possibility! Unlock the future before anyone else with cutting-edge capabilities."
      },
      {
        name: "Unprecedented Word Limit",
        description: "Write the epic saga! Harness a monumental " + numberToWords(Allotment.acacia.wordCount) + "-word monthly allowance — an odyssey of expression!",
        details: {
          wordCount:
            numberToWords(Allotment.acacia.wordCount) +
            "-word monthly allowance",
          novel:
            "Equivalent to " +
            numberToWords(Allotment.acacia.novel) +
            " novels worth of text each month.",
        },
      }
    ]
  },
};


export function usageTerms(plan){
return billingConfig[plan].usageTerms.map(description => description.name).join(",\n ");


}




// console.log('billingConfiguration', billingConfig);
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
          description: usageTerms(plan),
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
  const planDescription = usageTerms(planName);

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
            console.log('planName--->'  , planName)
            console.log('pricingDetails', lineItem.plan.pricingDetails.terms)
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

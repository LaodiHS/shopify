import { readJSONFromFileAsync, writeJSONToFileAsync } from "./userStore.js";
import { monthlySubscriptionsTokens } from "./billing.js";
// Sample users table data (you can replace this with your actual database or data source)
const users = [
  {
    id: 1,
    username: "user1",
    email: "user1@example.com",
    subscription_plan: "Basic Plan",
    usage_limit: 1000,
    current_usage: 750,
    last_payment_date: "2023-07-15",
  },
  // Add more user data as needed
];

// Function to get a user by their ID from the users table
export async function getUserByShopName(shop_name) {
  return await readJSONFromFileAsync(shop_name);
}

// Function to calculate the remaining usage limit for a user
export async function getRemainingUsage(shop_name) {
  const user = await getUserByShopName(shop_name);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!monthlySubscriptionsTokens[user.subscription_name]) {
    throw new Error("subscription not found.");
  }
  const usage_limit = monthlySubscriptionsTokens[user.subscription_name].tokens;
  console.log("usage", user.current_usage, "---", usage_limit);
  return usage_limit - user.current_usage;
}

// Function to check if a user has exceeded their usage limit
export async function hasExceededUsageLimit(shop_name, additionalTokens) {
  const remainingUsage = await getRemainingUsage(shop_name);
 
  return additionalTokens > remainingUsage;
}

// Function to charge a user for additional tokens beyond their usage limit
export async function chargeForAdditionalTokens(shop_name, additionalTokens) {
  // Implement the logic to calculate the cost of additional tokens based on your pricing model
  const costPerToken = 0.5; // Example: $0.01 per token
  const totalCharge = additionalTokens * costPerToken;

  // In a real implementation, you might record the charge in a billing system or payment gateway
  // For this example, we'll simply log the charge
  console.log(`Charging user ${shop_name} $${totalCharge.toFixed(2)}`);

  // Update the user's current_usage to reflect the additional tokens used
  const user = await getUserByShopName(shop_name);
  user.current_usage += additionalTokens;

  writeJSONToFileAsync(shop_name, user);
}

// Function to update a user's current_usage after processing a job
export async function updateTokenUsageAfterJob(shop_name, tokensUsed) {
  console.log('toekns used', tokensUsed);
  const user = await getUserByShopName(shop_name);
  if (user.current_usage) {
    user.current_usage += tokensUsed;
  } else {
    user.current_usage = tokensUsed;
  }

  writeJSONToFileAsync(shop_name, user);
}

export async function updateSubscription(shop_name, subscription_name) {
  if (Object.keys(monthlySubscriptionsTokens).includes(subscription_name)) {
    const user = await getUserByShopName(shop_name);
    user.shop = shop_name;
    const currentDate = new Date();

    if (!user.last_payment_date) {
      // If there is no last_payment_date, set it to the current date
      user.last_payment_date = currentDate;
    } else {
      // Calculate the number of days between the last payment date and the current date

      const timeDiff = currentDate - user.last_payment_date;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (daysDiff > 30) {
        // If it has been more than 30 days since the last payment
        // Reset the current_usage to 0 and update the last_payment_date
        user.current_usage = 0;
        user.last_payment_date = currentDate;
      }
    }

    user.subscription_name = subscription_name;
    await writeJSONToFileAsync(shop_name, user);
    return user;
  }
}

// Example usage:
//   const userId = 1;
//   const additionalTokensUsed = 300;

//   if (hasExceededUsageLimit(userId, additionalTokensUsed)) {
//     chargeForAdditionalTokens(userId, additionalTokensUsed);
//   }

// After processing a job, update the user's current_usage
//const tokensUsedByJob = 50;
//updateUsageAfterJob(userId, tokensUsedByJob);

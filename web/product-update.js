import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";


const UPDATE_DESCRIPTION_MUTATION = `mutation UpdateProductDescription($productId: ID!, $descriptionHtml: String!) {
  productUpdate(input: { id: $productId, descriptionHtml: $descriptionHtml }) {
    product {
      id
      title
      descriptionHtml
    }
  }
}`;

export default async function descriptionUpdate(session, productId, descriptionHtml) {
     const client = new shopify.api.clients.Graphql({ session });
    try {
        await client.query({
          data: {
            query: UPDATE_DESCRIPTION_MUTATION,
            variables: {
              productId: productId,
              descriptionHtml: descriptionHtml,
            },
          },
        });
    } catch (error) {

        if (error instanceof GraphqlQueryError) {
            throw new Error(
                `${error.message}\n${JSON.stringify(error.response, null, 2)}`
            );
        } else {
            throw error;
        }
    }
}
import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";


const UPDATE_METAFIELDS_MUTATION = `mutation updateProductVariantMetafields($input: ProductVariantInput!) {
  productVariantUpdate(input: $input) {
    productVariant {
      id
      metafields(first: $metafieldsCount) {
        edges {
          node {
            id
            namespace
            key
            value
          }
        }
      }
    }
    userErrors {
      message
      field
    }
  }`;

// const metafields = [
//       {
//         "namespace": "my_field",
//         "key": "liner_material",
//         "type": "single_line_text_field",
//         "value": "Synthetic Leather"
//       },
//       {
//         "id": "gid://shopify/Metafield/1069228968",
//         "value": "Rubber"
//       }
//     ]
// ;

export async function updateProductVariantMetafields(session,variantId, metafields) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    const { productVariantUpdate } = await client.query({
      data: {
        query: UPDATE_METAFIELDS_MUTATION,
        variables: {
          input: {
            id: variantId,
            metafields: metafields.map((metafield) => ({
              namespace: metafield.namespace,
              key: metafield.key,
              value: metafield.value,
              type: metafield.type,
            })),
          },
          metafieldsCount: metafields.length,
        },
      },
    });
    const { productVariant, userErrors } = productVariantUpdate;
    const { metafields } = productVariant;
    // Process the response data as needed
    console.log('updated metafields--->',metafields);
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



const UPDATE_DESCRIPTION_MUTATION = `mutation productVariantUpdate($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
          id
          title
          inventoryPolicy
          price
          compareAtPrice
        }
        userErrors {
          field
          message
        }
      }
    }`;

export async function variantUpdate(
  session,
  productId,
  compareAtPrice
) {
  const client = new shopify.api.clients.Graphql({ session });
  try {
    await client.query({
      data: {
        query: UPDATE_DESCRIPTION_MUTATION,
        variables: {
          id: productId,
          price: price,
          compareAtPrice: compareAtPrice,
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

import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";




// update products query to get images from media 
// example: 
//   products(first: 10 , after: "eyJsYXN0X2lkIjo4NDI3NjM2MDY0NTc2LCJsYXN0X3ZhbHVlIjoiODQyNzYzNjA2NDU3NiJ9") {
//   edges {
//     node {
//       id
//       media(first: 10) {
//         edges {
//           node {
//             ... on MediaImage {
//               image {
//                 height
//                 src
//                 width
//                 altText
//                 transformedSrc
//                 originalSrc
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

const PRODUCTS_QUERY = `query Products($first: Int = 5, $after: String, $variantsFirst: Int = 5, $imagesFirst: Int = 5) {
  products(first: $first, after: $after) {
    edges {
      node {
        id
        title
        handle
        descriptionHtml
        images(first: $imagesFirst) {
          edges {
            node {
              id
              altText
              transformedSrc
              width
              height
              originalSrc
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
  
        variants(first: $variantsFirst) {
          edges {
            node {
              id
              title
              price
              sku
              barcode
              weight
              weightUnit
              inventoryQuantity
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
        options {
          id
          name
          values
        }
        collections(first: 5) {
          edges {
            node {
              id
              title
              handle
              description
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
        tags
        metafields(first: 5) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}`;

export default async function getProducts(session, first = 5, after = null, before = null, variantsFirst = 5, imagesFirst = 5) {
  const client = new shopify.api.clients.Graphql({ session });

  console.log('api-version', client.apiVersion)

  try {
   

    const response = await client.query({
      data: {
        query: PRODUCTS_QUERY,
        variables: {
          first: first,
          after: after,
          variantsFirst: variantsFirst,
          imagesFirst: imagesFirst,
        },
      },
    });
      console.log('response message->',response.message)
     return response;
  } catch (error) {
    console.log('error---->', error)
    console.log('error----->', JSON.stringify(error));
    if (error instanceof GraphqlQueryError) {

      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}


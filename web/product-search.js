
import {shopify} from "./shopify.js";


function findProducts(){




}








export function productSearch(app){

    app.post("/api/product/find", async (req, res) => {
shopify.api.rest.Product.find
  
        let status = 200;
        let error = null;
        let data = null;
        try {
          let firstArg = 5;
          let afterArg = null;
  
          const { first, after } = req.body;
  
          firstArg = first || 5;
          afterArg = after || null;
  
          data = await getProducts(
            res.locals.shopify.session,
            firstArg,
            afterArg
          );
        } catch (err) {
          // console.log("Error-->", err);
          status = 500;
          error = err.message;
          data = null; // Reset data to null in case of an error
        }
        // console.log("paging Data====>:", data);
        res.status(status).send({ success: status === 200, data, error });
      });



} 
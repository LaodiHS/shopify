import shopify from "./shopify.js";
import { Page } from '@shopify/polaris';

// HTTP/1.1 201 Created

// {

//   "article": {

//     "id": 1051293790,

//     "title": "My new Article title",

//     "created_at": "2023-07-11T18:13:09-04:00",

//     "body_html": "<h1>I like articles</h1>\n<p><strong>Yea</strong>, I like posting them through <span class=\"caps\">REST</span>.</p>",

//     "blog_id": 241253187,

//     "author": "John Smith",

//     "user_id": 548380009,

//     "published_at": "2011-03-24T11:45:47-04:00",

//     "updated_at": "2023-07-11T18:13:09-04:00",

//     "summary_html": null,

//     "template_suffix": null,

//     "handle": "my-new-article-title",

//     "tags": "Has Been Tagged, This Post",

//     "admin_graphql_api_id": "gid://shopify/OnlineStoreArticle/1051293790"

//   }

// }

export async function createArticle({
  session,
  blog_id,
  title,
  author,
  body_html,
  published,
}) {
  try {
    const article = new shopify.api.rest.Article({
      session,
    });

    article.blog_id = blog_id;
    article.title = title;
    article.author = author;
    article.body_html = body_html;
    article.published = published;
    try {
      await article.save({
        update: true,
      });
      console.log('Article', article);
      return article;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

//response object
// {
//     "blog": {
//       "id": 1008414250,
//       "handle": "apple-main-blog",
//       "title": "Apple main blog",
//       "updated_at": "2023-07-11T18:16:15-04:00",
//       "commentable": "no",
//       "feedburner": null,
//       "feedburner_location": null,
//       "created_at": "2023-07-11T18:16:15-04:00",
//       "template_suffix": null,
//       "tags": "",
//       "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/1008414250"
//     }
//   }
// Function to create a blog
export async function createBlog({ session, title }) {
  try {
    const blog = new shopify.api.rest.Blog({ session });
    blog.title = title;
    await blog.save({
      update: true,
    });
    return blog; // Optionally, return the created blog data
  } catch (error) {
    console.error("Error creating blog:", error.message);
    throw error; // Propagate the error to the caller
  }
}


// HTTP/1.1 200 OK
// {
//   "blogs": [
//     {
//       "id": 382285388,
//       "handle": "banana-blog",
//       "title": "A Gnu Blog",
//       "updated_at": "2006-02-02T19:00:00-05:00",
//       "commentable": "no",
//       "feedburner": null,
//       "feedburner_location": null,
//       "created_at": "2023-07-11T17:47:36-04:00",
//       "template_suffix": null,
//       "tags": "",
//       "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/382285388"
//     },
//     {
//       "id": 241253187,
//       "handle": "apple-blog",
//       "title": "Mah Blog",
//       "updated_at": "2006-02-01T19:00:00-05:00",
//       "commentable": "no",
//       "feedburner": null,
//       "feedburner_location": null,
//       "created_at": "2023-07-11T17:47:36-04:00",
//       "template_suffix": null,
//       "tags": "Announcing, Mystery",
//       "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/241253187"
//     }
//   ]

// Function to list blogs
export async function listBlogs({ session }) {
  try {
    const response = await shopify.api.rest.Blog.all({
      session: session,
    });
    console.log('response', response);
    return response; // Optionally, return the list of blogs
  } catch (error) {
    console.error("Error listing blogs:", error);
    throw error; // Propagate the error to the caller
  }
}

export async function findBlog({session, id}){
try{

 return  await shopify.api.rest.Blog.find({
    session,
     id,
  });

}catch(error){
  console.error("Error listing blogs:", error);
  throw error;


  }
}

export function contentGenerator(app) {


app.post('/api/blog/id', async(req, res) => {
    let status = 200;
    let error = null;
    let data = null;

    try{
      const {id} = req.body
      console.log('id:', id);
      const {session} = res.locals.shopify
      const response = await findBlog({session, id})
      data = response.data;
      console.log('data:', data);
      }catch(err){
      status = err?.response?.code  ||  500 ;
      error = err.response;
       console.log('error------>:', error);
      }    



    res.status(status).json({ success: status === 200, data, error });
})

  app.get("/api/blog/list", async (req, res) => {
    let status = 200;
    let error = null;
    let data = null;

    try {
      const response = await listBlogs(res.locals.shopify);
      data = response.data
    } catch (error) {
      status = 500;
      error = error.message;
    }

    res.status(status).json({ success: status === 200, data, error });
  });


  app.post("/api/blog/create", async (req, res) => {
    let status = 200;
    let error = null;
    let data = null;
    const { session } = res.locals.shopify;
    const { title} = req.body;
    try {
      data = await createBlog({ session, title });
      console.log("name: " + name);
    } catch (error) {
      error = error.message;
      status = 500;
    }

    res.status(status).json({ success: status === 200, data, error });
  });

  app.post("/api/article/create", async (req, res) => {
    let status = 200;
    let error = null;
    let data = null;
    const { session } = res.locals.shopify;
    const { blog_id, title, author, body_html, published } = req.body;
    try {
    
      data = await createArticle({ session, ...req.body });
    } catch (error) {
      error = error.message;
      status = 500;
    }

    res.status(status).json({ success: status === 200, data, error });
  });
}

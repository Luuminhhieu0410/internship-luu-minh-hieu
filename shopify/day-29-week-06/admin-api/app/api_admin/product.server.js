
import { authenticate } from "../shopify.server";
export async function getProduct(request) {
  try {
    const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
        query {
  products(first: 10) {
    edges {
      
      node {
        id
        title
        handle
        createdAt
      	images(first: 1) {
          edges {
            node {
              id
              altText
              originalSrc
              transformedSrc
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
    }
  }
}

    `,
  );
  //   console.log('test ' + JSON.stringify (request));
  let data;
  if(response.ok ){
  data = await response.json();
  return data;
  }
  throw new Error('không thấy được dữ liệu');
  } catch (error) {
    console.log(error);
  }
}


export async function filterProduct(request, keyword) {
  const { admin } = await authenticate.admin(request);

  const query = `
  #graphql
    query($query: String!) {
      products(first: 10, query: $query) {
        edges {
          node {
            id
            title
            handle
            createdAt
            images(first: 1) {
              edges {
                node {
                  id
                  altText
                  originalSrc
                  transformedSrc
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    query: `title:*${keyword}*`
  };

  const response = await admin.graphql(query, { variables });
  const data = await response.json();
  return data;
}

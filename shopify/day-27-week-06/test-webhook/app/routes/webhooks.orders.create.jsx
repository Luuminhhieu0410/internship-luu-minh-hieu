import { authenticate } from "../shopify.server";
export const action = async ({ request }) => {
   const { shop, session, topic } = await authenticate.webhook(request);
  
    console.log('Order được tạo thành công');
  
  return new Response();
};

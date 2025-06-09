import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  console.log('request =======> ' +  JSON.stringify(request));
  return null;
};

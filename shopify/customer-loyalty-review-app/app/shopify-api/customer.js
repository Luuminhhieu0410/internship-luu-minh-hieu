import { authenticate } from "../shopify.server";
export async function getAdminCustomerList(request) {

  const {admin} = await authenticate.admin(request);
  const res = await admin.graphql(`
        query CustomerList {
  customers(first: 20) {
    nodes {
      id
      firstName
      lastName
      email
      createdAt
      updatedAt
      numberOfOrders
      state
      amountSpent {
        amount
        currencyCode
      }
      verifiedEmail
    }
  }
}
    `);
    if(!res.ok) throw new Error("không lấy được dữ liệu api customer ");
  const data = await res.json();
  return data.data.customers.nodes || [];
} 

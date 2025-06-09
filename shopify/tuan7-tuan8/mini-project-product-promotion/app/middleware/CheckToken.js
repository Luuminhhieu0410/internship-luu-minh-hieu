import { redirect } from "@remix-run/node";
import shopify from "../shopify.server";

export async function CheckToken(request) {
  try {
    const { admin, session } = await shopify.authenticate.admin(request);
    if (!session?.shop) {
      throw new Error("Unauthorized");
    }
    return { admin, session };
  } catch {
    throw redirect("/auth/login");
  }
}
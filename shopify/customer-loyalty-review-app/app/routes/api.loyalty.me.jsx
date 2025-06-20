// app/routes/api/loyalty/me.js
import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function loader({ request }) {
  // Giả định customerId được gửi từ frontend hoặc lấy từ session
  const url = new URL(request.url);
  let customerId = url.searchParams.get("customerId"); //
  customerId = "gid://shopify/Customer/" + customerId;
  console.log("customer ID : " + customerId);
  if (!customerId) {
    return json({ error: "không có userID data" }, { status: 400 });
  }

  try {
    const point = await prisma.point.findFirst({
      where: {
        customerId: "gid://shopify/Customer/22829419299108",
      },
      select: {
        totalPoints: true,
      },
    });

    if (!point) {
      return json({ customer_id: customerId, total_points: 0 });
    }

    return json({ customer_id: customerId, total_points: point.totalPoints });
  } catch (error) {
    console.error("Error fetching points:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}

import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function action({ request }) {
 
  const {payload} = await authenticate.webhook(request);
  console.log('payload : ' + JSON.stringify(payload));
  // console.log("Orders webhooks : "  + JSON.stringify(order));
  
  const settings = await prisma.pointSetting.findFirst();
  if (!settings) {
    throw new Error("không có dữ liệu point setting");
  }

  const points = Math.floor(payload.current_total_price / settings.earnRate); // điểm nhận được từ orders =  tổng tiền oders / điểm đơn hàng được cài đặt
  console.log("add point : " + points)
  const customerId = "gid://shopify/Customer/" + payload.customer.id; //  gid://shopify/customer/123
  await prisma.customer.upsert({
    where: { customerId },
    update: {
      amountSpent: { increment: parseFloat(payload.current_total_price) },
      numberOfOrders: { increment: 1 },
    },
    create: {
      customerId,
      email: payload.customer.email,
      name: `${payload.customer.first_name} ${payload.customer.last_name}`.trim(),
      amountSpent: parseFloat(payload.current_total_price),
      numberOfOrders: 1,
    },
  });

 
  await prisma.point.upsert({
    where: { customerId },
    update: { totalPoints: { increment: points } },
    create: { customerId, totalPoints: points },
  });

  
  await prisma.pointLog.create({
    data: {
      customerId,
      type: "earn",
      points,
      reason: `Điểm thưởng kiếm được từ order #${payload.id}`,
    },
  });
  console.log("update all successfully");
  return new Response();
}
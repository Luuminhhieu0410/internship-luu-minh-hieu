import { authenticate } from "../shopify.server.js";
import prisma from "../db.server.js";
import { json } from "@remix-run/node";
import { getAdminCustomerList } from "../shopify-api/customer.js";

export const loader = async ({ request }) => {
  const { session, shop } = await authenticate.admin(request);

  if (!session) {
    return json({ error: "Không đủ quyền!" }, { status: 401 });
  }

  const PointSetting = await prisma.pointSetting.findFirst({
    select: {
      earnRate: true,
      spendRate: true,
    },
    where: {
      id: 1,
    },
  });

  if (!PointSetting) {
    return json({ error: "Chưa cấu hình tỷ lệ điểm." }, { status: 400 });
  }

  const customers = await getAdminCustomerList(request);

  const tasks = customers.map(async (c) => {
    const customerId = c.id;

    // kiểm tra nếu customer đã tồn tại rồi mới instert
    const existed = await prisma.customer.findFirst({
      where: {
        shop,
        customerId,
      },
    });

    if (existed) return 0;

    const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
    const amountSpent = parseFloat(c.amountSpent?.amount ?? "0");

    await prisma.customer.create({
      data: {
        customerId,
        shop,
        email: c.email,
        name,
        numberOfOrders: Number(c.numberOfOrders ?? 0),
        amountSpent,
      },
    });

    await prisma.point.create({
      data: {
        customerId,
        totalPoints: amountSpent / PointSetting.earnRate,
      },
    });

    return 1;
  });

  const results = await Promise.all(tasks);
  const count = results.reduce((acc, cur) => acc + cur, 0);

  return json({ message: `Insert thành công ${count} users.` });
};

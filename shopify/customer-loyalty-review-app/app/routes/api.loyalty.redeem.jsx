import { json } from '@remix-run/node';
import prisma from '../db.server.js';
import { createDiscountCodeWithFullDebug } from '../shopify-api/discount.js';

function generateRandomCode(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'VIP_';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export async function action({ request }) {
  const body = await request.json();
  let { points, amount, customerId } = body;

  customerId = "gid://shopify/Customer/" + customerId;

  console.log('point đổi : ' + points);
  console.log('số tiền tương ứng với point: ' + amount);
  console.log("user đổi mã : " + customerId);

  if (!customerId || !points || !amount) {
    return json({ error: 'Thiếu thông tin cần thiết' }, { status: 400 });
  }

  try {
    const pointSetting = await prisma.pointSetting.findFirst();
    console.log("point setting : " + JSON.stringify(pointSetting));

    if (!pointSetting || !pointSetting.spendRate) {
      return json({ error: 'Chưa cấu hình tỷ lệ đổi điểm' }, { status: 500 });
    }

    const point = await prisma.point.findFirst({
      where: { customerId },
    });

    if (!point || point.totalPoints < points) {
      return json({ error: 'Không đủ điểm để đổi' }, { status: 400 });
    }

    console.log("total point : " + point.totalPoints);

    const discountCode = generateRandomCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // hết hạn sau 30 ngày

    const updatedPoints = point.totalPoints - points;
    console.log('updated point ' + updatedPoints);

    await prisma.$transaction(async (tx) => {
      await tx.point.update({
        where: { id: point.id }, 
        data: { totalPoints: updatedPoints },
      });

      await tx.pointLog.create({
        data: {
          customerId,
          type: 'spend',
          points: -points,
          reason: `Đổi ${points} điểm lấy mã giảm giá ${discountCode}`,
        },
      });

      await tx.redeemCode.create({
        data: {
          code: discountCode,
          amount,
          customerId,
          pointsUsed: points,
          expiresAt,
        },
      });
    });

    console.log('đã insert vào database');
    console.log("trước insert shopify");

    await createDiscountCodeWithFullDebug({
      customerId,
      amount,
      code: discountCode,
      expiresAt,
    });

    console.log("đã insert vào shopify thành công");

    return json({ success: true, code: discountCode, amount });

  } catch (error) {
    console.error('Error redeeming points:', error);
    return json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

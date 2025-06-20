
import { json } from '@remix-run/node';
import  prisma  from '../db.server.js';

//Lấy danh sách mã giảm giá đã đổi của khách hàng.

export async function loader({ request }) {

  const url = new URL(request.url);
  let  customerId = url.searchParams.get('customerId');
  console.log('customer id 1: ' + customerId);

  customerId = `gid://shopify/Customer/${customerId}`;
  console.log('customer id 2: ' + customerId);
  if (!customerId) {
    return json({ error: 'không có userID data' }, { status: 400 });
  }

  try {
    const redeemCodes = await prisma.redeemCode.findMany({
      where: { customerId },
      select: {
        code: true,
        amount: true,
        pointsUsed : true,
        createdAt: true,
        isUsed : true,
        expiresAt : true

      },
      orderBy: { createdAt: 'desc' },
    });

    return json(redeemCodes);
  } catch (error) {
    console.error('Error fetching redeemed codes:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

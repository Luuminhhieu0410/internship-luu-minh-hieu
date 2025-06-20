import { useLoaderData } from "@remix-run/react";
import { Card, DataTable, Page } from "@shopify/polaris";
import prisma from "../db.server";

export const loader =  async ({ request }) => {
  try {    
    const redeemCodes = await prisma.redeemCode.findMany({
      include: {
        customer: {
          select: {
            name: true, 
          },
        },
      },
    });
    console.log('redeemCodes1====', redeemCodes);
    // console.log("OK");
    return {redeemCodes}
  } catch (error) {
    console.log("error : " + error);
    return {error}
  }
}

export default function RedeemCodes() {
  const { redeemCodes } = useLoaderData();
  console.log('redeemCode====', redeemCodes);
  const rows = redeemCodes.map((code) => [
    code.code,
    code.amount,
    code.customer.name,
    code.pointsUsed,
    code.isUsed ? <span style={{background:"red",width:"100%",color:"white"}}>Đã sử dụng</span> : <span style={{background:"green",width:"100%",color:'white'}}>chưa sử dụng</span>,
     new Date(code.createdAt).toLocaleString("vi-VN"),
     new Date(code.expiresAt).toLocaleString("vi-VN"),
    
  ]);

  return (
   
    <Page title="Redeem Codes">
      <Card>
        <DataTable
          columnContentTypes={["text", "numeric", "text", "numeric", "text"]}
          headings={[
            "Code",
            "Amount",
            "Customer",
            "Points Used",
            "Trạng thái sử dụng",
            "Created At",
            "Expire At"
          ]}
          rows={rows}
        />
      </Card>
    </Page>
  );
}

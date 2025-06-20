import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, DataTable, Page } from "@shopify/polaris";
import { prisma } from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  const pointLogs = await prisma.pointLog.findMany({
    where: { customerId: params.customerId },
    orderBy: { createdAt: "desc" },
  });
  return json({ pointLogs });
}

export default function PointLogs() {
  const { pointLogs } = useLoaderData();
  const rows = pointLogs.map((log) => [
    log.createdAt.toLocaleString(),
    log.type,
    log.points,
    log.reason,
  ]);

  return (
    <Page title="Point Logs">
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "numeric", "text"]}
          headings={["Date", "Type", "Points", "Reason"]}
          rows={rows}
        />
      </Card>
    </Page>
  );
}
import React from "react";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  Text,
  Layout,
  Page,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";
import { dataForAdminPage } from "../api/Product";

export async function loader({ request }) {
  const data = await dataForAdminPage(request);
  return data;
}

const Dashboard = () => {
  const { totalProducts, totalInventory, discountCount } = useLoaderData();

  return (
    <Page
      title="DashBoard"
      
      fullWidth
    >
      <Layout>
        <Layout.Section>
          <InlineStack wrap={false} gap="400">
            <StatCard title="Tổng số sản phẩm" value={totalProducts} />
            <StatCard title="Tổng tồn kho" value={totalInventory} />
            <StatCard title="Sản phẩm đang giảm giá" value={discountCount} />
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};


function StatCard({ title, value }) {
  return (
    <Card padding="400">
      <BlockStack align="center" gap="200">
        <Text variant="bodySm" color="subdued" as="p">
          {title}
        </Text>
        <Text variant="headingXl" as="h2">
          {value.toLocaleString()}
        </Text>
      </BlockStack>
    </Card>
  );
}

export default Dashboard;

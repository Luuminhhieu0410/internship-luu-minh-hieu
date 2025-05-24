// admin-api/components/ProductTable.jsx
import { Card, DataTable } from "@shopify/polaris";

export default function ProductTable({ products }) {
  const rows = products.map(({ id, image, name, price }) => [id, image, name, price]);

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "numeric"]}
        headings={["ID", "Image", "Name", "Price"]}
        rows={rows}
      />
    </Card>
  );
}
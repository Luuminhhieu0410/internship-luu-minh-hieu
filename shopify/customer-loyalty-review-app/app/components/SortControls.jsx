import { Select, InlineStack } from "@shopify/polaris";

export function SortControls({ sortBy, sortOrder, handleSortChange, handleOrderChange, sortOptions }) {
  const orderOptions = [
    { label: "Tăng dần", value: "asc" },
    { label: "Giảm dần", value: "desc" },
  ];

  return (
    <InlineStack gap="400" align="start">
      <div style={{ minWidth: "200px" }}>
        <Select
          label="Sắp xếp theo"
          options={sortOptions}
          value={sortBy}
          onChange={handleSortChange}
        />
      </div>
      <div style={{ minWidth: "150px" }}>
        <Select
          label="Thứ tự"
          options={orderOptions}
          value={sortOrder}
          onChange={handleOrderChange}
        />
      </div>
    </InlineStack>
  );
}
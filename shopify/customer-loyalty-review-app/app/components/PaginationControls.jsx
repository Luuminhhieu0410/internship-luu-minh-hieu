import { Pagination, Text } from "@shopify/polaris";

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  searchTerm,
  handlePageChange,
  hasPrevious,
  hasNext,
  itemName = "mục",
}) {
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalItems);

  return (
    <>
      <div style={{ padding: "16px", borderTop: "1px solid #e1e5e9" }}>
        <div distribution="equalSpacing" alignment="center">
          <Text variant="bodySm" color="subdued">
            Hiển thị {startRecord}-{endRecord} trong tổng số {totalItems} {itemName}
            {searchTerm && ` (đã lọc từ "${searchTerm}")`}
          </Text>
        </div>
      </div>
      <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
        <Pagination
          hasPrevious={hasPrevious}
          onPrevious={() => handlePageChange(currentPage - 1)}
          hasNext={hasNext}
          onNext={() => handlePageChange(currentPage + 1)}
          previousKeys={["ArrowLeft"]}
          nextKeys={["ArrowRight"]}
          label={`Trang ${currentPage} / ${totalPages}`}
        />
      </div>
    </>
  );
}
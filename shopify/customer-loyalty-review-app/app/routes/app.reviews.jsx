import { useLoaderData, useActionData, Form, useSubmit, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Page, Card, DataTable, Button, Text, Tooltip, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useSearch } from "../hooks/useSearch";
import { useSort } from "../hooks/useSort";
import { usePagination } from "../hooks/usePagination";
import { SearchBar } from "../components/SearchBar";
import { SortControls } from "../components/SortControls";
import { PaginationControls } from "../components/PaginationControls";
import { useState } from "react";

export async function loader({ request }) {
  await authenticate.admin(request);
  const url = new URL(request.url);
  const pageSize = 5;
  const page = parseInt(url.searchParams.get("page")) || 1;
  const offset = (page - 1) * pageSize;
  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const searchTerm = url.searchParams.get("search") || "";

  const whereClause = searchTerm
    ? {
        OR: [
          { content: { contains: searchTerm } },
          { customer: { email: { contains: searchTerm } } },
        ],
      }
    : {};

  const totalReviews = await prisma.review.count({ where: whereClause });
  const totalPages = Math.ceil(totalReviews / pageSize);

  let reviews;

  // if (sortBy === "email") {
  //   const orderDirection = sortOrder.toUpperCase();
  //   const safeSearchTerm = searchTerm.replace(/[%_\\]/g, "\\$&");
  //   const query = `
  //     SELECT 
  //       r.id,
  //       r.productId,
  //       c.email as email,
  //       r.rating,
  //       r.content,
  //       r.approved,
  //       r.createdAt,
  //       r.customerId
  //     FROM Review r
  //     LEFT JOIN Customer c ON r.customerId = c.customerId
  //     ${
  //       safeSearchTerm
  //         ? `WHERE LOWER(r.content) LIKE '%${safeSearchTerm.toLowerCase()}%' 
  //            OR LOWER(c.email) LIKE '%${safeSearchTerm.toLowerCase()}%'`
  //         : ""
  //     }
  //     ORDER BY c.email ${orderDirection} NULLS LAST
  //     LIMIT ${pageSize}
  //     OFFSET ${offset}
  //   `;
  //   reviews = await prisma.$queryRawUnsafe(query);
  //   reviews = reviews.map((review) => ({
  //     ...review,
  //     id: Number(review.id),
  //     rating: Number(review.rating),
  //     approved: Boolean(review.approved),
  //     createdAt: new Date(review.createdAt),
  //     customer: review.email ? { email: review.email } : null,
  //   }));
  // } else {
    const orderBy = { [sortBy]: sortOrder };
    reviews = await prisma.review.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy,
      select: {
        id: true,
        productId: true,
        rating: true,
        content: true,
        approved: true,
        createdAt: true,
        customerId: true,
        customer: { select: { email: true } },
      },
    });
  // }

  return json({
    reviews,
    currentPage: page,
    totalPages,
    totalReviews,
    pageSize,
    sortBy,
    sortOrder,
    searchTerm,
  });
}

export async function action({ request }) {
  await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const reviewIds = formData.getAll("reviewId").map(Number);
  console.log("action type " + actionType);
  console.log("list review id " + reviewIds);
  console.log("Form Data Selected" + formData.getAll('reviewId'));
  try {
    if (actionType === "bulkApprove" || actionType === "bulkReject") {  // khi duyệt hoặc hủy cùng lúc số lượng lớn review 
      const approve = actionType === "bulkApprove"; // duyệt comment
      const reviews = await prisma.review.findMany({ // lấy ra những review đã chọn từ các check box
        where: { id: { in: reviewIds } },
        select: { id: true, customerId: true, approved: true , rating : true },
      });
      console.log("list reviews selected : " + reviews);
      const settings = await prisma.pointSetting.findFirst({ // lấy cấu hình điểm 
        where:{
          id : 1
        }
      }); 
      console.log("data point setting " + JSON.stringify(settings));
      const reviewReward = settings?.reviewReward;// điểm thưởng khi comment

     
      for (const review of reviews) { // lặp từng review đã selected
        
        const isApproving = approve && !review.approved;
        console.log("star comment : " + JSON.stringify(review));
        await prisma.review.update({
          where: { id: review.id },
          data: { approved: approve },
        });
        if(review.rating >= 4 ){
           if (isApproving && review.customerId ) {
          
           const pointUpsert =  await prisma.point.upsert({
            where: { customerId: review.customerId },
            update: { totalPoints: { increment: reviewReward } },
            create: { customerId: review.customerId, totalPoints: reviewReward },
          });
          
          console.log("point upsert : " + JSON.stringify(pointUpsert));
            
            const pointLog =  await prisma.pointLog.create({
            data: {
              customerId: review.customerId,
              type: "earn",
              points: reviewReward,
              reason: `{LIST} Kiếm được điểm thưởng từ review #${review.id}`,
            },
          });
          console.log("point log create :"  + JSON.stringify(pointLog));
        }
        }
      }

      return json({ success: true, message: `Đã ${approve ? "duyệt" : "từ chối"} ${reviews.length} đánh giá` });
    } 
    else { //khi duyệt hoặc hủy duyệt từng review đơn lẻ 
      
      const reviewId = parseInt(formData.get("reviewId"));
      const action = formData.get("action");
      console.log('review ID '  + reviewId);
      const review = await prisma.review.findFirst({
        where: { id: reviewId },
        select: { customerId: true, approved: true },
      });

      if (!review) {
        return json({ error: "Review not found" }, { status: 404 });
      }

      const isApproving = action === "approve" && !review.approved;

      await prisma.review.update({
        where: { id: reviewId },
        data: { approved: action === "approve" },
      });

      if (isApproving && review.customerId) {
        const settings = await prisma.pointSetting.findFirst();
        const reviewReward = settings?.reviewReward;

        if (reviewReward && reviewReward > 0) {
          await prisma.point.upsert({

            where: { customerId: review.customerId },
            update: { totalPoints: { increment: reviewReward } },
            create: { customerId: review.customerId, totalPoints: reviewReward },
            
          });

          await prisma.pointLog.create({
            data: {
              customerId: review.customerId,
              type: "earn",
              points: reviewReward,
              reason: `{ONE} Kiếm được điểm thưởng từ review #${review.id}`,
            },
          });
        }
      }

      return json({ success: true, message: "Review updated successfully" });
    }
  } catch (error) {
    console.error("Action error:", error);
    return json({ error: "Failed to update reviews" }, { status: 500 });
  }
}

export default function ReviewModeration() {
  const {
    reviews,
    currentPage,
    totalPages,
    totalReviews,
    pageSize,
    sortBy,
    sortOrder,
    searchTerm,
  } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const [selectedReviews, setSelectedReviews] = useState([]);

  const { searchInput, handleSearchChange, handleClearSearch, debouncedSearchTerm } = useSearch({ initialSearchTerm: searchTerm });
  const { sortBy: currentSortBy, sortOrder: currentSortOrder, handleSortChange, handleOrderChange } = useSort({ initialSortBy: sortBy, initialSortOrder: sortOrder });
  const { handlePageChange, hasPrevious, hasNext } = usePagination(currentPage, totalPages);

  const handleReviewAction = (reviewId, action) => { // khi ấn duyệt và hủy duyệt button đơn lẻ
    submit({ reviewId, action }, { method: "post" });
  };

  const handleBulkAction = (actionType) => { // khi ấn duyệt và hủy duyệt nhiều trường cùng lúc
    const formData = new FormData();
    selectedReviews.forEach((id) => formData.append("reviewId", id));
    formData.append("actionType", actionType);
    submit(formData, { method: "post" });
    setSelectedReviews([]); // ẩn các select đã chọn khi đã submit
  };

  const handleSelectRow = (id) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((reviewId) => reviewId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((review) => review.id));
    }
  };

  const rows = reviews.map(({ id, productId, customer, rating, content, approved, createdAt }) => [
    <input type="checkbox"
      checked={selectedReviews.includes(id)}
      onChange={() => handleSelectRow(id)}
      key={`checkbox-${id}`}
    />,
    productId.replace("gid://shopify/Product/", ""),
    customer?.email || "N/A",
    rating,
    <Tooltip content={content} key={`tooltip-${id}`}>
      <Text truncate>{content.length > 30 ? `${content.slice(0, 30)}...` : content}</Text>
    </Tooltip>,
    approved == 1 ? "Đã duyệt" : "Chưa duyệt",
    <div key={id}>
      {approved == 0 ? (
        <Button
          onClick={() => handleReviewAction(id, "approve")}
          variant="primary"
          disabled={navigation.state === "submitting"}
        >
          Duyệt
        </Button>
      ) : (
        <Button
          onClick={() => handleReviewAction(id, "reject")}
          variant="primary" tone="critical"
          disabled={navigation.state === "submitting"}
        >
          Hủy duyệt
        </Button>
      )}
  
    </div>,
    new Date(createdAt).toLocaleDateString("vi-VN"),
  ]);

  const sortOptions = [
    { label: "Sản phẩm", value: "productId" },
    // { label: "Email", value: "email" },
    { label: "Điểm đánh giá", value: "rating" },
    { label: "Ngày tạo", value: "createdAt" },
  ];

  return (
    <Page title="Quản lý đánh giá">
      <Card>
        <BlockStack gap="400">
          <div style={{ padding: "16px", borderBottom: "1px solid #e1e5e9" }}>
            <SearchBar
              searchInput={searchInput}
              handleSearchChange={handleSearchChange}
              handleClearSearch={handleClearSearch}
              debouncedSearchTerm={debouncedSearchTerm}
              label="Tìm kiếm đánh giá"
              placeholder="Nhập nội dung cần tìm ..."
            />
            <SortControls
              sortBy={currentSortBy}
              sortOrder={currentSortOrder}
              handleSortChange={handleSortChange}
              handleOrderChange={handleOrderChange}
              sortOptions={sortOptions} 
            />
          </div>

          {reviews.length > 0 && (
            <div style={{ padding: "16px", display: "flex", gap: "8px" }}>
              <Button
                onClick={handleSelectAll}
                variant="secondary"
                disabled={navigation.state === "submitting"}
              >
                {selectedReviews.length === reviews.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </Button>
              <Button
                onClick={() => handleBulkAction("bulkApprove")}
                variant="primary"
                disabled={selectedReviews.length === 0 || navigation.state === "submitting"}
              >
                Duyệt tất cả
              </Button>
              <Button
                onClick={() => handleBulkAction("bulkReject")}
                variant="critical"
                disabled={selectedReviews.length === 0 || navigation.state === "submitting"}
              >
                Từ chối tất cả
              </Button>
            </div>
          )}

          <DataTable
            columnContentTypes={["text", "text", "text", "numeric", "text", "text", "text", "text"]}
            headings={[
              <input
                type="checkbox"
                checked={selectedReviews.length === reviews.length && reviews.length > 0}
                onChange={handleSelectAll}
                key="select-all"
              />,
              "Sản phẩm",
              "Email",
              "Điểm",
              "Nội dung",
              "Trạng thái",
              "Hành động",
              "Ngày tạo",
            ]}
            rows={rows}
            truncate
          />

          {actionData?.success && (
            <div style={{ padding: "16px" }}>
              <Text variant="bodyMd" color="success">
                {actionData.message}
              </Text>
            </div>
          )}
          {actionData?.error && (
            <div style={{ padding: "16px" }}>
              <Text variant="bodyMd" color="critical">
                {actionData.error}
              </Text>
            </div>
          )}

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalReviews}
            pageSize={pageSize}
            searchTerm={searchTerm}
            handlePageChange={handlePageChange}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            itemName="đánh giá"
          />
        </BlockStack>
      </Card>
    </Page>
  );
}
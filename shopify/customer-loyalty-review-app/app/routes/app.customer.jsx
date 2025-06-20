import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Page, Card, DataTable } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useSearch } from "../hooks/useSearch";
import { useSort } from "../hooks/useSort";
import { usePagination } from "../hooks/usePagination";
import { SearchBar } from "../components/SearchBar";
import { SortControls } from "../components/SortControls";
import { PaginationControls } from "../components/PaginationControls";

export async function loader({ request }) {
  await authenticate.admin(request);
  const url = new URL(request.url);
  const pageSize = 10;
  const page = parseInt(url.searchParams.get("page")) || 1;
  const offset = (page - 1) * pageSize;
  const sortBy = url.searchParams.get("sortBy") || "name";
  const sortOrder = url.searchParams.get("sortOrder") || "asc";
  const searchTerm = url.searchParams.get("search") || "";

  const whereClause = searchTerm
    ? {
        OR: [
          { name: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ],
      }
    : {};

  const totalCustomers = await prisma.customer.count({ where: whereClause });
  const totalPages = Math.ceil(totalCustomers / pageSize);

  let customers;

  if (sortBy === "totalPoints") {
    const orderDirection = sortOrder.toUpperCase();
    const safeSearchTerm = searchTerm.replace(/[%_\\]/g, "\\$&");
    const query = `
      SELECT 
        c.id,
        c.customerId,
        c.email,
        c.name,
        c.amountSpent,
        c.numberOfOrders,
        COALESCE(p.totalPoints, 0) as totalPoints
      FROM Customer c
      LEFT JOIN Point p ON c.customerId = p.customerId
      ${
        safeSearchTerm
          ? `WHERE LOWER(c.name) LIKE '%${safeSearchTerm.toLowerCase()}%' OR LOWER(c.email) LIKE '%${safeSearchTerm.toLowerCase()}%'`
          : ""
      }
      ORDER BY totalPoints ${orderDirection}
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;
    customers = await prisma.$queryRawUnsafe(query);
    customers = customers.map((customer) => ({
      ...customer,
      id: customer.id.toString(),
      amountSpent: Number(customer.amountSpent),
      numberOfOrders: Number(customer.numberOfOrders),
      totalPoints: Number(customer.totalPoints),
      points: [{ totalPoints: Number(customer.totalPoints) }],
    }));
  } else {
    const orderBy = { [sortBy]: sortOrder };
    customers = await prisma.customer.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy,
      select: {
        customerId: true,
        email: true,
        name: true,
        amountSpent: true,
        numberOfOrders: true,
        points: { select: { totalPoints: true }, take: 1 },
      },
    });
  }

  return json({
    customers,
    currentPage: page,
    totalPages,
    totalCustomers,
    pageSize,
    sortBy,
    sortOrder,
    searchTerm,
  });
}

export default function CustomerPoints() {
  const {
    customers,
    currentPage,
    totalPages,
    totalCustomers,
    pageSize,
    sortBy,
    sortOrder,
    searchTerm,
  } = useLoaderData();

  const { searchInput, handleSearchChange, handleClearSearch, debouncedSearchTerm } = useSearch({ initialSearchTerm: searchTerm });
  const { sortBy: currentSortBy, sortOrder: currentSortOrder, handleSortChange, handleOrderChange } = useSort({ initialSortBy: sortBy, initialSortOrder: sortOrder });
  const { handlePageChange, hasPrevious, hasNext } = usePagination(currentPage, totalPages);

  const rows = customers.map(({ customerId, email, name, amountSpent, numberOfOrders, points, totalPoints }) => [
    customerId.replace("gid://shopify/Customer/", ""),
    email,
    name || "N/A",
    numberOfOrders,
    `${amountSpent.toLocaleString("vi-VN")} VNĐ`,
    totalPoints !== undefined ? totalPoints : (points[0]?.totalPoints || 0),
  ]);

  const sortOptions = [
    { label: "Tên khách hàng", value: "name" },
    { label: "Tổng điểm", value: "totalPoints" },
    { label: "Tổng tiền", value: "amountSpent" },
    { label: "Tổng Orders", value: "numberOfOrders" },
  ];

  return (
    <Page title="Quản lý điểm khách hàng">
      <Card>
        <div style={{ padding: "16px", borderBottom: "1px solid #e1e5e9" }}>
          <SearchBar
            searchInput={searchInput}
            handleSearchChange={handleSearchChange}
            handleClearSearch={handleClearSearch}
            debouncedSearchTerm={debouncedSearchTerm}
            label="Tìm kiếm khách hàng"
            placeholder="Nhập tên hoặc email khách hàng..."
          />
          <SortControls
            sortBy={currentSortBy}
            sortOrder={currentSortOrder}
            handleSortChange={handleSortChange}
            handleOrderChange={handleOrderChange}
            sortOptions={sortOptions}
          />
        </div>

        <DataTable
          columnContentTypes={["text", "text", "text", "numeric", "text", "numeric"]}
          headings={["ID", "Email", "Tên", "Tổng Orders", "Tổng tiền", "Tổng điểm"]}
          rows={rows}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCustomers}
          pageSize={pageSize}
          searchTerm={searchTerm}
          handlePageChange={handlePageChange}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          itemName="khách hàng"
        />
      </Card>
    </Page>
  );
}
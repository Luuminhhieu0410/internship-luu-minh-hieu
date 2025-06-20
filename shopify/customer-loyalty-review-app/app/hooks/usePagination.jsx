import { useNavigate, useSearchParams } from "@remix-run/react";

export function usePagination(currentPage, totalPages, pageParam = "page") {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParam, page.toString());
    navigate(`?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    range.push(1);
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }

    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);
    let prev = 0;
    for (const page of uniqueRange) {
      if (page - prev > 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  return {
    handlePageChange,
    getPageNumbers,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}
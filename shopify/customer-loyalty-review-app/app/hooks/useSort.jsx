import { useSearchParams, useNavigate } from "@remix-run/react";

export function useSort({ initialSortBy = "id", initialSortOrder = "asc", sortByParam = "sortBy", sortOrderParam = "sortOrder" } = {}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sortBy = searchParams.get(sortByParam) || initialSortBy;
  const sortOrder = searchParams.get(sortOrderParam) || initialSortOrder;

  const handleSortChange = (newSortBy) => {
    const params = new URLSearchParams(searchParams);
    params.set(sortByParam, newSortBy);
    params.set("page", "1");
    navigate(`?${params.toString()}`);
  };

  const handleOrderChange = (newSortOrder) => {
    const params = new URLSearchParams(searchParams);
    params.set(sortOrderParam, newSortOrder);
    params.set("page", "1");
    navigate(`?${params.toString()}`);
  };

  return { sortBy, sortOrder, handleSortChange, handleOrderChange };
}
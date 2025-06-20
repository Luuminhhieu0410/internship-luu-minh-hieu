import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "@remix-run/react";

export function useSearch({ initialSearchTerm = "", searchParamName = "search" } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearchTerm !== initialSearchTerm) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearchTerm.trim()) {
        params.set(searchParamName, debouncedSearchTerm);
      } else {
        params.delete(searchParamName);
      }
      params.set("page", "1");
      setSearchParams(`?${params.toString()}`);
    }
  }, [debouncedSearchTerm, initialSearchTerm, searchParams, setSearchParams, searchParamName]);

  useEffect(() => {
    setSearchInput(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearchChange = useCallback((value) => {
    setSearchInput(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setDebouncedSearchTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete(searchParamName);
    params.set("page", "1");
    setSearchParams(`?${params.toString()}`);
  }, [searchParams, setSearchParams, searchParamName]);

  return { searchInput, handleSearchChange, handleClearSearch, debouncedSearchTerm };
}
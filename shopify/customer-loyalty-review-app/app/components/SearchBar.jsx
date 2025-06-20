import { TextField } from "@shopify/polaris";

export function SearchBar({ searchInput, handleSearchChange, handleClearSearch, debouncedSearchTerm, label = "Tìm kiếm", placeholder = "Nhập từ khóa..." }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <TextField
        label={label}
        value={searchInput}
        onChange={handleSearchChange}
        placeholder={placeholder}
        clearButton
        onClearButtonClick={handleClearSearch}
        autoComplete="off"
        helpText={searchInput !== debouncedSearchTerm ? "Đang tìm kiếm..." : ""}
      />
    </div>
  );
}
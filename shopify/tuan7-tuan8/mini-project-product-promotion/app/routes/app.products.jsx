// routes/products.jsx
import { getProducts } from "../api/Product";
import {
  useLoaderData,
  useSearchParams,
  useRevalidator,
  useNavigate,
} from "@remix-run/react";
import { 
  Page, 
  Card, 
  TextField, 
  Thumbnail, 
  Pagination,
  EmptyState,
  Spinner,
  Banner,
  Text
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useMemo } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import ProductTable from "../component/ProductTable";


export async function loader({ request }) {
  const url = new URL(request.url);
  const after = url.searchParams.get("after");
  const before = url.searchParams.get("before");
  const search = url.searchParams.get("search") || "";

  try {
    const productDataAPI = await getProducts(request, { after, before, search });
    return { 
      data: productDataAPI,
      error: null,
      searchTerm: search
    };
  } catch (error) {
    return { 
      data: null, 
      error: error.message,
      searchTerm: search
    };
  }
}

export default function Products() {
  const { data: dataAPI, error, searchTerm } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();
  
  const [value, setValue] = useState(searchTerm || "");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce
  const handleSearch = useCallback(
    async (searchValue) => {
      setIsSearching(true);
      
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
      
        params.delete("after");
        params.delete("before");
        
        if (searchValue && searchValue.trim()) {
          params.set("search", searchValue.trim());
        } else {
          params.delete("search");
        }
        return params;
      });

     
      setTimeout(() => {
        revalidate();
        setIsSearching(false);
      }, 500);
    },
    [setSearchParams, revalidate]
  );

  // Xử lý khi người dùng thay đổi ô tìm kiếm
  const handleChange = useCallback(
    (newValue) => {
      setValue(newValue);
      handleSearch(newValue);
    },
    [handleSearch]
  );

  
  const products = useMemo(() => {
    if (!dataAPI?.data?.products?.edges) return [];
    
    return dataAPI.data.products.edges.map((edge) => ({
      id: edge.node.id,
      image: (
        <Thumbnail
          source={edge?.node?.images?.edges[0]?.node?.originalSrc || ""}
          alt={edge?.node?.images?.edges[0]?.node?.altText || edge?.node?.title}
          size="small"
        />
      ),
      name: edge?.node?.title,
      price: edge?.node?.variants?.edges[0]?.node?.price 
        ? ` ${edge.node.variants.edges[0].node.price}` 
        : "null",
      inventory: edge?.node?.totalInventory || 0,
    
     
    }));
  }, [dataAPI]);

  
  const pageInfo = dataAPI?.data?.products?.pageInfo;
  const hasProducts = products && products.length > 0;

  // if (isSearching) {
  //   return (
  //     <Page>
  //       <TitleBar title="Products" />
  //       <Card>
  //         <div style={{ padding: '40px', textAlign: 'center' }}>
  //           <Spinner size="large" />
  //           <Text variant="bodyMd" as="p" color="subdued">
  //             Đang tìm kiếm sản phẩm...
  //           </Text>
  //         </div>
  //       </Card>
  //     </Page>
  //   );
  // }

  return (
    <Page>
      <TitleBar title="Products" />
      
      {error && (
        <Banner status="critical" title="Lỗi khi tải dữ liệu">
          <p>{error}</p>
        </Banner>
      )}

      <Card>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Tìm kiếm sản phẩm"
            value={value}
            placeholder="Nhập tên sản phẩm để tìm kiếm..."
            onChange={handleChange}
            autoComplete="off"
            clearButton
            onClearButtonClick={() => handleChange("")}
          />
        </div>

        {!hasProducts && !error ? (
          <EmptyState
            heading={searchTerm ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm nào"}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>
              {searchTerm 
                ? `Không tìm thấy sản phẩm nào với từ khóa "${searchTerm}"`
                : "Bạn chưa có sản phẩm nào trong cửa hàng."
              }
            </p>
          </EmptyState>
        ) : (
          <>
            {hasProducts && (
              <div style={{ marginBottom: '20px' }}>
                <Text variant="bodyMd" as="p" color="subdued">
                  {searchTerm 
                    ? `Hiển thị kết quả tìm kiếm cho "${searchTerm}"`
                    : `Hiển thị ${products.length} sản phẩm`
                    
                  }
                </Text>
              </div>
            )}
            
            <ProductTable product={products} dataAPI={dataAPI} />
            
            {pageInfo && (hasProducts && (pageInfo.hasNextPage || pageInfo.hasPreviousPage)) && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #E1E3E5'
              }}>
               
              </div>
            )}
          </>
        )}
      </Card>
    </Page>
  );
}
import {
  useNavigation,
  useSearchParams,
  Link,
  useLocation,
} from "@remix-run/react";

import {
  DataTable,
  LegacyCard,
  SkeletonBodyText,
  SkeletonTabs,
} from "@shopify/polaris";
import SkeletonExample from "./SkeletonPage";

const ProductTable = ({ product, dataAPI }) => {
  const rows = product.map((product) => [
    product.image,
    product.id.replace("gid://shopify/Product/", ""),
    <Link to={`/app/productdetail?id=${product.id}`}>{product.name}</Link>,
    product.price,
    product.inventory,
  ]);
  const edges = dataAPI.data.products.edges;

  const lastCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
  const firstCursor = edges.length > 0 ? edges[0].cursor : null;
  const [searchParams, setSearchParams] = useSearchParams();

  const goToPage = (cursorType, cursor) => {
    // const url = new URL(window.location.href);
    searchParams.delete("after");
    searchParams.delete("before");
    searchParams.set(cursorType, cursor);
    console.log("=>>>>", searchParams);

    setSearchParams(searchParams);
    // setLoading(true);
  };
  const navigation = useNavigation();
  const location = useLocation();

  const isLoading =
    navigation.state == "loading" && !navigation.formData && navigation.location.pathname == location.pathname;
  const isLoadingPage = navigation.state == "loading" && !navigation.formData && navigation.location.pathname != location.pathname;

  // console.log("current url : " , location.pathname  + " " , "next url : "  + navigation.location.pathname);

  return (
    <div>
      {!isLoadingPage ? (
        isLoading ? (
          <>
            {" "}
            <DataTable
              columnContentTypes={[
                "text",
                "text",
                "text",
                "numeric",
                "quantity",
              ]}
              headings={["id", "image", "name", "price", "quantity"]}
              rows={[
                [
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                ], [
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                ],
                 [
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                ],
                 [
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                  <SkeletonTabs count={1} />,
                ]
              ]}
            ></DataTable>
          </>
        ) : (
          <DataTable
            columnContentTypes={["text", "text", "text", "numeric"]}
            headings={["image", "id", "name", "price", "quantity"]}
            rows={rows}
            pagination={{
              hasNext: dataAPI.data.products.pageInfo.hasNextPage,
              hasPrevious: dataAPI.data.products.pageInfo.hasPreviousPage,
              onNext: () => goToPage("after", lastCursor),
              onPrevious: () => goToPage("before", firstCursor),
            }}
          />
        )
      ) : (
        <SkeletonExample />
      )}
    </div>
  );
};

export default ProductTable;

// api/Product.js
import { CheckToken } from "../middleware/CheckToken";
export async function getProducts(request,{ after = null, before = null, search = "" },) {
  const {admin} = await CheckToken(request)

  let pagination = "first: 4";
  if (after) {
    pagination = `first: 4, after: "${after}"`;
  } else if (before) {
    pagination = `last: 4, before: "${before}"`;
  }

  let queryString = "";
  if (search && search.trim()) {
    queryString = `query: "title:*${search.trim()}*"`;
  }

  const response = await admin.graphql(`
    query {
      products(${pagination}${queryString ? `, ${queryString}` : ""}) {
        edges {
          node {
            id
            title
            handle
            totalInventory
            createdAt
            status
            productType
            vendor
            tags
            images(first: 1) {
              edges {
                node {
                  id
                  originalSrc
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                  compareAtPrice
                  sku
                  inventoryQuantity
                }
              }
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Không lấy được dữ liệu: ${errorData.errors?.[0]?.message}`,
    );
  }

  return (await response.json()) || {};
}

export async function getAllVariantsProduct(request, productId) {
  const {admin} = await CheckToken(request)
  const query = `
  query ProductMetafield($ownerId: ID!) {
        shop {
          currencyCode
        }
        product(id: $ownerId) {
          title
          category {
            id
            fullName
          }
          descriptionHtml
          hasOnlyDefaultVariant
          totalInventory
          vendor
          media(first: 10) {
            edges {
              node {
                id
                mediaContentType
                alt
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                selectedOptions {
                  name
                  value
                }
                inventoryItem {
                  id  
                  inventoryLevels(first: 10) {
                    edges {
                      node {
                        quantities(names: ["available"]) {
                          name
                          quantity
                        }
                        location {
                          id
                          name
                        }
                      }
                    }
                  }
                }
                id
                inventoryQuantity
                price
                compareAtPrice
                media(first: 10) {
                  edges {
                    node {
                      id
                      alt
                      mediaContentType
                      __typename
                      ... on MediaImage {
                        id
                        image {
                          url(
                            transform: {
                              maxWidth: 300
                              maxHeight: 300
                              preferredContentType: WEBP
                            }
                          )
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
  `;
  const response = await admin.graphql(query, {
    variables: { ownerId: productId },
  });
  if (!response.ok) throw new Error("không lấy được dữ liệu");
  return (await response.json()) || {};
}

export async function updateVariantPriceAndInventory(
  request,
  variantId,
  price,
  inventoryQuantity,
) {
  console.log("variantId:", variantId);
  console.log("price:", price, typeof price);
  console.log(
    "inventoryQuantity:",
    inventoryQuantity,
    typeof inventoryQuantity,
  );

  try {
    const {admin} = await CheckToken(request)

    const getProductQuery = `
      query getProductFromVariant($id: ID!) {
        productVariant(id: $id) {
          product {
            id
          }
        }
      }
    `;

    const productResponse = await admin.graphql(getProductQuery, {
      variables: { id: variantId },
    });

    const productResult = await productResponse.json();
    const productId = productResult.data?.productVariant?.product?.id;

    if (!productId) {
      return {
        success: false,
        message: "Không tìm thấy product ID",
      };
    }

    console.log("productId:", productId);

    const updateVariantMutation = `
      mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            price
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    console.log("Updating variant price...");
    const variantUpdateResponse = await admin.graphql(updateVariantMutation, {
      variables: {
        productId: productId,
        variants: [
          {
            id: variantId,
            price: price.toString(),
          },
        ],
      },
    });

    if (!variantUpdateResponse.ok) {
      console.error("GraphQL response not OK:", variantUpdateResponse.status);
      return {
        success: false,
        message: `GraphQL error: ${variantUpdateResponse.status}`,
      };
    }

    const variantUpdateResult = await variantUpdateResponse.json();
    console.log(
      "Variant update result:",
      JSON.stringify(variantUpdateResult, null, 2),
    );

    if (
      variantUpdateResult.data?.productVariantsBulkUpdate?.userErrors?.length >
      0
    ) {
      console.error(
        "Variant update user errors:",
        variantUpdateResult.data.productVariantsBulkUpdate.userErrors,
      );
      return {
        success: false,
        message:
          variantUpdateResult.data.productVariantsBulkUpdate.userErrors[0]
            ?.message || "Không thể cập nhật giá",
      };
    }

    console.log("Price updated successfully");

    const inventorySetMutation = `
      mutation inventorySetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
        inventorySetOnHandQuantities(input: $input) {
          inventoryAdjustmentGroup {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const getInventoryQuery = `
      query getInventoryItem($id: ID!) {
        productVariant(id: $id) {
          inventoryItem {
            id
            inventoryLevels(first: 1) {
              edges {
                node {
                  location {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `;

    const inventoryResponse = await admin.graphql(getInventoryQuery, {
      variables: { id: variantId },
    });

    const inventoryResult = await inventoryResponse.json();
    const inventoryItem = inventoryResult.data?.productVariant?.inventoryItem;

    const inventoryItemId = inventoryItem.id;
    const locationId = inventoryItem.inventoryLevels.edges[0].node.location.id;

    console.log("Updating inventory...");
    const inventoryUpdateResponse = await admin.graphql(inventorySetMutation, {
      variables: {
        input: {
          reason: "correction",
          setQuantities: [
            {
              inventoryItemId: inventoryItemId,
              locationId: locationId,
              quantity: inventoryQuantity,
            },
          ],
        },
      },
    });

    const inventoryUpdateResult = await inventoryUpdateResponse.json();
    console.log(
      "Inventory update result:",
      JSON.stringify(inventoryUpdateResult, null, 2),
    );

    console.log("UPDATE SUCCESSFULLY ");
    return {
      success: true,
      message: "Cập nhật thành công!",
    };
  } catch (error) {
    console.error("=== ERROR IN UPDATE VARIANT ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    return {
      success: false,
      message: `Lỗi: ${error.message}`,
    };
  }
}

export async function dataForAdminPage(request) {
  const {admin} = await CheckToken(request)

  const response = await admin.graphql(`
    query {
      products(first: 10) {
        edges {
          node {
            id
            totalInventory
            variants(first: 1) {
              edges {
                node {
                  price
                  compareAtPrice
                }
              }
            }
          }
        }
      }
    }
  `);

  if (!response.ok) throw new Error("Không thấy được dữ liệu API");

  const result = await response.json();
  const products = result?.data?.products?.edges?.map(edge => edge.node) || [];

  const totalInventory = products.reduce(
    (sum, p) => sum + (p.totalInventory || 0),
    0
  );

  
  const discountCount = 5; 

  return {
    totalProducts: products.length,
    totalInventory,
    discountCount,
  };
}

const shop = 'shop-sieu-vip.myshopify.com';
const accessToken = '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';

export async function createDiscountCodeWithFullDebug({ customerId, amount, code, expiresAt }) {
  const query = `
    mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              startsAt
              endsAt
              customerSelection {
                ... on DiscountCustomers {
                  customers {
                    id
                  }
                }
              }
              customerGets {
                value {
                  ... on DiscountPercentage {
                    percentage
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    basicCodeDiscount: {
      title: `Giảm giá đổi điểm: ${code}`,
      code,
      startsAt: new Date().toISOString(),
      endsAt: expiresAt.toISOString(),
      customerSelection: {
        customers: {
          add: [customerId],
        },
      },
      customerGets: {
       "value": {
        "discountAmount": {
          "amount": amount
        }
      },
        items: {
          all: true,
        },
      },
      minimumRequirement: {
        subtotal: {
          greaterThanOrEqualToSubtotal: "50.0",
        },
      },
      usageLimit: 1,
      appliesOncePerCustomer: true,
    },
  };

  const response = await fetch(`https://${shop}/admin/api/2025-04/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  console.log('Shopify API response:', JSON.stringify(result, null, 2));

  if (result.errors || (result.data?.discountCodeBasicCreate?.userErrors?.length ?? 0) > 0) {
    throw new Error('Tạo mã giảm giá thất bại: ' + JSON.stringify(result));
  }

  return result;
}

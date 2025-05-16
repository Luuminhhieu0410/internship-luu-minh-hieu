import { Button, Card, Text, Box, Layout } from "@shopify/polaris";
import React from "react";

const products = [
  { id: 1, name: "Product A", price: "$10.00" },
  { id: 2, name: "Product B", price: "$15.00" },
  { id: 3, name: "Product C", price: "$20.00" },
];

export default function product() { 

  const handleAddToCart = (product) => {
    alert(product.name);
  };

  return (
    <>
      <Layout>
        {products.map((product) => (
          <Layout.Section key={product.id} oneThird>
            <Card>
                <Box>
                  <Text as="h3" variant="headingSm">
                    {product.name}
                  </Text>
                  <Text variant="bodyMd" color="subdued">
                    {product.price}
                  </Text>
                </Box>
                <Button onClick={() => handleAddToCart(product)}>Add to cart</Button>
              
            </Card>
          </Layout.Section>
        ))}
      </Layout>
    </>
  );
}

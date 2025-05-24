
import { useLoaderData } from "@remix-run/react";

import { TitleBar } from "@shopify/app-bridge-react";
import { Page, TextField, Thumbnail } from "@shopify/polaris";
import { useState} from "react";
import { getProduct } from "../api_admin/product.server.js";
import ProductTable from "../components/ProductTable";

export async function loader({ request }) {
  const dataAPI = await getProduct(request);
  return dataAPI ?? null;
}

export default function AdminProduct() {
  const dataAPI = useLoaderData();

  const originProduct = dataAPI.data.products.edges.map((edge) => ({
    id: edge.node.id.replace("gid://shopify/Product/", ""),
    image: (
      <Thumbnail
        source={edge.node.images.edges[0]?.node.originalSrc || ""}
        alt={edge.node.title}
      />
    ),
    name: edge.node.title,
    price: edge.node.variants.edges[0]?.node.price || "N/A",
  }));

  const [value, setValue] = useState("");
  const [products, setProducts] = useState(originProduct);

  const handleChange = (newValue) => {
  setValue(newValue);
  const filtered = originProduct.filter((product) =>
    product.name.toLowerCase().includes(newValue.toLowerCase())
  );
  setProducts(filtered);
};
  return (
    <Page title="Sales by product">
      <TitleBar title="AdminProduct" />
      
         
        <TextField
          label="Store name"
          value={value}
          onChange={handleChange}
          autoComplete="off"
        />
     
      <ProductTable products={products} />
    </Page>
  );
}

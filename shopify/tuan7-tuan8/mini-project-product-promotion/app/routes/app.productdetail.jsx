import {
  useLoaderData,
  useActionData,
  useSubmit,
  useNavigation,
  useFetcher,
  useRevalidator,
} from "@remix-run/react";  
import {
  Page,
  LegacyCard,
  Grid,
  Card,
  Button,
  Thumbnail,
  TextContainer,
  TextField,
  Modal,
  Toast,
  Frame,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useEffect, useCallback } from "react";
import { json } from "@remix-run/node";
import { getAllVariantsProduct, updateVariantPriceAndInventory} from "../api/Product";
import sanitizeInput from "../middleware/ValidateXSS";

let idProduct = "";
export async function loader({ request }) {
  console.log("load loader");
  const url = new URL(request.url);
  idProduct = url.searchParams.get("id");
  const response = await getAllVariantsProduct(request, idProduct);
  return response;
}


export async function action({ request }) {
  console.log("action start");

  const formData = await request.formData();
  const variantId = formData.get("variantId");
  const price = formData.get("price");
  const inventoryQuantity = formData.get("inventoryQuantity");

  console.log("form data received:");
  console.log("- variantId:", variantId);
  console.log("- price:", price);
  console.log("- inventoryQuantity:", inventoryQuantity);

  // validation
  const errors = {};

  if (!price || price.trim() === "") {
    errors.price = "Giá không được để trống";
    return json({ success: false, message: "Giá không được để trống"});
  } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    errors.price = "Giá phải là số dương";
    return json({ success: false, message: "Giá phải là số dương"});
    
  }

  if (!inventoryQuantity || inventoryQuantity.trim() === "") {
    errors.inventoryQuantity = "Tồn kho không được để trống";
    return json({ success: false, message: "Tồn kho không được để trống"});

  } else if (isNaN(parseInt(inventoryQuantity)) || parseInt(inventoryQuantity) < 0) {
    errors.inventoryQuantity = "Tồn kho phải là số nguyên không âm";
    return json({ success: false, message: "Tồn kho phải là số nguyên không âm"});

  }

  if (Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors);
    return json({ success: false, errors }, { status: 400 });
  }

  try {
    const result = await updateVariantPriceAndInventory(
      request,
      variantId,
      parseFloat(price),
      parseInt(inventoryQuantity),
    );

    // console.log("API result:", result);

    if (result.success) {
      return json({ success: true, message: result.message });
    } else {
      return json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("error:", error);
    return json({
      success: false,
      message: `error: ${error.message}`,
    });
  }
}

export default function ProductDetail() {
  const dataAPI = useLoaderData();
  const actionData = useActionData();

  const revalidator = useRevalidator();
  const submit = useSubmit();
  const navigation = useNavigation();
  const product = dataAPI?.data?.product;
  const fetcher = useFetcher();
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);

  const [price, setPrice] = useState("");
  const [inventoryQuantity, setInventoryQuantity] = useState("");
  const [priceError, setPriceError] = useState("");
  const [inventoryError, setInventoryError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);
  const [reload, setReload] = useState(true);
  const handleChangePrice = useCallback((newValue) => {
    setPrice(newValue);
    setPriceError("");
  }, []);

  const handleChangeQuantity = useCallback((newValue) => {
    setInventoryQuantity(newValue);
    setInventoryError("");
  }, []);

  useEffect(() => {
    if (actionData) {
      if (actionData.errors) {
        console.log("errors : " + actionData.errors);
        setPriceError(actionData.errors.price || "");
        setInventoryError(actionData.errors.inventoryQuantity || "");
      }

      if (actionData.success !== undefined) {
        setToastMessage(actionData.message);
        console.log("message toast " + actionData.message)
        setToastError(!actionData.success);
        setShowToast(true);

        if (actionData.success) {
          setActive(false);
          setPrice("");
          setInventoryQuantity("");
          setPriceError("");
          setInventoryError("");

          //load lại dữ liệu mới từ loader
          revalidator.revalidate();
        }
      }
    }
  }, [actionData, revalidator]);

  const isSubmitting = navigation.state === "submitting";

  const variants = product?.variants?.edges.map((edge) => edge.node) || [];
  // console.log("ALL VARIANT : " + JSON.stringify(variants));
  // console.log("product = >>>>> " + JSON.stringify(product));

  const defaultProductImage = product?.media?.edges[0]?.node?.image?.url || "";

  const [BigImageUrl, setBigImageUrl] = useState(defaultProductImage);
  const [listMediaImageProduct, setListMediaImageProduct] = useState([]);

  const optionGroups = {};
  variants.forEach((variant) => {
    variant.selectedOptions.forEach(({ name, value }) => {
      if (!optionGroups[name]) optionGroups[name] = new Set();
      optionGroups[name].add(value);
    });
  });

  const initialOptions = {};
  for (const [name, values] of Object.entries(optionGroups)) {
    initialOptions[name] = Array.from(values)[0];
  }

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const handleSubmit = useCallback(() => {
    if (!selectedVariant) {
      setToastMessage("Vui lòng chọn một biến thể");
      setToastError(true);
      setShowToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("variantId", selectedVariant.id);
    formData.append("price", price);
    formData.append("inventoryQuantity", inventoryQuantity);

    submit(formData, { method: "post" });
  }, [selectedVariant, price, inventoryQuantity, submit]);

  useEffect(() => {
    if (product?.media?.edges) {
      const arr = product.media.edges.map((edge) => {
        return edge.node.image.url;
      });
      setListMediaImageProduct(arr);
    }
  }, [dataAPI]);

  useEffect(() => {
    const matched = variants.find((variant) =>
      variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value,
      ),
    );
    if (matched) {
      console.log("matched : " + JSON.stringify(matched));
      setSelectedVariant(matched);
      setBigImageUrl(
        matched?.media?.edges[0]?.node?.image?.url || defaultProductImage,
      );

      setPrice(matched.price || "");
      setInventoryQuantity(matched.inventoryQuantity?.toString() || "");
    }
  }, [selectedOptions]);

  // reset selected options khi data thay đổi
  useEffect(() => {
    if (variants.length > 0) {
      const newOptionGroups = {};
      variants.forEach((variant) => {
        variant.selectedOptions.forEach(({ name, value }) => {
          if (!newOptionGroups[name]) newOptionGroups[name] = new Set();
          newOptionGroups[name].add(value);
        });
      });

      const newInitialOptions = {};
      for (const [name, values] of Object.entries(newOptionGroups)) {
        newInitialOptions[name] = Array.from(values)[0];
      }

      setSelectedOptions(newInitialOptions);
    }
  }, [dataAPI]);

  console.log("selected Options  " + JSON.stringify(selectedOptions));
  console.log("selected Variant " + JSON.stringify(selectedVariant));

  const handleOptionClick = (optionName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const isOptionValueAvailable = (optionName, value) => {
    const tempOptions = { ...selectedOptions, [optionName]: value };
    return variants.some((variant) =>
      variant.selectedOptions.every(
        (opt) => tempOptions[opt.name] === opt.value,
      ),
    );
  };

  const activator = (
    <Button onClick={handleChange} primary disabled={!selectedVariant}>
      Cập nhật giá / tồn kho
    </Button>
  );

  const toastMarkup = showToast ? (
    <Toast
      content={toastMessage}
      error={toastError}
      onDismiss={() => setShowToast(false)}
    />
  ) : null;

  return (
    <Frame>
      <Page>
        <TitleBar title="PRODUCT DETAIL" />
        <Modal
          activator={activator}
          open={active}
          onClose={handleChange}
          title={`Cập nhật: ${selectedVariant?.selectedOptions?.map((opt) => opt.value).join(" / ") || ""}`}
          primaryAction={{
            content: isSubmitting ? "Đang cập nhật..." : "Cập nhật",
            onAction: handleSubmit,
            disabled: isSubmitting,
          }}
          secondaryActions={[
            {
              content: "Đóng",
              onAction: handleChange,
              disabled: isSubmitting,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <TextField
                label="Giá (VNĐ)"
                value={price}
                onChange={handleChangePrice}
                autoComplete="off"
                type="number"
                min="0"
                step="1"
                error={priceError}
                helpText="Nhập giá mới biến thể"
              />
              <TextField
                label="Tồn kho"
                value={inventoryQuantity}
                onChange={handleChangeQuantity}
                autoComplete="off"
                type="number"
                min="0"
                step="1"
                error={inventoryError}
                helpText="Nhập số lượng tồn kho mới"
              />
            </TextContainer>
          </Modal.Section>
        </Modal>

        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 3 }}>
            <Card>
              <Card sectioned>
                <img
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    maxWidth: "100%",
                    borderRadius: "10px",
                  }}
                  src={BigImageUrl}
                  alt="Product"
                />
              </Card>
              <div style={{ marginTop: "20px" }}>
                {listMediaImageProduct.map((linkImg, index) => (
                  <img
                    key={index}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setBigImageUrl(linkImg);
                    }}
                    src={linkImg}
                    alt={`Thumbnail ${index}`}
                  />
                ))}
              </div>
            </Card>
          </Grid.Cell>

          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 3 }}>
            <LegacyCard sectioned>
              <h1 style={{ fontSize: "30px", fontWeight: "600" }}>
                {product?.title || ""}
              </h1>
              <br></br>

              <Card>
                <h1
                  style={{ color: "red", fontWeight: "700", fontSize: "20px" }}
                >   
                  {selectedVariant
                    ? `Price : ${parseFloat(selectedVariant.price).toLocaleString()}đ`
                    : "Chọn biến thể"}
                </h1>
              </Card>

              <br />

              <Card>
                <span style={{ fontWeight: "600", fontSize: "15px" }}>
                  Tồn kho:{" "}
                  {selectedVariant ? selectedVariant.inventoryQuantity : "-"}
                </span>
              </Card>

              <br />

              <Grid>
                {Object.entries(optionGroups).map(
                  ([optionName, values], index) => (
                    <Grid.Cell
                      key={index}
                      columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                    >
                      <LegacyCard title={optionName} sectioned>
                        {Array.from(values).map((value, i) => {
                          const isAvailable = isOptionValueAvailable(optionName,value);
                          if (!isAvailable) return null;
                          return (
                            <Button
                              key={i}
                              onClick={() =>
                                handleOptionClick(optionName, value)
                              }
                              plain={selectedOptions[optionName] !== value}
                              pressed={selectedOptions[optionName] === value}
                            >
                              {value}
                            </Button>
                          );
                        })}
                      </LegacyCard>
                    </Grid.Cell>
                  ),
                )}
              </Grid>
              <br></br>
              <Card>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeInput(product?.descriptionHtml) || "",
                  }}
                ></div>
              </Card>
            </LegacyCard>
          </Grid.Cell>
        </Grid>
        {toastMarkup}
      </Page>
    </Frame>
  );
}

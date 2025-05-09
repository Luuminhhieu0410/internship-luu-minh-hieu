const url = "http://localhost:3000";
export const getProductPage = async (page) => {
  return fetch(url + "/products/" + page).then((data) =>
    data.json()
  );
};

export const searchProduct = async (keyword) => {
    return fetch(url + "/products/search/" + keyword).then((data) =>
        data.json()
      );
}
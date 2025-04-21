export function add(a,b){
    return a + b;
}

export function multiply(a,b){
    return a*b;
}

export default {
    addProduct(products,product){
        products.push(product);
    },
    removeProductById(products, id){
        products.splice(id-1,1)
    },
    getTotalPrice(products) {
        return products.reduce((total,element) => total += element.price,0)
    },

    getProductNames : (products) => {
        return products.map((item) => item.name);
    },
    findProduct : (products, keyword) =>{
        return products.find((element) => element.name == keyword);
    },
    getExpensiveProducts : (products, minPrice) => {
        return products.filter((element) => element.price >= minPrice);
    }
    
}

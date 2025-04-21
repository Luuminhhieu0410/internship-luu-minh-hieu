// 1. let, const, var
//1.1   Viết 1 đoạn code minh hoạ sự khác biệt giữa var, let, const khi khai báo trong block scope
function test() {
    try {
        const dk = 3;
        if (dk > 2) {
            var hello = "hello";
            let block = "hi";
        }

        hello = "hello world";
        console.log(hello); // hello world
        console.log(block); // block is not defined
    } catch (error) {
        console.log("lỗi : " + error);
    }
}
test();

// 1.2: Thử thay đổi giá trị của biến khai báo bằng const. Điều gì xảy ra?
try {
    const name = 'hieu';
    name = 'minh'; //  TypeError: Assignment to constant variable.
} catch (error) {
    console.log("lỗi : " + error);
}

// 2. Arrow Function
// Bài 2.1: Viết lại các hàm sau bằng arrow function:
let greet = (name) =>{
    return 'Hello' + name;
}

let square = (n) => {
    return n * n;
}

// // Bài 2.2: Viết arrow function để nhận 1 mảng số, trả về mảng chứa bình phương của mỗi số.
let squareArr = (arr) =>{
    return arr.map((item) => item * item);
}
let arr1 = [1,2,3,4];
let arr2 = squareArr(arr1); // 1,4,9,16

// 3. Spread & Rest
// Bài 3.1: Dùng spread để copy mảng, thêm phần tử mới.
// const oldArray = [1, 2, 3];

const oldArray = [1,2,3];
function copy(arr,newItem){
   return [...arr,newItem];
}
// const newArray = copy(oldArray,4); // 1,2,3,4
// Bài 3.2: Viết hàm sumAll(...numbers) dùng rest để tính tổng n số bất kỳ.
let sumAll = (...numbers) =>{
    let sum = 0;
    numbers.forEach(element => {
        sum += element;
    });
    return sum;
}
sumAll(1,2,3,4,5); //15

// 4. Destructuring
// Bài 4.1: Dùng destructuring để tách các phần tử từ object sau:
// const user = { name: 'An', age: 20, city: 'HCM' };

const user = { name: 'An', age: 20, city: 'HCM' };
let {name, age,city} = user; // An, 20 , HCM

// Bài 4.2: Dùng destructuring để tách phần tử đầu và phần còn lại từ mảng:
// const colors = ['red', 'green', 'blue'];

const colors = ['red', 'green', 'blue'];
let [color1,color2,color3] = colors;


// 5. Export / Import
// Bài 5.1: Tạo file math.js export 2 hàm add(a, b) và multiply(a, b).
//  Tạo file main.js để import và dùng 2 hàm đó.

import { add,multiply } from "./main.mjs";
console.log(add(1,2)); // 3
console.log(multiply(2,3));// 6

// 6. Array Functions (map, filter, reduce, ...)
// Bài 6.1: Dùng map() để nhân đôi từng phần tử trong mảng [1, 2, 3, 4].
let arrMap = [1,2,3,4].map((item) => item*item);

// Bài 6.2: Dùng filter() để lọc ra các số chẵn từ [1, 2, 3, 4, 5, 6].
let arrFilter = [1,2,3,4,5,6].filter((item) => item % 2 == 0);

// Bài 6.3: Dùng reduce() để tính tổng các số trong mảng [10, 20, 30].
let arrReduce = [10,20,30].reduce((total,num)=>total+num);

// 7. Primitive vs Reference
// Bài 7.1: Viết ví dụ để chứng minh number là kiểu primitive, còn object là kiểu tham chiếu.

// ví dụ primitive
let a = 10;
let b = a;
b = 20; 
console.log(a,b) // 10,20

let objectA = {
    name: 'hieu'
}
let objectB = objectA;
objectB.name = 'minh';
console.log(objectA); // name : minh

// Quản lý danh sách sản phẩm
import method from './main.mjs'
const products = [
    { id: 1, name: 'iPhone', price: 1000 },
    { id: 2, name: 'iPad', price: 800 },
    { id: 3, name: 'Macbook', price: 2000 }
  ];

method.addProduct(products,{id:4,name:'Nokia',price:'300'});
method.removeProductById(products,1);
console.log(method.getTotalPrice(products));
console.log(method.getProductNames(products));
console.log(method.findProduct(products,'iPad'));
console.log(method.findProduct(products,'iPad'));
console.log(method.getExpensiveProducts(products,1000));

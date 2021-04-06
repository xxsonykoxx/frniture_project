const url =
  'https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/sonyko/';
let productList = [];
let cartList = [];

/* get 資料 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function getProducts() {
  axios.get(`${url}products`).then((res) => {
    productList = res.data.products;
  })
  .catch((err) => {
    console.log(err);
  });
}

/* 資料初始化 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)
p.s. 這邊不知道怎麼跟上面的  get 資料結合 OAQ 
*/
function init() {
  axios.get(`${url}products`).then((res) => {
    productList = res.data.products;
    productRender(productList);
    console.log(productList);
  });
}

/* 渲染 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
const renderList = document.getElementById('renderProduct');
function productRender(data) {
  let str = '';
  data.forEach((i) => {
    str += `
    <li class="product_group">
    <div>
    <div class="product_image">
      <img src="${i.images}" >
    </div>
    <div class="product_text">
      <h3> ${i.title} </h3>
      <p class="product_details">
        ${i.description}
      </p>
    </div>
    </div>
    <div>
    <h3 class="product_price"> $ <span>${i.price}</span></h3>
    <div class="addcart-btn">
      <input type="button" value="加入購物車" class="addCartBTN" data-set="${i.id}">
    </div>
    </div>
  </li>
    `;
  });
  renderList.innerHTML = str;
}
init();

/* change 篩選 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
const categoryFilter = document.getElementById('categoryFilter');
categoryFilter.addEventListener('change', productFilter);
function productFilter(e) {
  let newList = productList.filter((i) => i.category == e.target.value);
  productRender(newList);
  if (e.target.value == 'all') {
    init();
  }
}

/* click 篩選 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
const searchBTN = document.querySelector('.searchBTN');
const keywordInput = document.querySelector('.keyword');
searchBTN.addEventListener('click', keywordFilter);
function keywordFilter(e) {
  getProducts();
  let keyword = keywordInput.value;
  let newFilter = productList.filter(
    (i) =>
      i.category.includes(keyword) ||
      i.title.includes(keyword) ||
      i.description.includes(keyword),
  );
  if (newFilter == '') {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: '查無資料 (´・ω・`)',
      showConfirmButton: false,
      timer: 1500,
    });
    keywordInput.value = '';
  } else {
    productRender(newFilter);
    keywordInput.value = '';
  }
}

/* 加入購物車 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
renderList.addEventListener('click', addCart);
function addCart(e) {
  if (e.target.nodeName === 'INPUT') {
    let productId = e.target.dataset.set;
    let obj = {
      data: {
        productId: productId,
        quantity: 1,
      },
    };
    axios
      .post(`${url}carts`, obj)
      .then((res) => {
        console.log(res);
        getCart();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

/* 取得購物車 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function getCart() {
  axios.get(`${url}carts`).then((res) => {
    cartList = res.data.carts;
    cartRender(cartList);
  })
  .catch((err) => {
    console.log(err);
  });
}
getCart();
const frontEndTable = document.getElementById('frontEndTable');
const cartTotalPrice = document.getElementById('cartTotalPrice');
/* 渲染購物車 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function cartRender(data) {
  let html = '';
  let total = 0;
  data.forEach((i) => {
    total += i.product.price;
    html += `
    <tr>
    <td>${i.product.title}</td>
    <td>$ ${i.product.price}</td>
    <td>${i.quantity}</td>
    <td>$ ${i.product.price}</td>
    <td>
      <button data-set="${i.id}"> 刪除 </button>
    </td>
  </tr>
    `;
  });
  frontEndTable.innerHTML = html;
  cartTotalPrice.innerHTML = total;
}

/* 刪除單一 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
frontEndTable.addEventListener('click', delCart);
function delCart(e) {
  if (e.target.nodeName === 'BUTTON') {
    axios
    .delete(`${url}carts/${e.target.dataset.set}`)
    .then((res) => {
      console.log(res);
      getCart();
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
/* 清空購物車 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
const clearAllCartBtn = document.getElementById('clearAllCartBtn');
clearAllCartBtn.addEventListener('click', clearAllProducts);
function clearAllProducts() {
  axios
    .delete(`${url}carts`)
    .then((res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '購物車已清空',
        showConfirmButton: false,
        timer: 1500,
      });
      getCart();
    })
    .catch((err) => console.log(err));
}

const checkoutBTN = document.getElementById('checkoutBTN');
checkoutBTN.addEventListener('click', checkout);
function checkout() {
  if (cartList == '') {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: '購物車空空(´・ω・｀)',
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    window.location = 'booking.html';
  }
}

// 參考
// productList.addEventListener('click',function(e){
//   e.preventDefault();
//   let target = e.target;
//   if (target.matches('.merchandise__item .add-button')){
//       let productId = target.closest('.merchandise__item').dataset.id;
//       let productNum = 0;
      
//       data.cartList.carts.forEach(item=>{
//           if (item.product.id === productId ){
//               productNum = item.quantity;
//           }
//       })
//       addCartItem(productId, productNum);
//   }
// })
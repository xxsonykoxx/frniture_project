
const url = 'https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/sonyko/';
let productList = [];
let cartList = [];

/* 產品渲染 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function getProducts(){
  axios.get(`${url}products`)
  .then(res => {
    productList = res.data.products;
    productRender(productList)
    console.log(productList)
  })
}
const renderList = document.getElementById('renderProduct')
function productRender(data) {
  let str = '';
  data.forEach(i => {
    str +=`
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
    `
  });
  renderList.innerHTML = str;
}
getProducts();
/* 加入購物車 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
renderList.addEventListener('click',addCart)
function addCart(e){
  let productId = e.target.dataset.set;
  let obj = {
    data : {
      productId: productId,
      quantity: 1
    }
  }
  axios.post(`${url}carts`,obj)
  .then(res=> { 
    console.log(res)
    getCart () 
  })
  .catch( err => { console.log(err) })
}

/* 取得購物車 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function getCart () {
  axios.get(`${url}carts`)
  .then( res => {
    cartList = res.data.carts
    cartRender(cartList);
  })
}
getCart ()
const frontEndTable = document.getElementById('frontEndTable');

/* 渲染購物車 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function cartRender(data){
  let html ="";
  data.forEach(i => {
    html += `
    <tr>
    <td>${i.product.title}</td>
    <td>$ ${i.product.price}</td>
    <td>1</td>
    <td>$ ${i.product.price}</td>
    <td>
      <button data-set="${i.id}"> 刪除 </button>
    </td>
  </tr>
    `
  })
  frontEndTable.innerHTML = html;
}

/* 刪除購物車 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
frontEndTable.addEventListener('click', delCart);
function delCart (e){
  axios.delete(`${url}carts/${e.target.dataset.set}`)
  .then(res => {
    console.log(res);
    getCart ();
  })
  .catch(err => { console.log(err) });
}

const checkoutBTN = document.getElementById('checkoutBTN');
checkoutBTN.addEventListener('click',checkout );
function checkout() {
  if (cartList == '') {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: '購物車空空(´・ω・｀)',
      showConfirmButton: false,
      timer: 1500
    })
  } else {
    window.location = "booking.html";
  }
}

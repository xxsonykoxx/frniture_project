const url =
  'https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/sonyko/';
let productList = [];
let cartList = [];

/* get 資料 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
function getProducts() {
  axios
    .get(`${url}products`)
    .then((res) => {
      productList = res.data.products;
    })
    .catch((err) => {
      console.log(err);
    });
}

/* 資料初始化 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ
p.s. 這邊不知道怎麼跟上面的  get 資料結合 OAQ 
*/
function init() {
  axios.get(`${url}products`).then((res) => {
    productList = res.data.products;
    productRender(productList);
    console.log(productList);
  });
}

/* 渲染 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
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

/* select 篩選 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
const notFound = document.querySelector('#notFound');
categoryFilter.addEventListener('change', productFilter);
function productFilter() {
  let filterArray = [];
  notFound.classList.remove('display');
  filterArray = productList.filter((item) => {
    if (categoryFilter.value) {
      notFound.classList.remove('display');
      console.log(categoryFilter.value);
      return (
        item.category === categoryFilter.value &&
        item.title.toUpperCase().indexOf(keywordInput.value.toUpperCase()) !== -1
      );
    }
    return item.title.toUpperCase().indexOf(keywordInput.value.toUpperCase()) !== -1;
  });
  if (filterArray == '') {
    notFound.classList.add('display');
  }
  productRender(filterArray);
}

/* keyword 篩選 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
const searchBTN = document.querySelector('.searchBTN');
const keywordInput = document.querySelector('.keyword');
keywordInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchProduct();
  }
});
searchBTN.addEventListener('click', searchProduct);
function searchProduct() {
  let filterArray = [];
  filterArray = productList.filter((item) => {
    if (categoryFilter.value) {
      notFound.classList.remove('display');
      console.log(categoryFilter.value);
      return (
        item.category === categoryFilter.value.toUpperCase() &&
        item.title.toUpperCase().indexOf(keywordInput.value.toUpperCase()) !==
          -1
      );
    } else {
      notFound.classList.remove('display');
    }
    return (
      item.title.toUpperCase().indexOf(keywordInput.value.toUpperCase()) !== -1
    );
  });
  productRender(filterArray);
  if (filterArray == '') {
    notFound.classList.add('display');
  }
}

/* 加入購物車 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
renderList.addEventListener('click', addCart);
function addCart(e) {
  let isInCart;
  let productId = e.target.dataset.set;
  cartList.forEach((i) => {
    if (i.product.id === productId) {
      isInCart = 'yes';
    }
  });
  if (e.target.nodeName === 'INPUT' && isInCart === 'yes') {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: '已經加到車車了！',
      showConfirmButton: false,
      timer: 1200,
    });
  } else if (e.target.nodeName === 'INPUT' && isInCart !== 'yes') {
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
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '成功加入購物車',
          showConfirmButton: false,
          timer: 1200,
        });
        getCart();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

/* 取得購物車 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
function getCart() {
  axios
    .get(`${url}carts`)
    .then((res) => {
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

/* 渲染購物車 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
function cartRender(data) {
  let html = '';
  let total = 0;
  data.forEach((i) => {
    total += i.product.price * i.quantity;
    html += `
    <tr>
    <td>${i.product.title}</td>
    <td>$ ${i.product.price}</td>
    <td>
    <i class="fas fa-minus" id="removeItemBTN" data-set="${i.id}"></i>
    ${i.quantity}
    <i class="fas fa-plus" id="addItemBTN" data-set="${i.id}"></i>
    </td>
    <td>$ ${i.product.price * i.quantity}</td>
    <td>
      <button data-set="${i.id}"> 刪除 </button>
    </td>
  </tr>
    `;
  });
  frontEndTable.innerHTML = html;
  cartTotalPrice.innerHTML = total;
}

/* 刪除單一 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
frontEndTable.addEventListener('click', delCart);
function delCart(e) {
  if (e.target.nodeName === 'BUTTON') {
    axios
      .delete(`${url}carts/${e.target.dataset.set}`)
      .then((res) => {
        console.log(res);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '移除成功(￣^￣)ゞ',
          showConfirmButton: false,
          timer: 1200,
        });
        getCart();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
/* 清空購物車 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
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

/* 数変え ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
frontEndTable.addEventListener('click', changeItemNum);
function changeItemNum(e) {
  if (e.target.id === 'addItemBTN') {
    addItemNum(e);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '新增成功(￣^￣)ゞ',
      showConfirmButton: false,
      timer: 1200,
    });
  }
  if (e.target.id === 'removeItemBTN') {
    removeItemNum(e);
  }
}

/* 数を増やす ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
function addItemNum(e) {
  console.log(cartList, e.target.dataset.set);
  cartList.forEach((i) => {
    if (i.id === e.target.dataset.set) {
      let obj = {
        data: {
          id: i.id,
          quantity: i.quantity + 1,
        },
      };
      axios.patch(`${url}carts`, obj).then((res) => {
        console.log(res);
        getCart();
      });
    }
  });
}

/* 削除 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ*/
function removeItemNum(e) {
  console.log(cartList, e.target.dataset.set);
  cartList.forEach((i) => {
    console.log(i.quantity);
    if (i.id === e.target.dataset.set) {
      if (i.quantity === 1) {
        Swal.fire({
          title: '確定要移除商品嗎？',
          text: '刪囉 ？ (´・ω・｀)',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#a3cfee',
          cancelButtonColor: '#f49f9f',
          confirmButtonText: '刪',
          cancelButtonText: '不要好了',
        }).then((result) => {
          if (result.isConfirmed) {
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
        });
      } else {
        let obj = {
          data: {
            id: i.id,
            quantity: i.quantity - 1,
          },
        };
        axios.patch(`${url}carts`, obj).then((res) => {
          console.log(res);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '移除成功(￣^￣)ゞ',
            showConfirmButton: false,
            timer: 1200,
          });
          getCart();
        });
      }
    }
  });
}

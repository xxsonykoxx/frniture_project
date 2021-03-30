const url =
  'https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/sonyko/orders';
const backendTable = document.getElementById('backendTable');
const token = {
  headers: {
    Authorization: 'lttvqL3Ca0N6CJ8xAJBqvXBlFe92',
  },
};

/* 取得後台訂單 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function getOrders() {
  axios.get(url, token).then((res) => {
    let orders = res.data.orders;
    ordersRender(orders);
  });
}
getOrders();

/* 渲染訂單 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function ordersRender(data) {
  let html = '';
  let status;
  let date;
  let formatDate;
  data.forEach((i) => {
    if (i.paid == 'true') {
      status = '已付款';
    } else {
      status = '未付款';
    }
    date = new Date(i.createdAt);
    formatDate = timeformat(date);
    html += `
    <tr>
      <td>${i.id}</td>
      <td class="order-name">${i.user.name}</td>
      <td>${i.user.address}</td>
      <td class="order-email">${i.user.email}</td>
      <td>${i.products[0].title}</td>
      <td  class="order-date">${formatDate}</td>
      <td>${status}</td>
      <td>
        <button class="del-order" data-set="${i.id}"> 移除 </button>
      </td>
    </tr>
    `;
  });
  backendTable.innerHTML = html;
}
/* unix時間轉換 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function timeformat(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${year}/${month}/${day}`;
}

/* 刪除訂單 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
backendTable.addEventListener('click', delOrder);
function delOrder(e) {
  let id = e.target.dataset.set;
  Swal.fire({
    title: '確定要刪除訂單嗎？',
    text: '刪掉不要後悔喔(´・ω・｀)',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#a3cfee',
    cancelButtonColor: '#f49f9f',
    confirmButtonText: '刪',
    cancelButtonText: '不要好了',
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`${url}/${id}`, token).then((res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '成功刪除訂單',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          console.log(res);
          getOrders();
        });
      });
    }
  });
}

/* 刪除全部訂單 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
const delAllBTN = document.getElementById('delAllBTN');
delAllBTN.addEventListener('click', delAllOrder);
function delAllOrder() {
  Swal.fire({
    title: '確定要刪除全部訂單嗎？',
    text: '刪掉不要後悔喔(´・ω・｀)',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#a3cfee',
    cancelButtonColor: '#f49f9f',
    confirmButtonText: '刪',
    cancelButtonText: '不要好了',
  })
  .then(result => {
    if (result.isConfirmed) {
      axios.delete(url, token).then((res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '成功刪除所有訂單',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          console.log(res);
          getOrders();
        });
      });
    }
  })
}

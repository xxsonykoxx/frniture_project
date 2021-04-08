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
    orders = res.data.orders;
    ordersRender(orders);
    chartFilter(orders)
  })
}
getOrders();

/* 渲染訂單 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function ordersRender(data) {
  let html = '';
  let date;
  let productDetail = '';
  let formatDate;
  
  data.forEach((i) => {
    i.products.forEach( item => {
      productDetail += `${item.title} x ${item.quantity} </br>`
    });
    date = new Date(i.createdAt);
    formatDate = timeformat(date);
    html += `
    <tr>
      <td>${i.id}</td>
      <td class="order-name">${i.user.name}</td>
      <td>${i.user.address}</td>
      <td class="order-email">${i.user.email}</td>
      <td>${productDetail}</td>
      <td class="order-date">${formatDate}</td>
      <td class="paid"
      id="patchBTN">
      <span
      >${i.paid?`<span class="done patch" data-set="${i.id}" data-paid="${i.paid}"><i class="fas fa-check"></i>已處理</span>`:`<span class="undisposed patch" data-set="${i.id}" data-paid="${i.paid}"><i class="fas fa-times"></i>未處理</span>`}</span></td>
      <td>
        <button class="del-order" id="deleteOneBTN" data-set="${i.id}"> 移除 </button>  
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

/* 修改訂單 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
backendTable.addEventListener('click', delOrder);
function delOrder(e) {
  let id = e.target.dataset.set;
  if( e.target.id == 'deleteOneBTN' ){
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
}
backendTable.addEventListener('click', putOrder);
function putOrder(e) {
  if(e.target.classList[1] === 'patch') {
    let id = e.target.dataset.set ;
    let paid = e.target.dataset.paid; 
    if( paid =='false'){
      paid = true;
    } else if (paid =='true') {
      paid = false;
    }
    const obj = {
      data : {
        id : id,
        paid : paid
      }
    }
    axios.put(url,obj,token)
    .then(res => {
      console.log(res)
      getOrders();
    })
  }
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


function chartFilter(data) {
	let editData = {};
	data.forEach(product => {
    product.products.forEach(item => {
      if (editData[item.title] == undefined) {
        editData[item.title] = 1;
      } else {
        editData[item.title] += 1;
      }
    })	
	});
	let columns = [];
	let product = Object.keys(editData);
	product.forEach(item => {
		columns.push([item, editData[item]]);
	});
	c3Chart(columns);
}

// c3 ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ ☆.｡.:*・ﾟ
function c3Chart(columns) {
	const chart = c3.generate({
		bindto: "#chart",
		data: {
			columns: columns,
			type: "pie",
		},
    color: {
      pattern: ['#6aacd8', '#84bbe0', '#a9cee8', '#c4deef', '#b7e28f', '#98df8a']
    },
	});
}
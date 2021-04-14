const username = document.getElementById('name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const address = document.getElementById('address');
const payment = document.getElementById('payment');
const bookingBTN = document.getElementById('bookingBTN');
const url =
  'https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/sonyko/';

/* 送出訂單 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
function order() {
  let detail = {
    data: {
      user: {
        name: username.value,
        tel: phone.value,
        email: email.value,
        address: address.value,
        payment: payment.value,
      },
    },
  };
  axios.post(`${url}orders`, detail).then((res) => {
    console.log(res);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '訂單已送出',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location = 'index.html';
    });
  });
}

/* 防呆 (´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)人(´・ω・`)*/
(function () {
  const constraints = {
    formName: {
      presence: {
        message: '必填欄位',
      },
    },
    formTel: {
      presence: {
        message: '為必填欄位',
      },
      length: { 
				minimum: 8 ,
				message: '至少 8 碼'
			},
			numericality: true
    },
    formEmail: {
      email: {
        message: '請輸入正確信箱',
      },
      presence: {
        message: '為必填欄位',
      },
		
    },
    formAddress: {
      presence: {
        message: '為必填欄位',
      },
    },
  };

  const form = document.getElementById('validateForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let errors = validate(form, constraints);
    if (errors) {
      formSubmitCheck(errors);
      Swal.fire({
        title: 'Error!',
        text: '有欄位尚未填寫',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } else {
      order();
    }
  });

  const inputs = document.querySelectorAll('#validateForm input');
  const message = document.querySelectorAll('.message');

  inputs.forEach((i) => {
    i.addEventListener('change', function (e) {
      e.preventDefault();
      let htmlName = i.name;
      let errors = validate(form, constraints);
      if (errors) {
        document.querySelector(`.${htmlName}`).textContent = errors[htmlName];

        console.log(errors, htmlName);
      } else {
        document.querySelector(`.${htmlName}`).textContent = '';
      }
    });
  });

  function formSubmitCheck(errors) {
    Object.keys(errors).forEach(
      (keys) => (document.querySelector(`.${keys}`).textContent = errors[keys]),
    );
  }
})();

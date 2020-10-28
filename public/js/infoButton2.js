
// subit order
function thankUser(){
  console.log('thanks yo');
  document.querySelector('.overlay').classList.remove('hidden')
  // document.querySelector('.overlay').style.display = 'block'
  document.querySelector('body').addEventListener('click', ()=>{
    window.location.href = '/profile'
  })
}


//  user info page.
const infoButton = document.querySelector('#submitButton')
infoButton.addEventListener('click', (e)=>{
  const billingDetails = []
  let first = document.querySelector('[name="first"]').value;
  if (first ==='') {
    naletme='omit'
  }
  let last = document.querySelector('[name="last"]').value;
  if (last ==='') {
    last ='omit'
  }
  let address = document.querySelector('[name="address"]').value;
  if (address ==='') {
    address ='omit'
  }
  let apartment = document.querySelector('[name="apartment"]').value;
  if (apartment ==='') {
    apartment ='omit'
  }
  let city = document.querySelector('[name="city"]').value;
  if (city ==='') {
    city ='omit'
  }
  let state = document.querySelector('[name="state"]').value;
  if (state ==='') {
    state ='omit'
  }
  let zip = document.querySelector('[name="zip"]').value;
  if (zip ==='') {
    zip ='omit'
  }
  let phone = document.querySelector('[name="phone"]').value;
  if (phone ==='') {
    phone ='omit'
  }
  let payment = document.querySelector('[name="email"]').value; //radio
  if (payment ==='') {
  payment  ='omit'
  }
  let orderID = document.querySelector('.orderID').innerText
  console.log(' order id is : ' + orderID);

  billingDetails.push({
    first: first,
    last: last,
    address: address,
    apartment: apartment,
    city: city,
    state: state,
    zip: zip,
    phone: phone,
    payment:payment,

  })
  console.log(name, last, address, apartment, city, state, zip, phone, payment  );

  fetch('/confirmOrder', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      orderID:orderID,
      billingDetails:billingDetails
    })
  })
  .then(response => {
    if (response.ok) return response.text()
  })
  .then(data => {
    console.log(data)

    thankUser();
  })

})

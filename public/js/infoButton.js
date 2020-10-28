
//  user info page.
const infoButton = document.querySelector('#infoButton')
infoButton.addEventListener('click', (e)=>{
  let first = document.querySelector('[name="first"]').value;
  if (first ==='') {
    naletme='omit'
  }
  let last = document.querySelector('[name="last"]').value;
  if (last ==='') {
    last ='omit'
  }
  let callName = document.querySelector('[name="callName"]').value;
  if ( callName ==='') {
    callName ='omit'
  }
  let country = document.querySelector('[name="address"]').value;
  if (country ==='') {
    country ='omit'
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
  let payment = document.querySelector('[name="payment"]').value; //radio
  if (payment ==='') {
  payment  ='omit'
  }

  console.log(name, last, callName, country, address, apartment, city, state, zip, phone, payment  );

  fetch('/userInfo', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      first: first,
      last: last,
      callName: callName,
      country: country,
      address: address,
      apartment: apartment,
      city: city,
      state: state,
      zip: zip,
      phone: phone,
    })
  })
  .then(response => {
    if (response.ok) return response.text()
  })
  .then(data => {
    console.log(data)
    window.location.href = '/profile'
  })

})

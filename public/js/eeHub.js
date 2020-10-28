
console.log('connected to the employeehub');

// complete an order
Array.from( document.querySelectorAll('.fa-check-circle') ).forEach((check, i) => {
  check.addEventListener('click', (e)=>{
    console.log(e.target);
    const orderNumber = e.target.parentElement.nextElementSibling.innerText.split(' ')[2].toString()
    let date = new Date()
    fetch('/complete', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'order': orderNumber,
        'date': `${date.getDate()}/${date.getMonth()+1}  ${date.getHours()}:${date.getMinutes()}`,   // shouldnt be here?
      })
    })
    .then(response => {
      if (response.ok) return response.text()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })

  })
});

// switching pages within eehub
document.querySelector('#main-nav-offcanvas').addEventListener('click', (e)=>{
  const page = document.querySelector('#hubContent');
  const bg = document.querySelector('.parallax-window')

  const orders = document.querySelector('#orders')
  const home = document.querySelector('#home')
  const userInfo= document.querySelector('#userInfo')

  if (e.target.innerText ==='CURRENT ORDERS' && (!e.target.classList.contains('current')) ) {
    orders.classList.remove('hidden')

    home.classList.add('hidden')
    userInfo.classList.add('hidden')
  }
  else if(e.target.innerText === 'MY ACCOUNT' && (!e.target.classList.contains('current'))){
    userInfo.classList.remove('hidden')

    home.classList.add('hidden')
    orders.classList.add('hidden')
  }
  else if(e.target.innerText === 'HOME' && (!e.target.classList.contains('current'))){
      home.classList.remove('hidden')

      userInfo.classList.add('hidden')
      orders.classList.add('hidden')
    }
})

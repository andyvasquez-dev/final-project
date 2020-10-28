console.log('main working');
document.querySelector('#seeMenu').addEventListener('click', ()=>{
  const tableNumber = document.querySelector('#tableNumber').value
  if ( tableNumber !== "") {
    document.location.href = `/restaurant/5f85c6f1e734f67ee38482f8/${tableNumber}`
  }
})

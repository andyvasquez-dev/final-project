
const login = document.querySelector('.loginBut')

var trash = document.getElementsByClassName("fa-trash");

// makes sure the script is connected
console.log('main.js connected');

document.querySelector('.checkout').addEventListener('click', ()=>{
    let cart = []

    Array.from(document.querySelector('#cartItems').children).forEach((item, i) => {
      console.log(item);
      //first list item from dom data
      let itemDish = item.firstElementChild.firstElementChild.innerText.trim()
      let itemTotal = item.firstElementChild.children[1].innerText.trim()
      //remove white space within itemTotal
      while(itemTotal.includes(' ')){ itemTotal=itemTotal.replace(' ', '')}

      //split up itemtotal
      let itemQuantity = itemTotal.slice(0,itemTotal.indexOf('×'))
      let itemPrice = itemTotal.slice(-(itemTotal.length - itemTotal.indexOf('$') - 1))
      let dishTotal = parseInt(itemPrice) * parseInt(itemQuantity);
      //itemQuantity, itemPrice, itemDish

      //push into array of obj if item
      cart.push( {
        dish:itemDish,
        price:parseInt(itemPrice),
        quantity:parseInt(itemQuantity),
        dishTotal:dishTotal
      } )
      console.log(cart);
    });
    if (cart.length) {

      const subtotal = parseInt(document.querySelector('.subtotal').innerText.trim().split('$')[1].trim())

      let date = new Date()
      fetch('/order', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'order': cart,
          'date': `${date.getDate()}/${date.getMonth()+1}  ${date.getHours()}:${date.getMinutes()}`,
          'total':`${subtotal}`
        })
      })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        // to checkout
        window.location.href = `/checkout/${data.restaurantID}/${data.table}`
      })
    }
})


function addTrashEvent(){
  Array.from(document.querySelectorAll('.remove_from_cart_button'))
  .forEach(function(element) {
        element.addEventListener('click', function(e){
        let subtotal = parseInt(document.querySelector('.subtotal').innerText.trim().split('$')[1].trim())

        let amount = e.target.previousElementSibling.children[1].innerText.slice(-3).trim()
        amount = parseInt(amount.slice(-(amount.length-1)))
        let quantity = parseInt(e.target.previousElementSibling.children[1].innerText.trim().slice( 0,  e.target.previousElementSibling.children[1].innerText.indexOf('×')))


        document.querySelector('.subtotal').innerHTML =
        `<strong>Subtotal: </strong>
                                  <span class="product-price-amount">
                                    <span class="product-price-currencySymbo">$</span>
                                    ${ subtotal - ( amount * quantity )}
                                  </span>`;
        e.target.parentElement.remove();
      });
  })
}

function addToCart(dish, price){

  price = parseInt(price.slice(-2));

  // array to hold cart items
  let cart = []
  // create array of current cart items
  const cartItems = Array.from(document.querySelector('#cartItems').children);
  console.log(cartItems.length);

  //clear html of the ul, to reprint an updated
  document.querySelector('#cartItems').innerHTML =  ""

  if (cartItems.length){
    //pushes data into cart array
    cartItems.forEach((item, index) => {

      //first list item from dom data
      let itemDish = item.firstElementChild.firstElementChild.innerText.trim()
      let itemTotal = item.firstElementChild.children[1].innerText.trim()
      //remove white space within itemTotal
      while(itemTotal.includes(' ')){ itemTotal=itemTotal.replace(' ', '')}

      //split up itemtotal
      let itemQuantity = itemTotal.slice(0,itemTotal.indexOf('×'))
      let itemPrice = itemTotal.slice(-(itemTotal.length - itemTotal.indexOf('$') - 1))

      //itemQuantity, itemPrice, itemDish

      //push into array of obj if item
      cart.push( {
        dish:itemDish,
        price:parseInt(itemPrice),
        quantity:parseInt(itemQuantity)
      } )


      if (itemDish === dish) {
        cart[index].quantity = cart[index].quantity+1
      }
      else if( index === cartItems.length - 1 ){
        cart.push({
          dish:dish,
          price:price,
          quantity:1
        })
      }
    })

    // display in the dom
    let subtotal = 0;
    cart.forEach((item, index) => {
          const newItem = document.createElement("li")
          newItem.classList.add('cart_lite_item')
                  newItem.innerHTML = `
                    <div class="cart_item_summary">
                      <a href="product-single.html" class="cart_item_title">${item.dish}</a>
                      <span class="product-price-amount"><span class="quantity">${item.quantity} × </span><span class="product-price-currencySymbol">$</span>${item.price}</span>
                    </div>
                    <a href="#" class="remove_from_cart_button">×</a>
                    `
                  document.querySelector('#cartItems').appendChild(newItem)
        subtotal += item.price * item.quantity
      })
    const subtotalEle = document.querySelector('.subtotal')
    subtotalEle.innerHTML = `<strong>Subtotal: </strong>
                                <span class="product-price-amount">
                                  <span class="product-price-currencySymbo">$</span>
                                  ${subtotal}
                                </span>`;
    addTrashEvent()
  }
  else{
    const newItem = document.createElement("li")
    newItem.classList.add('cart_lite_item')
    newItem.innerHTML = (`
      <div class="cart_item_summary">
        <a href="product-single.html" class="cart_item_title">${dish}</a>
        <span class="product-price-amount"><span class="quantity">${1} × </span><span class="product-price-currencySymbol">$</span>${price}</span>
      </div>
      <a href="#" class="remove_from_cart_button">×</a>
      `)
    // console.log(Array.from(document.querySelector('#cartItems').appendChild(newItem)).length);
    document.querySelector('#cartItems').appendChild(newItem)

    const subtotalEle = document.querySelector('.subtotal')
    subtotalEle.innerHTML = `<strong>Subtotal: </strong>
                              <span class="product-price-amount">
                                <span class="product-price-currencySymbo">$</span>
                                ${price}
                              </span>`;
    addTrashEvent()
  }
}

let carts = document.querySelectorAll('.block-img')
// adding event to cart on dish on restaurant page
Array.from(carts).forEach((cart, i) => {
  cart.addEventListener('click', (e)=>{

    if (e.target.classList.contains('fa-shopping-basket')) {
        addToCart(e.currentTarget.nextElementSibling.firstElementChild.firstElementChild.innerText.trim(),
          e.currentTarget.firstElementChild.nextElementSibling.childNodes[1].innerText.trim()
        );
    }
  })
});

/* 
=== Requirements ===

[x] Replicate design: 
    https://www.figma.com/file/Hdgwo69Dym9vVsxbuPbl0h/Mobile-Restaurant-Menu?node-id=0%3A1
[x] Render menu options using JS
[x] Add / remove items
[x] Payment modal with compulsory form inputs

=== Stretch goals ===

* Change theme
* Offer a discount
* Allow users to rate experience

*/

import {menuArray} from './data.js'


let orderArray = []

document.addEventListener("click", function(e){
    if (e.target.classList.contains('menu-item__btn')) {    
        addToOrder(e.target.dataset.itemname, e.target.dataset.itemprice, e.target.dataset.itemid)
    } 
    else if (e.target.classList.contains('button-link')){
        removeItem(e.target.dataset.itemid)
    } 
    else if (e.target.id === "cc-modal" || e.target.id === "submit-order" || e.target.id === "cc-modal-close"){
        document.getElementById("cc-modal").classList.toggle("hidden")
    }
    else if (e.target.id === "submit-payment"){
        const thisForm = document.getElementById("cc-form")
        if (thisForm.checkValidity()) {
            e.preventDefault()
            document.getElementById("cc-modal").classList.toggle("hidden")
            //disable order buttons
            const buttons = document.querySelectorAll(".menu-item__btn")
            buttons.forEach(function(item){item.disabled = true})
            //show success msg
            const customerName = document.getElementById("customer-name")
            document.getElementById("checkout").innerHTML = `<div class="success-msg">Thanks, ${customerName.value}! Your order is on its way!</div>`
        }
    }
    
})

function renderPage() {
    const menuContainer = document.getElementById('menu')
    menuArray.forEach(function(item){
    menuContainer.innerHTML += `
    <article class="menu-item">
                <div class="menu-item__details">
                    <span class="menu-item__emoji">${item.emoji}</span>
                    <div>
                        <h2 class="menu-item__title">${item.name}</h2>
                        <p class="menu-item__ingredients">${item.ingredients}</p>
                        <p class="menu-item__price">$${item.price}</p>
                    </div>
                </div>
                <button class="menu-item__btn" title="Add to order" data-itemid="${item.id}" data-itemprice="${item.price}" data-itemname="${item.name}">+</button>
            </article>`
    })
}


function addToOrder(name, price, id){
    //check if item already in order
    const matchingItem = orderArray.filter(function(item){
            return item.id.includes(id)
    })[0]
    if (matchingItem) { 
        const newPrice = Number(matchingItem.price) + Number(price)
        matchingItem.price = newPrice
        matchingItem.quantity += 1
    } else {
         orderArray.push({
            "name": name,
            "price": price,
            "id": id,
            "quantity": 1,
        })  
    }
    renderOrder()
}

function renderOrder() {
    const checkoutArea = document.getElementById('checkout-list')
    const checkoutPrice = document.getElementById('checkout-price')
    let checkoutTotal = 0
    let checkoutList
    if (orderArray.length > 0) {
        checkoutArea.innerHTML = `<ul class="checkout-list"></ul>`
        checkoutList = document.querySelector("ul.checkout-list")
    } else {
        checkoutArea.innerHTML = ''
    }
    orderArray.forEach(function(item){
        checkoutList.innerHTML += `
        <li class="checkout-item">
            <span>${item.name} (${item.quantity})
                <button class="button-link" data-itemid="${item.id}">remove</button>
            </span>
            <span class="checkout-price">$${item.price} </span>
        </li>   
      `
        checkoutTotal += Number(item.price)
    })
    checkoutPrice.textContent = "$" + checkoutTotal
}

function removeItem(itemid) {
    orderArray = orderArray.filter(function(item){
        return !item.id.includes(itemid)
    })
    renderOrder()
}

renderPage()

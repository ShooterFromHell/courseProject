let LIST_OF_ITEMSBAR_IN_ORDER = 'list-of-itemsbar-in-order'
let MAX_COUNT = 9

function ItemInSideBar_draw(obj) {

    draw()

    function draw() {
        let asideItem = null
        if (isExistItemInAside()) {
            asideItem = updateAsideItem()
        } else {
            asideItem = createAsideItem()
            document.getElementById(LIST_OF_ITEMSBAR_IN_ORDER).insertAdjacentHTML("beforeend", asideItem);
        }
    }

    function isExistItemInAside() {
        let asideItem = document.querySelector(`[data-item-id="${obj.itemId}"][aside-bar-item]`)
        if (asideItem)
            return true
        else
            return false
    }

    function updateAsideItem() {
        let asideItem = document.querySelector(`[data-item-id="${obj.itemId}"][aside-bar-item]`)
        asideItem.setAttribute('data-cart-quantity', obj.cartQuantity)
        asideItem.querySelector('.summary').innerHTML = getSummary()
        asideItem.querySelector('.bar-item-sum strong').innerHTML = getBarItemSum()
    }

    function getSummary() {
        return `(${obj.cartQuantity} шт * ${obj.price} грн)`
    }

    function getBarItemSum() {
        return `${obj.cartQuantity * obj.price}<small> грн</small>`
    }

    function createAsideItem() {
        return `
      <li class="book-bar-item book-stripe" data-item-id="${obj.itemId}" data-price="${obj.price}" data-description="${obj.description}" data-final-price-in-cents="${obj.finalPriceInCents}" data-head-office-item-code="${obj.headOfficeItemCode}" data-cart-quantity="${obj.cartQuantity}" aside-bar-item>
        <div>
            <img class="bar-item-img" src="https://dc1-vweb2-win12.multiplex.ua/CDN/media/entity/get/ItemGraphic/${obj.itemId}?allowPlaceHolder=true&width=200">
        </div>
        <div class="bar-item-title">${obj.description}<br>
          <span class="summary">${getSummary()}</span>
        </div>
        <div class="bar-item-sum"><strong>${getBarItemSum()}</strong></div>
        ${getCrissCross()}
      </li>	    
    `
    }

    function getCrissCross() {
        return page === 'concession'
            ? `
          <a class="book-ticket-remove" cart-cons-remove>
              <svg class="icon">
                  <use xlink:href="#close"></use>
              </svg>
          </a>      
        `
            : ''
    }
}

function getAttrOfConsItem($el, modal = '') {
    let e = $el.closest(`${modal} [data-item-id]`)
    return {
        itemId: e.dataset.itemId,
        headOfficeItemCode: e.dataset.headOfficeItemCode,
        voucherBarcode: '',
        price: +e.dataset.price,
        finalPriceInCents: +e.dataset.finalPriceInCents,
        description: e.dataset.description,
        cartQuantity: +e.getAttribute(`data-cart-quantity`)
    }
}

function processBookConcession() {
    sendWebRequest(getCartCons())
        .then(data => {
            if (checkBtnNextAvailable()) {
                window.location.pathname = data.url
            }
        })
        .catch(data => {
            showModalFullScreen(data)
        })
}

function getAllConsInCart() {
    return document.querySelectorAll(`[data-item-id][aside-bar-item]`)
}

function getCartCons() {
    let data = {
        concessions: []
    }

    let cartCons = getAllConsInCart()
    cartCons.forEach(el => {
        let obj = getAttrOfConsItem(el)
        data.concessions.push({
            "quantity": obj.cartQuantity,
            "itemId": obj.itemId,
            "headOfficeItemCode": obj.headOfficeItemCode,
        })
    })
    return data
}

function getAllObjectsAttrAside() {
    let allCons = []
    let cartCons = getAllConsInCart()
    cartCons.forEach(el => allCons.push(getAttrOfConsItem(el)))
    return allCons
}

function getCartConsSum() {
    let sum = 0
    getAllObjectsAttrAside().forEach(el => sum += el.price * el.cartQuantity)
    return sum
}

function getCartConsQty() {
    let sum = 0
    getAllObjectsAttrAside().forEach(el => sum += el.cartQuantity)
    return sum
}

function setQtyById_inMainCons(itemId, qty, modal = '') {
    let quantity = 'data-count'
    let barItem = document.querySelector(`${modal} .concession-items [data-item-id="${itemId}"]`)
    barItem.setAttribute('data-cart-quantity', qty)
    barItem.querySelector(`[${quantity}]`).setAttribute(`${quantity}`, qty)
}

function isCanAddConsToCart(obj) {
    let allObjectsAttrAside = getAllObjectsAttrAside()
    let itemInCart = allObjectsAttrAside.find(el => el.itemId === obj.itemId)
    if (itemInCart) {
        if (!isAllowMoreConcession_itemCount(obj)) {
            return false
        }
    } else {
        if (!isAllowMoreConcession_thisSize(getAllObjectsAttrAside().length)) {
            return false
        }
    }
    return true


    function isAllowMoreConcession_thisSize(quantity) {
        let d_id = Date.now()
        let message_id = `count-concession-more-than-allow-size-${d_id}`
        let message = `Максимальна кількіть одиниць продкції ${quantity} од.`
        return showCountRestrict(message_id, message, quantity)
    }

    function isAllowMoreConcession_itemCount(obj) {
        let d_id = Date.now()
        let message_id = `count-concession-more-than-allow-item-count-${d_id}`
        let message = `Максимальна кількість однієї позиції "${obj.description}" ${obj.cartQuantity} од.`
        return showCountRestrict(message_id, message, obj.cartQuantity)
    }

    function showCountRestrict(message_id, message, quantity) {
        let TIMEOUT_SHOW_MESSAGE = 3000
        if (quantity + 1 > MAX_COUNT) {
            if (!document.getElementById(message_id)) {

                document.getElementById(`aside-info-concession-messages`)
                    .insertAdjacentHTML("afterbegin", `<li id="${message_id}" style="color:red;">${message}</li>`);

                setTimeout(
                    function () {
                        let element = document.getElementById(message_id)
                        if (element) {
                            // console.log('Find ', message_id);
                            // console.trace();
                            element.remove();
                        } else {
                            // console.log('Can not find ', message_id);
                            // console.trace();
                        }
                    },
                    TIMEOUT_SHOW_MESSAGE
                )

            }
            return false
        }
        return true
    }
}

document.body.addEventListener('click', e => {

    if (e.target.closest('[btn-plus]')) {
        let obj = getAttrOfConsItem(e.target)
        if (isCanAddConsToCart(obj)) {
            let qty = ++obj.cartQuantity
            setQtyById_inMainCons(obj.itemId, qty)
            ItemInSideBar_draw(obj)
            redrawingSumAndCountInAside()
            enableBtnNext()
        }
    }

    if (e.target.closest('[btn-minus]')) {
        let obj = getAttrOfConsItem(e.target)
        let qty = --obj.cartQuantity
        if (qty < 0) qty = 0
        setQtyById_inMainCons(obj.itemId, qty)

        if (qty > 0) {
            ItemInSideBar_draw(obj)
        } else {
            let asideItem = document.querySelector(`[data-item-id="${obj.itemId}"][aside-bar-item]`)
            if (asideItem) {
                asideItem.remove()
            }
        }

        redrawingSumAndCountInAside()
        checkBtnNextAvailable()
    }

    if (e.target.closest('[btn-minus-additional]')) {
        let obj = getAttrOfConsItem(e.target)
        let qty = --obj.cartQuantity
        if (qty < 0) qty = 0
        setQtyById_inMainCons(obj.itemId, qty, '[modal]')
    }

    if (e.target.closest('[btn-plus-additional]')) {
        let obj = getAttrOfConsItem(e.target)
        if (obj.cartQuantity < MAX_COUNT) {
            let qty = ++obj.cartQuantity
            setQtyById_inMainCons(obj.itemId, qty, '[modal]')
        }
    }

    if (e.target.closest('[cart-cons-remove]')) {
        let asideBarItem = e.target.closest(`[aside-bar-item]`)
        if (asideBarItem) {
            let itemId = asideBarItem.getAttribute('data-item-id')
            asideBarItem.remove()
            setQtyById_inMainCons(itemId, 0)
            redrawingSumAndCountInAside()
            checkBtnNextAvailable()
        }
    }

    // хендлер модального вікна додавання 3Д окурів
    if (e.target.closest('[add-additional-to-order]')) {
        let modal = e.target.closest('[modal]')
        let listOfAdditionalBarItems = modal.querySelectorAll('.bar-item')
        listOfAdditionalBarItems.forEach(barItem => {
            let obj = getAttrOfConsItem(barItem, '[modal]')
            if (+obj.cartQuantity > 0) {
                // let qty = ++obj.cartQuantity
                ItemInSideBar_draw(obj)
                setQtyById_inMainCons(obj.itemId, obj.cartQuantity)
            }
        })
        modal.classList.add('hide')
        redrawingSumAndCountInAside()
        checkBtnNextAvailable()
    }
})


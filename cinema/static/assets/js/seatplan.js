/* TICKET_STATUS_ATTR                                             */
/* 0 - Місце вільне                                               */
/* 1 - Місце занято/придбано                                      */
/* 2 - HOUSE. Використовується як соціальна дистанція             */
/* 3 - WHEELCHAIR (місце для осіб з обмеженими можливостями)      */
/* 4 - RESERVED (заброньовано)                                    */
/* 5 - BROKEN                                                     */
/* 6 - PLACEHOLDER                                                */
/* 7 - COMPANION                                                  */
let TICKET_STATUS = {
    FREE: "0",
    SELECTED: "1",
    SOCIAL_DISTANCE: "2"
}

let ticketStatusAllowBooking = [TICKET_STATUS.FREE]

// TICKETS ATTRIBUTS
let SEATS_IN_GROUP_ATTR = "data-seats-in-group"
let TICKET_TYPE_ATTR = "data-ticket-type"
let TICKET_TYPE_CODE_ATTR = "data-ticket-type-code"
let TICKET_STATUS_ATTR = "data-status"
let TICKET_STATUS_POUF_ATTR = "data-status-pouf"
let TICKET_STATUS_USER_SESSION_ATTR = "data-status-user-session"
let TICKET_STATUS_USER_SESSION_BC_ATTR = "data-status-user-session-before-clear"
let TICKET_ROW_ATTR = "data-row-physical-name"
let TICKET_PLACE_ATTR = "data-place-id"
let TICKET_PRICE_ATTR = "data-price"
let TICKET_FINAL_PRICE_ATTR = "data-final-price"
let TICKET_AREA_CATEGORY_CODE_ATTR = "data-area-category-code"
let TICKET_AREA_NUMBER_ATTR = "data-area-number"
let TICKET_ROW_INDEX_ATTR = "data-row-index"
let TICKET_COLUMN_INDEX_ATTR = "data-column-index"
let TICKET_SEAT_SEQUENCE_NUMBER_ATTR = "data-seat-sequence-number"

let TICKET_DATA_TIPPY_ATTR = 'data-tippy'

let TICKET_ON_SCHEME = "js-seat-screen"
let TICKET_IN_CART = "ticket-in-cart"

// TICKETS ATTRIBUTS

let MAX_COUNT_TICKET = 9
let TIMEOUT_SHOW_MESSAGE = 3000

// Кількість місць між білетами які можна замоляти


function paintTicketInSideBar(ticketAttr) {

    // малюємо вибраний білет в сайдбарі
    document.getElementById("list-of-tickets-in-order").insertAdjacentHTML("beforeend", getNewTicketInRightSideBar(ticketAttr));

    function getNewTicketInRightSideBar(ticketAttr) {
        return `
      <li 
        class="${ticketAttr.ticketType}" 
        ${TICKET_AREA_NUMBER_ATTR}="${ticketAttr.areaNumber}" 
        ${TICKET_ROW_INDEX_ATTR}="${ticketAttr.rowIndex}" 
        ${TICKET_COLUMN_INDEX_ATTR}="${ticketAttr.columnIndex}"
        ${TICKET_PRICE_ATTR}="${ticketAttr.price}"
        ${TICKET_FINAL_PRICE_ATTR}="${ticketAttr.price}"
        ${TICKET_TYPE_CODE_ATTR}="${ticketAttr.ticketTypeCode}"
        ${TICKET_PLACE_ATTR}="${ticketAttr.place}"
        ${TICKET_ROW_ATTR}="${ticketAttr.row}"
        data-barcode
        data-voucher-area-category-code
        ${TICKET_IN_CART}
      >
          ${IsPoufSession ? getPoufHeaderSeat() : getStandartHeaderSeat()}
          ${getSectionBarcodeAndAbonnement(ticketAttr)}
      </li>       
    `

        function getStandartHeaderSeat() {
            return `
        <div class="book-ticket">
          <div class="book-ticket-row">${ticketAttr.row} ряд</div>
          <div class="book-ticket-place">
            <span>${ticketAttr.place} місце</span><span class="text-secondary">${ticketAttr.ticketType}</span>
          </div>
          <div class="book-ticket-price">
              <strong>${ticketAttr.price}<small> ${CurrencyType}</small></strong>
          </div>
          ${getCrissCross()}
        </div>   
      `
        }

        function getPoufHeaderSeat() {
            return `
        <div class="book-ticket book-ticket--pouf">
          <div class"seat-name">Пуф</div>
          <div class="book-ticket-price">
              <strong>${ticketAttr.price}<small> ${CurrencyType}</small></strong>
          </div>
          ${getCrissCross()}
        </div>   
      `
        }

        function getCrissCross() {
            return page === 'seatplan' ? getCrissCrossRemoveTicket() : ''
        }
    }

    function isShowAbonnement(ticketAttr) {
        return false;

        // return (
        //         'abonnementInfo'  in ticketAttr &&
        //         'available'       in ticketAttr.abonnementInfo
        //         )
        //   ? ticketAttr.abonnementInfo.available
        //   : false
    }

    // isShowBarcodeInput передається з бека
    function getSectionBarcodeAndAbonnement(ticketAttr) {
        return `
        <div class="additional-options">
            ${isShowBarcodeInput ? getSectionBarCode() : ''} 
            ${isShowAbonnement(ticketAttr) ? getToggleAbonement() : ''}
        </div>
    `
    }

    function getSectionBarCode() {
        let maxLength = -1;
        let disabled = page !== 'seatplan' ? 'disabled' : ''
        return page === 'seatplan'
            ? `
        <section class="barcode" section-barcode>
      </section>    
    `
            : ''
    }

    function getToggleAbonement() {
        let id = new Date().getTime()
        let disabled = page !== 'seatplan' ? 'disabled' : ''
        return `
          <section class="slider-checkbox" abonnement>
              <input type="checkbox" id="abon_${id}" ${disabled} abon-toggle>
              <label class="label" for="abon_${id}"><small class="abonnement-text">Абонемент</small></label>
          </section>    
    `
    }

    function getCrissCrossRemoveTicket() {
        return `
        <a class="book-ticket-remove" cart-ticket-remove>
            <svg class="icon">
                <use xlink:href="#close"></use>
            </svg>
        </a>     
    `
    }
}

function getSeatOnSchemeByAPR({areaNumber, place, row}) {
    return document.querySelector(
        `[${TICKET_ON_SCHEME}]` +
        `[${TICKET_AREA_NUMBER_ATTR}="${areaNumber}"]` +
        `[${TICKET_PLACE_ATTR}="${place}"]` +
        `[${TICKET_ROW_ATTR}="${row}"]`
    )
}

function getSeatAttrByCartTicket(ticketInCart) {
    return getSeatAttr(getSeatOnSchemeByARC(
        {
            areaNumber: ticketInCart.getAttribute(TICKET_AREA_NUMBER_ATTR).toString(),
            columnIndex: ticketInCart.getAttribute(TICKET_COLUMN_INDEX_ATTR).toString(),
            rowIndex: ticketInCart.getAttribute(TICKET_ROW_INDEX_ATTR).toString(),
        }
    ))
}

function processBookTickets() {
    sendWebRequest(getTicketsCart())
        .then(data => {
            if (data.error) {
                showModalFullScreen(data.error)
            } else {
                window.location.pathname = data.url
            }
        })
        .catch(data => {
            showModalFullScreen(data)
        })
}

// Pouf

function getFirstFreeSeat() {
    let allFreePoufs = getAllFreePoufs()
    if (allFreePoufs > 0) {
        return allFreePoufs[0]
    } else {
        return undefined
    }
}

function getAllFreePoufs() {
    return document.querySelectorAll(`[${TICKET_ON_SCHEME}][${TICKET_STATUS_POUF_ATTR}="${TICKET_STATUS.FREE}"]`)
}

function getSeatByFirstTicketInCart() {
    let ticketAside = document.querySelector(`[${TICKET_IN_CART}]`)
    if (ticketAside) {
        return getSeatOnSchemeByARC({
            areaNumber: ticketAside.getAttribute(TICKET_AREA_NUMBER_ATTR).toString(),
            columnIndex: ticketAside.getAttribute(TICKET_ROW_INDEX_ATTR).toString(),
            rowIndex: ticketAside.getAttribute(TICKET_COLUMN_INDEX_ATTR).toString()
        })
    }
    return null
}

function setPoufData() {
    let poufItem = document.querySelector('[data-item-id="pouf-item"]')
    if (poufItem) {
        document.querySelector("[data-free-ticket-count]").innerHTML = getAllFreePoufs().length
        poufItem.querySelector("[data-count]").setAttribute("data-count", getCartTicketQty())
        setCircleDasharray()
    }
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
    let accupiedSeats = getAllFreePoufs().length
    let totalSeats = document.querySelectorAll(`[${TICKET_ON_SCHEME}]`).length
    let lengthRing = accupiedSeats * 283 / totalSeats

    const circleDasharray = `${(lengthRing).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

// Pouf

function initSeatPlan() {
    setPoufData()

    document.querySelector('body').addEventListener("click", e => {

        // Клікнуте крісло на схемі залу
        if (e.target.hasAttribute(TICKET_ON_SCHEME)) {
            e.stopPropagation()
            changeSeatStatusInCart(e.target)
        }
        // Клікнуте крісло на схемі залу

        if (e.target.closest('[btn-plus-pouf]')) {
            e.stopPropagation()
            changeSeatStatusInCart(getFirstFreeSeat())
        }
        if (e.target.closest('[btn-minus-pouf]')) {
            e.stopPropagation()
            changeSeatStatusInCart(getSeatByFirstTicketInCart())
        }

        if (e.target.closest('[cart-ticket-remove]')) {
            e.stopPropagation()
            removeFromCartByAsideClick(e.target)
        }

        if (e.target.closest('[btn-check-barcode]')) {
            applyBarcode(e.target)
        }

        redrawingSumAndCountInAside()
    })

    document.querySelector('body').addEventListener("input", e => {
        if (e.target.closest('[input-barcode]')) {
            let ticketInCart = e.target.closest(`[${TICKET_IN_CART}]`)
            ticketInCart.setAttribute('data-barcode', e.target.value)
        }
    })

    document.querySelector('body').addEventListener("change", e => {
        if (e.target.closest('[abon-toggle]')) {
            registerEventApplyAbonement(e.target)

            function registerEventApplyAbonement($a_toggle) {

                let ticketInCart = $a_toggle.closest(`[${TICKET_IN_CART}]`)
                let ticketAttr = getSeatAttrByCartTicket(ticketInCart)

                if (ticketAttr.abonnementInfo.available) {
                    let $barcode = ticketInCart.querySelector('[section-barcode]')
                    let $price = ticketInCart.querySelector(`.book-ticket-price strong`)

                    // зміна моделі
                    if ($a_toggle.checked) {
                        ticketInCart.setAttribute(TICKET_FINAL_PRICE_ATTR, ticketAttr.abonnementInfo.ticket.price)
                        ticketInCart.setAttribute(TICKET_TYPE_CODE_ATTR, ticketAttr.abonnementInfo.ticket.type_code)
                        // ховаємо поле для введення баркода
                        $barcode.classList.add('hide')
                    } else {
                        ticketInCart.setAttribute(TICKET_FINAL_PRICE_ATTR, ticketAttr.price)
                        ticketInCart.setAttribute(TICKET_TYPE_CODE_ATTR, ticketAttr.default.ticketTypeCode)
                        // показуємо поле для введення баркода
                        $barcode.classList.remove('hide')
                    }
                    // перемальовування
                    $price.innerHTML = ticketInCart.getAttribute(TICKET_FINAL_PRICE_ATTR) + `<small> ${CurrencyType}</small>`
                    redrawingSumAndCountInAside()
                }

            }

        }
    })

}

window.addEventListener('load', initSeatPlan)


function applyBarcode($btnCheckBarcode) {
    // hide abonemetn toggle
    let ticketInCart = $btnCheckBarcode.closest(`[${TICKET_IN_CART}]`)
    let $abon = ticketInCart.querySelector('[abonnement]')
    if ($abon) {
        $abon.querySelector('[abonnement]').classList.add('hide')
    }
    // hide abonemetn toggle

    let ticketTypeCode = ticketInCart.getAttribute(TICKET_TYPE_CODE_ATTR)
    let voucherBarcode = ticketInCart.getAttribute('data-barcode')

    let body = {ticketTypeCode, voucherBarcode}
    let uri = `/cart/${getUserSessionId()}/voucher`

    sendWebRequest(body, uri)
        .then(resp => {
            if (resp.valid) {
                ticketInCart.setAttribute(TICKET_TYPE_CODE_ATTR, resp.ticketTypeCode)
                ticketInCart.setAttribute('data-barcode', resp.voucherBarcode)
                ticketInCart.setAttribute('data-voucher-area-category-code', resp.voucherAreaCategoryCode)
                ticketInCart.setAttribute(TICKET_FINAL_PRICE_ATTR, 0)

                ticketInCart.querySelector(`[btn-check-barcode]`).classList.remove('fail');
                ticketInCart.querySelector(`[btn-check-barcode]`).classList.add('apply');
                ticketInCart.querySelector(`[btn-check-barcode]`).innerHTML = '&#10004;'

                ticketInCart.querySelector(`.book-ticket-price strong`).innerHTML = `0<small> ${CurrencyType}</small>`
                redrawingSumAndCountInAside()
            } else {
                ticketInCart.querySelector(`[btn-check-barcode]`).innerHTML = '!'
                ticketInCart.querySelector(`[btn-check-barcode]`).classList.remove('apply');
                ticketInCart.querySelector(`[btn-check-barcode]`).classList.add('fail');
            }

            if (resp.error) {
                showModalFullScreen(resp.error)
            }
        })
}


function getTicketInCartByARC(opt) {
    let $tic = document.querySelector(``
        + `[${TICKET_IN_CART}]`
        + `[${TICKET_AREA_NUMBER_ATTR}="${opt.areaNumber}"]`
        + `[${TICKET_ROW_INDEX_ATTR}="${opt.rowIndex}"]`
        + `[${TICKET_COLUMN_INDEX_ATTR}="${opt.columnIndex}"]`
    )
    return $tic
}


function isAllowBooking($seat, statusAttr) {
    if (ticketStatusAllowBooking.includes($seat.getAttribute(statusAttr).toString()))
        return true
    return false
}

/**
 * Функція визначає чи потрібно перевіряти ряд на обмеження соціальної дистанції.
 * Якщо місце "SUPER LUX" - ігноруємо перевірку.
 * Якщо SocialDistanceRequired = true - ігноруємо перевірку.
 * @param {*} $seat - місце по якому клікнув користувач.
 * @param {*} $isAddingTicket - true якщо квиток добавляється, false - якщо видаляється.
 *  Повертаємо false якщо клікнуте місце не дозволяється додати в корзину.
 *  Повертаємо true - місце можна дадати в корзину.
 */
function getIsAllowtSocialDistance($seat, isAddingTicket = false) {
    let isHasSuperLux = $seat.classList.value.toUpperCase().includes("SUPER LUX")
    let isHasLOUNGE = $seat.classList.value.toUpperCase().includes("LOUNGE")
    if (
        !IsCARSession
        && !IsPoufSession
        && !isHasLOUNGE
        && !isHasSuperLux
        && SocialDistanceRequired
    ) {

        if (isAddingTicket) {
            if (!isAllowBooking($seat, TICKET_STATUS_USER_SESSION_ATTR)) return false
        }

        // prepare rowSetting param
        let rowSetting = {
            $seat,
            MAX_SEAT_ALONGSIDE: 4,
            SOCIAL_DISTANCE_SPACE: 1
        }
        let row = +$seat.getAttribute(TICKET_ROW_ATTR)
        if (row > 4) rowSetting.MAX_SEAT_ALONGSIDE = 2
        // prepare rowSetting param

        // checking
        if (!(isAllowtSocialDistance(rowSetting, isAddingTicket)))
            return false
    }

    return true
}

function changeSeatStatusInCart($seat) {
    if ($seat) {
        let ticketAttr = getSeatAttr($seat)
        let ticInCart = getTicketInCartByARC(ticketAttr)
        if (ticInCart) {
            removeFromCartBySeatClick($seat)
        } else {
            if (isCanAddTicketToCart($seat)) {
                paintTicketInSideBar(ticketAttr)
                $seat.classList.add('selected')
                $seat.setAttribute(TICKET_STATUS_POUF_ATTR, TICKET_STATUS.SELECTED)
                $seat.setAttribute(TICKET_STATUS_USER_SESSION_ATTR, TICKET_STATUS.SELECTED)
            }
        }
    }

    checkBtnNextByBookedTicketsInCart()


    function isCanAddTicketToCart($seat) {
        if (!isAllowBooking($seat, TICKET_STATUS_ATTR)) return false
        if (!isAvailableAddTicket()) return false
        if (!getIsAllowtSocialDistance($seat, true)) return false

        return true


        /**
         * Перевірка на перевищення кількості білетів, що можна додати в замовлення
         */
        function isAvailableAddTicket() {
            if (getCartTicketQty() + 1 > MAX_COUNT_TICKET) {
                showRestrictCountMessage()
                return false
            } else {
                return true
            }
        }

        /**
         * Якщо кількість замовлених білетів більше ніж MAX_COUNT_TICKET, - в правоому сайдбарі над списком білетів відображається повілдомлення
         * Зникає через TIMEOUT_SHOW_MESSAGE
         * Якщо перше повідомдення ще не зникло, - друге не добавляємо
         */
        function showRestrictCountMessage() {
            let message_id = `count-more-than-allow`
            if (!document.getElementById(message_id)) {
                document.getElementById("list-of-tickets-in-order")
                    .insertAdjacentHTML("afterbegin", `<li id="${message_id}" class="restrict-count">Кількість білетів не може бути більше ${getCartTicketQty()} шт.</li>`);
                setTimeout(
                    function () {
                        document.getElementById(message_id).remove()
                    },
                    TIMEOUT_SHOW_MESSAGE
                )
            }
        }

    }

}

function removeFromCartByAsideClick(e) {
    let ticketInCart = e.closest(`[${TICKET_IN_CART}]`)
    if (ticketInCart) {
        let $seat = getSeatOnSchemeByARC({
            areaNumber: ticketInCart.getAttribute(TICKET_AREA_NUMBER_ATTR).toString(),
            columnIndex: ticketInCart.getAttribute(TICKET_COLUMN_INDEX_ATTR).toString(),
            rowIndex: ticketInCart.getAttribute(TICKET_ROW_INDEX_ATTR).toString(),
        })
        ticketInCart.remove()
        removeFromCartCommon($seat)
    }
}

function removeFromCartBySeatClick($seat) {
    let ticketInCart = getTicketInCartByARC(getSeatAttr($seat))
    if (ticketInCart) {
        ticketInCart.remove()
    }
    removeFromCartCommon($seat)
}

function removeFromCartCommon($seat) {
    if ($seat) {
        $seat.closest(`[${TICKET_ON_SCHEME}]`).classList.remove('selected')
        $seat.setAttribute(TICKET_STATUS_ATTR, TICKET_STATUS.FREE)
        $seat.setAttribute(TICKET_STATUS_POUF_ATTR, TICKET_STATUS.FREE)
        $seat.setAttribute(TICKET_STATUS_USER_SESSION_ATTR, TICKET_STATUS.FREE)
    }

    getIsAllowtSocialDistance($seat)
    checkBtnNextByBookedTicketsInCart()
}

function getSeatAttr($seat) {
    let areaNumber = $seat.getAttribute(TICKET_AREA_NUMBER_ATTR).toString()
    let rowIndex = $seat.getAttribute(TICKET_ROW_INDEX_ATTR).toString()
    let columnIndex = $seat.getAttribute(TICKET_COLUMN_INDEX_ATTR).toString()
    let price = $seat.getAttribute(TICKET_PRICE_ATTR).toString()
    let ticketType = $seat.getAttribute(TICKET_TYPE_ATTR).toString()
    let ticketTypeCode = $seat.getAttribute(TICKET_TYPE_CODE_ATTR).toString()
    let areaCategoryCode = $seat.getAttribute(TICKET_AREA_CATEGORY_CODE_ATTR).toString()
    let seatSequenceNumber = $seat.getAttribute(TICKET_SEAT_SEQUENCE_NUMBER_ATTR).toString()
    let status = $seat.getAttribute(TICKET_STATUS_ATTR).toString()
    let statusPouf = $seat.getAttribute(TICKET_STATUS_POUF_ATTR)
    let statusUserSession = $seat.getAttribute(TICKET_STATUS_USER_SESSION_ATTR).toString()
    let place = $seat.getAttribute(TICKET_PLACE_ATTR).toString()
    let row = $seat.getAttribute(TICKET_ROW_ATTR).toString()

    let ticketAttr = {
        ticketType,
        ticketTypeCode,
        areaCategoryCode,
        status,
        statusPouf,
        statusUserSession,
        place,
        row,
        price,
        default: {
            price,
            ticketTypeCode,
        },
        areaNumber,
        rowIndex,
        columnIndex,
        seatSequenceNumber,
        seats: JSON.parse($seat.getAttribute(SEATS_IN_GROUP_ATTR)),
        abonnementInfo: JSON.parse($seat.dataset.abonnementInfo),
    }

    return ticketAttr
}

function getSeatOnSchemeByARC(opt) {
    return document.querySelector(
        `[${TICKET_ON_SCHEME}]` +
        `[${TICKET_AREA_NUMBER_ATTR}="${opt.areaNumber}"]` +
        `[${TICKET_COLUMN_INDEX_ATTR}="${opt.columnIndex}"]` +
        `[${TICKET_ROW_INDEX_ATTR}="${opt.rowIndex}"]`
    )
}


// cart_details
function getCartTicketSum() {
    let sum = 0
    document.querySelectorAll(`[${TICKET_IN_CART}]`)
        .forEach(ticketInCart => sum += +ticketInCart.getAttribute(TICKET_FINAL_PRICE_ATTR))
    return sum
}

function getCartTicketQty() {
    return getAllTicketsInCart().length
}

function getAllTicketsInCart() {
    return document.querySelectorAll(`[${TICKET_IN_CART}]`)
}

function getTicketsCart() {
    let tickets = getAllTicketsInCart()

    let ticketCart = {
        tickets: []
    }

    tickets.forEach(ticketInCart => {
        let seatAttr = getSeatAttrByCartTicket(ticketInCart)
        ticketCart.tickets.push({
            ticketDetails: {
                ticketTypeCode: ticketInCart.getAttribute(TICKET_TYPE_CODE_ATTR),
                voucherBarcode: ticketInCart.getAttribute(`data-barcode`),
                voucherAreaCategoryCode: ticketInCart.getAttribute(`data-voucher-area-category-code`)
            },
            seats: seatAttr.seats,
        })
    })

    return ticketCart
}

// cart_details


function setTootip($seat, tooltip = '') {
    let rowPhysicalName = $seat.getAttribute(TICKET_ROW_ATTR)
    let seatId = $seat.getAttribute(TICKET_PLACE_ATTR)
    let price = $seat.getAttribute(TICKET_PRICE_ATTR)
    if (!tooltip) {
        tooltip = `${rowPhysicalName} Ряд, ${seatId} Місце,\nЦіна: ${price} ${CurrencyType}`
    }
    $seat.setAttribute(TICKET_DATA_TIPPY_ATTR, tooltip)
}

function checkBtnNextByBookedTicketsInCart() {
    let qtyBookedByOher = 0
    getAllTicketsInCart().forEach(ticketInCart => {
        if (ticketInCart.classList.contains(BOOKED)) {
            qtyBookedByOher++
        }
    })

    if (qtyBookedByOher > 0) {
        disableBtnNext()
    } else {
        enableBtnNext()
    }
}


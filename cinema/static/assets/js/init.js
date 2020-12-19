let btnNext = document.getElementById("btn-next");
let allTicketsOnScheme


window.addEventListener('DOMContentLoaded', init)


document.body.addEventListener('click', e => {
    let el = e.target
    if (el.hasAttribute('js-close-modal')) {
        let modal = el.closest('[modal]')
        if (modal) {
            modal.classList.add('hide')
        }
    }
})

function setOnClickBtnNext() {
    switch (page) {
        case 'seatplan':
            btnNext.addEventListener('click', function () {
                processBookTickets()
            })// btnNext.onclick = processBookTickets; // На iOS телефонах не працює
            CreateEvenSource.listen(eventSourceUrl);
            if (typeof IsCARSession !== 'undefined' && IsCARSession) {
                initKinodrom()
            }
            break;
        case 'concession':
            btnNext.addEventListener('click', function () {
                processBookConcession()
            })
            checkBtnNextAvailable();
            break;
        case 'checkout':
            btnNext.addEventListener('click', function () {
                processPaymentData()
            })
            break;
    }
}

function checkBtnNextAvailable() {
    document.querySelector('.btn-next').classList.remove('disabled')
    if (getCartConsQty() === 0 && getCartTicketQty() === 0) {
        document.querySelector('.btn-next').classList.add('disabled')
        return false;
    }
    return true;
}

function enableBtnNext() {
    document.querySelector('.btn-next').classList.remove('disabled')
}

function disableBtnNext() {
    document.querySelector('.btn-next').classList.add('disabled')
}

function showPreloadAnim() {
    let vPreAnim = document.getElementById('preload-anim')
    if (vPreAnim) vPreAnim.style.display = 'block'
}

function hidePreloadAnim() {
    let vPreAnim = document.getElementById('preload-anim')
    if (vPreAnim) vPreAnim.style.display = 'none'
}

function getUserSessionId(path = window.location.pathname) {
    let cartUriName = '/cart/'
    let user_session_id = ''
    if (path.indexOf(cartUriName) === 0) {
        let startSessionId = path.substring(cartUriName.length)
        user_session_id = startSessionId.substring(0, startSessionId.indexOf('/'))
    }
    return user_session_id
}

async function sendWebRequest(body, uri = '', isShowPreload = true) {
    if (isShowPreload) showPreloadAnim()

    let data = {}
    try {
        let postRequest = await fetch(
            uri,
            {
                method: 'POST',             // *GET, POST, PUT, DELETE, etc.
                mode: 'cors',             // no-cors, cors, *same-origin
                cache: 'no-cache',         // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRF,
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                // referrer: 'seatplan', // no-referrer, *client
                body: JSON.stringify(body),
            }
        )

        // console.log(postRequest)
        if (postRequest.ok) {
            data = await postRequest.json()
        } else {
            if (+postRequest.status === 404) {
                showModalFullScreen(postRequest.text)
            }
        }
    } catch (e) {
        // console.error(e)
    } finally {
        if (isShowPreload) hidePreloadAnim()
    }

    return data
}
// chrome.extension.sendMessage({}, function (response) {
//     var readyStateCheckInterval = setInterval(function () {
//         if (document.readyState === "complete") {
//             clearInterval(readyStateCheckInterval);

//             // ----------------------------------------------------------
//             // This part of the script triggers when page is done loading
//             console.log("Hello. This message was sent from scripts/inject.js");
//             // ----------------------------------------------------------

//         }
//     }, 10);
// });

// var readyStateCheckInterval = setInterval(function () {
//     if (document.readyState === "complete") {
//         clearInterval(readyStateCheckInterval);

//     }
// }, 10);

var injectCode = '(' + function() {
    console.log('GPhone Saver injected')
    const proxy = new Proxy(window.WebSocket, {
        construct: function(target, args) {
            console.log('New Websocket!')
            const instance = new target(...args)
            instance.addEventListener('message', onMessage)
            return instance
        }
    })
    window.WebSocket = proxy

    function onMessage(ev) {
        const data = ev.data
        if (typeof data !== 'string') {
            return
        }
        if (data.charAt(0) !== '4') {
            return
        }
        if (data.charAt(1) === '2') { // check if it is a json event packet
            try {
                // check if parsable
                const dataPacket = JSON.parse(data.slice(2))
                // send it then
                emitPacket(dataPacket)
            } catch (err) {}
        }
    }

    function emitPacket(packet) {
        document.dispatchEvent(new CustomEvent('GPhoneAutoSave_packet', {
            detail: packet
        }))
    }
    console.log('GPhone Saver setup finished')
} + ')()'
console.log(injectCode)
var script = document.createElement('script')
script.textContent = injectCode
;(document.head||document.documentElement).appendChild(script)
script.remove()

document.addEventListener('GPhoneAutoSave_packet', (ev) => {
    const packet = ev.detail
    chrome.extension.sendMessage({ type: 'packet', packet })
})




// var observer = new MutationObserver(function(mutationsList) {
//     for(const mutation of mutationsList) {
//         if (mutation.type === 'childList') {
//             if (hasGameReset(mutation.addedNodes)) {
//                 onGameReset()
//             }
//             else if (hasRoundEnded(mutation.addedNodes)) {
//                 onRoundEnd()
//             }
//         }
//     }
// })

// observer.observe(document.body, { childList: true, subtree: true })
// console.log('GPhone extension injected')

// function hasGameReset(nodes) {
//     return Array.from(nodes).some(node => node.classList && (node.classList.contains('lobby') || node.querySelector('.lobby') != null))
// }

// function hasRoundEnded(nodes) {
//     return Array.from(nodes).some(node => node.classList && (node.classList.contains('end') || node.querySelector('.end') != null))
// }

// function onGameReset() {
//     chrome.extension.sendMessage({ type: 'game-reset' })
// }

// function onRoundEnd() {
//     let roundName = getRoundName()
//     let items = getItems()
//     chrome.extension.sendMessage({ 
//         type: 'round-info',
//         round: {
//             name: roundName,
//             items
//         }
//     })
// }

// function getItems() {
//     let items = Array.from(document.querySelectorAll('.scrapbook .timeline .item'))
//     return items.map((item) => {
//         let textBalloon = item.querySelector('.answerBalloon')
//         if (textBalloon) {
//             let balloon = textBalloon.querySelector('.balloon')
//             return {
//                 type: 'text',
//                 answer: balloon.textContent,
//                 user: getNearestSpan(balloon)
//             }
//         }
//         let drawBalloon = item.querySelector('.drawBalloon')
//         if (drawBalloon && !(drawBalloon.firstElementChild?.tagName === 'SECTION')) { // Ignore the new mode's animation result
//             let balloon = drawBalloon.querySelector('.balloon')
//             return {
//                 type: 'drawing',
//                 answer: balloon.querySelector('canvas').toDataURL(),
//                 user: getNearestSpan(balloon)
//             }
//         }
//         return null
//     }).filter(e => e != null)
// }

// function getNearestSpan(element) {
//     let previousElement = element.previousElementSibling
//     let nextElement = element.nextElementSibling

//     let text = null
//     while (previousElement || nextElement) {
//         if (previousElement) {
//             if (previousElement.tagName === 'SPAN') {
//                 text = previousElement.textContent
//                 break
//             }
//             previousElement = previousElement.previousElementSibling
//         }
//         if (nextElement) {
//             if (nextElement.tagName === 'SPAN') {
//                 text = nextElement.textContent
//                 break
//             }
//             nextElement = nextElement.nextElementSibling
//         }
//     }

//     return text
// }

// function getRoundName() {
//     return document.querySelector('.players .user.show .nick').textContent
// }
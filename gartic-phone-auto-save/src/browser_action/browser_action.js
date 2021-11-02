function endSession() {
    chrome.runtime.sendMessage({ type: 'end-session' })
}

document.addEventListener('DOMContentLoaded', () => {
    updateState()

    let endSessionBtn = document.getElementById('end-session-btn')
    endSessionBtn.addEventListener('click', () => endSession())

    endSessionBtn.innerText = chrome.i18n.getMessage('end_session_button')
})

function updateState() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            type: 'get-state'
        }, function (response) {
            let div = document.getElementById('state')
            // div.innerHTML = `<div>Games count: <span id="games-count"></span></div>
            // <div>Game running: <span id="game-running"></span></div>
            // <div>Session running: <span id="session-running"></span></div>`
            // div.querySelector('#game-running').innerText = response.gameRunning
            // div.querySelector('#session-running').innerText = response.sessionRunning
            div.innerHTML = `<div>Games count: <span id="games-count"></span></div>`
            const spanGamesCount = /** @type {HTMLSpanElement} */ (div.querySelector('#games-count'))
            spanGamesCount.innerText = response.gamesCount
            resolve()
        })
    })
}
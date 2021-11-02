// window.addEventListener('DOMContentLoaded', () => {
//     main()
// })

// function main() {
//     garticPhoneDrawer.draw(window.data, document.getElementById('canvas'))
// }

/**
 * 
 * @param {HTMLInputElement} input 
 */
function fileLoad(input) {
    if (!input.files.length) {
        return
    }
    const file = input.files[0]
    const fr = new FileReader()
    fr.addEventListener('load', () => {
        let container = document.body.querySelector('#games-container')
        if (!container) {
            container = document.createElement('div')
            container.id = 'games-container'
            document.body.appendChild(container)
        }
        container.innerHTML = ''
        const result = /** @type {string} */ (fr.result)
        const gamesData = JSON.parse(result)
        console.log('Games', gamesData)
        for (let i = 0; i < gamesData.length; i++) {
            const game = gamesData[i]
            const gameContainer = document.createElement('div')
            container.appendChild(gameContainer)
            gameContainer.innerHTML =
                `<div class="game-container">
                    <h1>Game ${i + 1}</h1>
                    <div data-elem="container"></div>
                </div>`
            const gameTemplate = gameContainer.querySelector('[data-elem="container"]')
            for (let j = 0; j < game.length; j++) {
                const book = game[j]
                console.log(book)
                const bookContainer = document.createElement('div')
                gameTemplate.appendChild(bookContainer)
                bookContainer.innerHTML =
                    `<div class="book-container">
                        <h2>Book of <span data-elem="book-name"></span></h2>
                        <div data-elem="timeline"></div>
                        <div class="download-buttons">
                            <button data-elem="download-btn">Download</button>
                            <button data-elem="download-anim-btn">Download animation</button>
                        </div>
                    </div>`
                const bookName = /** @type {HTMLSpanElement} */(bookContainer.querySelector('[data-elem="book-name"]'))
                bookName.innerText = book.bookAuthor.nick
                const timelineContainer = /** @type {HTMLDivElement} */(bookContainer.querySelector('[data-elem="timeline"]'))
                timelineContainer.style.display = 'none'
                const downloadBtn = /** @type {HTMLSpanElement} */(bookContainer.querySelector('[data-elem="download-btn"]'))
                downloadBtn.addEventListener('click', () => {
                    generateTimelineGif(book.timeline)
                })
                const downloadAnimBtn = /** @type {HTMLSpanElement} */(bookContainer.querySelector('[data-elem="download-anim-btn"]'))
                downloadAnimBtn.addEventListener('click', () => {
                    generateAnimationGif(book.timeline)
                })
                bookName.parentElement.addEventListener('click', () => {
                    if (timelineContainer.style.display === 'none') {
                        timelineContainer.style.display = ''
                    } else {
                        timelineContainer.style.display = 'none'
                    }
                })
                for (let k = 0; k < book.timeline.length; k++) {
                    const response = book.timeline[k]
                    if (response == null) {
                        continue
                    }
                    const responseContainer = document.createElement('div')
                    timelineContainer.appendChild(responseContainer)
                    responseContainer.innerHTML =
                        `<div class="response">
                            <div class="response-username" data-elem="username"></div>
                            <div class="response-data" data-elem="response-data"></div>
                        </div>`
                    ;/** @type {HTMLDivElement} */(responseContainer.querySelector('[data-elem="username"]')).innerText = response.user.nick
                    const dataContainer = /** @type {HTMLDivElement} */(responseContainer.querySelector('[data-elem="response-data"]'))
                    if (typeof response.data === 'string') {
                        dataContainer.classList.add('text-data')
                        dataContainer.innerText = response.data
                    } else {
                        const canvas = document.createElement('canvas')
                        dataContainer.appendChild(canvas)
                        // @ts-ignore
                        garticPhoneDrawer.draw(response.data, canvas, { scale: 2 })
                    }
                }
            }
        }

        // document.body.appendChild(drawTimelineFrame(gamesData[0][0].timeline[0], { frameNumber: 0, framesCount: 2 }))
    })
    fr.readAsText(file)
    input.value = ''
}

function generateTimelineGif(timeline) {
    // @ts-ignore
    const gif = new GIF({
        quality: 1,
        repeat: 0
    })

    const frameDuration = + /** @type {HTMLInputElement} */(document.querySelector('#frame-duration')).value
    for (let i = 0; i < timeline.length; i++) {
        const frame = drawTimelineFrame(timeline[i], {
            frameNumber: i,
            framesCount: timeline.length
        })
        gif.addFrame(frame, { delay: frameDuration })
    }
    gif.on('finished', function(blob) {
        const url = URL.createObjectURL(blob)
        window.open(url)
        URL.revokeObjectURL(url)
    })
    gif.render()
}

function generateAnimationGif(timeline) {
    // @ts-ignore
    const gif = new GIF({
        quality: 1,
        repeat: 0
    })

    const mode = /** @type {HTMLInputElement} */(document.querySelector('[name="repeat-mode"]:checked')).value
    const frameDuration = + /** @type {HTMLInputElement} */(document.querySelector('#animation-frame-duration')).value
    const stopDuration = + /** @type {HTMLInputElement} */(document.querySelector('#animation-stop-duration')).value
    for (let i = 0; i < timeline.length; i++) {
        if (!timeline[i].data || typeof timeline[i].data === 'string') {
            continue
        }
        const tmpFrame = document.createElement('canvas')
        // @ts-ignore
        garticPhoneDrawer.draw(timeline[i].data, tmpFrame, { background: '#fff' })
        const frame = document.createElement('canvas')
        frame.width = tmpFrame.width
        frame.height = tmpFrame.height
        const ctx = frame.getContext('2d')
        ctx.drawImage(tmpFrame, 0, 0, frame.width, frame.height)
        gif.addFrame(frame, { delay: !isLastFrame(i, timeline, false) ? frameDuration : (stopDuration + frameDuration) })
    }
    if (mode === 'boomerang') {
        for (let i = timeline.length - 2; i >= 0; i--) {
            if (!timeline[i].data || typeof timeline[i].data === 'string') {
                continue
            }
            const tmpFrame = document.createElement('canvas')
            // @ts-ignore
            garticPhoneDrawer.draw(timeline[i].data, tmpFrame, { background: '#fff' })
            const frame = document.createElement('canvas')
            frame.width = tmpFrame.width
            frame.height = tmpFrame.height
            const ctx = frame.getContext('2d')
            ctx.drawImage(tmpFrame, 0, 0, frame.width, frame.height)
            gif.addFrame(frame, { delay: !isLastFrame(i, timeline, true) ? frameDuration : (stopDuration + frameDuration) })
        }
    }
    gif.on('finished', function(blob) {
        const url = URL.createObjectURL(blob)
        window.open(url)
        URL.revokeObjectURL(url)
    })
    gif.render()

    function isLastFrame(frameNumber, timeline, reverse) {
        if (!reverse) {
            if (frameNumber === timeline.length - 1) {
                return true
            }
            for (let i = timeline.length - 1; i >= 0; i--) {
                if (!timeline[i].data || typeof timeline[i].data === 'string') {
                    continue
                }
                return i === frameNumber
            }
            return false
        } else {
            if (frameNumber === 0) {
                return true
            }
            for (let i = 0; i < timeline.length; i++) {
                if (!timeline[i].data || typeof timeline[i].data === 'string') {
                    continue
                }
                return i === frameNumber
            }
            return false
        }
    }
}

/**
 * 
 * @param {any} timelineFrame 
 * @param {{ frameNumber: number, framesCount: number }} options 
 */
function drawTimelineFrame(timelineFrame, options) {
    const canvas = document.createElement('canvas')
    const width = 1080
    const height = 720
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#4100AD'
    ctx.fillRect(0, 0, width, height)

    if (typeof timelineFrame.data === 'string') {
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#371b57'
        ctx.lineWidth = height * 0.02
        const textXPadding = width * 0.05
        const textYPadding = width * 0.1
        const textHeight = height * 0.6
        //ctx.fillRect(textXPadding, textYPadding, width - textXPadding * 2, textHeight)
        ctx.font = `bold ${height * 0.2}px sans-serif`
        drawCenteredTextMultiline(ctx, textXPadding, textYPadding, width - textXPadding * 2, textHeight, height * 0.02, timelineFrame.data)
    } else {
        const drawingCanvas = document.createElement('canvas')
        // @ts-ignore
        garticPhoneDrawer.draw(timelineFrame.data, drawingCanvas, { scale: 2 })
        const canvasXPadding = width * 0.05
        const canvasYPadding = width * 0.05
        const canvasHeight = height * 0.8
        ctx.fillStyle = '#fff'
        ctx.fillRect(canvasXPadding, canvasYPadding, width - canvasXPadding * 2, canvasHeight)
        ctx.drawImage(drawingCanvas,
            0, 0, drawingCanvas.width, drawingCanvas.height,
            canvasXPadding, canvasYPadding, width - canvasXPadding * 2, canvasHeight)
    }

    const framePadding = width * 0.01
    const frameWidth = (width + framePadding) / options.framesCount - framePadding * options.framesCount
    const frameHeight = height * 0.01
    for (let i = 0; i < options.framesCount; i++) {
        if (i <= options.frameNumber) {
            ctx.fillStyle = '#fff'
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        }
        ctx.fillRect(framePadding + (frameWidth + framePadding) * i, height - framePadding - frameHeight, frameWidth, frameHeight)
    }

    ctx.font = `bold ${height * 0.04}px sans-serif`
    ctx.fillStyle = '#fff'
    const nickMeasurements = ctx.measureText(timelineFrame.user.nick)
    ctx.fillText(timelineFrame.user.nick, width - framePadding - nickMeasurements.width, height - framePadding * 2 - frameHeight)

    return canvas
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 * @param {number} linePadding 
 * @param {string} text 
 */
function drawCenteredTextMultiline(ctx, x, y, w, h, linePadding, text) {
    const lines = [[]]
    const words = text.split(' ')
    for (let i = 0; i < words.length; i++) {
        if (lines[lines.length - 1].length === 0) {
            lines[lines.length - 1].push(words[i])
            continue
        }
        const line = lines[lines.length - 1].reduce((a, b) => a + ' ' + b) + (lines[lines.length - 1].length > 1 ? ' ' : '') + words[i]
        const measurements = ctx.measureText(line)
        if (measurements.width <= w) {
            lines[lines.length - 1].push(words[i])
            continue
        } else {
            lines.push([words[i]])
            continue
        }
    }
    const finalLines = lines.map(line => {
        const lineText = line.reduce((a, b) => a + ' ' + b)
        const measurements = ctx.measureText(lineText)
        return {
            height: measurements.actualBoundingBoxAscent + measurements.actualBoundingBoxDescent + linePadding,
            width: measurements.width,
            text: lineText
        }
    })

    const linesTotalHeight = finalLines.reduce((a, line) => a + line.height, -linePadding)
    let width = 0

    let currentHeight = finalLines[0]?.height ?? 0
    for (let i = 0; i < finalLines.length; i++) {
        const drawY = y + h / 2 - (linesTotalHeight / 2) + currentHeight

        ctx.strokeText(finalLines[i].text, x + w / 2 - finalLines[i].width / 2, drawY, w)
        ctx.fillText(finalLines[i].text, x + w / 2 - finalLines[i].width / 2, drawY, w)

        currentHeight += finalLines[i].height
        width = Math.max(width, finalLines[i].width)
    }

    return {
        width: width,
        height: linesTotalHeight
    }
}
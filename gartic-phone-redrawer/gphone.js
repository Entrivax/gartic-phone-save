(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.garticPhoneDrawer = {}));
    }
}(typeof self !== 'undefined' ? self : this, function (exports) {

    /**
     * @param {any[]} data Gartic Phone drawing data for one drawing
     * @param {HTMLCanvasElement} canvas Canvas on which to draw (will set its size)
     * @param {{scale?: number, background?: string}} [options]
     */
    function draw(data, canvas, options) {
        const finalOptions = Object.assign({
            scale: 1
        }, options)
        const width = 758 * finalOptions.scale
        const height = 424 * finalOptions.scale
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (finalOptions.background) {
            ctx.fillStyle = finalOptions.background
            ctx.strokeStyle = ''
            ctx.fillRect(0, 0, width, height)
        }
        for (let i = 0; i < data.length; i++) {
            drawStep(data[i], canvas, ctx, finalOptions)
        }
    }
    
    /**
     * @param {any[]} stepData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function drawStep(stepData, canvas, ctx, options) {
        switch (stepData[0]) {
            case 1:
                drawPen(stepData, canvas, ctx, options)
                break
            case 2:
                erasePen(stepData, canvas, ctx, options)
                break
            case 3:
                drawLine(stepData, canvas, ctx, options)
                break
            case 4:
                drawRect(stepData, canvas, ctx, options)
                break
            case 5:
                drawCircle(stepData, canvas, ctx, options)
                break
            case 6:
                drawFillRect(stepData, canvas, ctx, options)
                break
            case 7:
                drawFillCircle(stepData, canvas, ctx, options)
                break
            case 8:
                drawFill(stepData, canvas, ctx, options)
                break
        }
    }
    
    /**
     * @param {any[]} penData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function drawPen(penData, canvas, ctx, options) {
        ctx.fillStyle = 'transparent'
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineCap = 'round'
        ctx.strokeStyle = penData[2][0]
        ctx.lineWidth = +penData[2][1] * options.scale
        ctx.globalAlpha = +penData[2][2]
        ctx.beginPath()
        ctx.moveTo(penData[3][0] * options.scale, penData[3][1] * options.scale)
        for (let i = 4; i < penData.length; i++) {
            ctx.lineTo(penData[i][0] * options.scale, penData[i][1] * options.scale)
        }
        ctx.stroke()
    }
    
    /**
     * @param {any[]} lineData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function drawLine(lineData, canvas, ctx, options) {
        ctx.fillStyle = 'transparent'
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineCap = 'round'
        ctx.strokeStyle = lineData[2][0]
        ctx.lineWidth = +lineData[2][1] * options.scale
        ctx.globalAlpha = +lineData[2][2]
        ctx.beginPath()
        ctx.moveTo(lineData[3][0] * options.scale, lineData[3][1] * options.scale)
        ctx.lineTo(lineData[4][0] * options.scale, lineData[4][1] * options.scale)
        ctx.stroke()
    }
    
    /**
     * @param {any[]} penData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function erasePen(penData, canvas, ctx, options) {
        ctx.fillStyle = 'transparent'
        ctx.globalCompositeOperation = 'destination-out'
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = +penData[2] * options.scale
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.moveTo(penData[3][0] * options.scale, penData[3][1] * options.scale)
        for (let i = 4; i < penData.length; i++) {
            ctx.lineTo(penData[i][0] * options.scale, penData[i][1] * options.scale)
        }
        ctx.stroke()
    }
    
    /**
     * @param {any[]} rectData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function drawRect(rectData, canvas, ctx, options) {
        ctx.fillStyle = 'transparent'
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineCap = 'round'
        ctx.strokeStyle = rectData[2][0]
        ctx.lineWidth = +rectData[2][1] * options.scale
        ctx.globalAlpha = +rectData[2][2]
        ctx.beginPath()
        const x = rectData[3][0] * options.scale
        const y = rectData[3][1] * options.scale
        ctx.rect(
            x, y,
            rectData[4][0] * options.scale - x, rectData[4][1] * options.scale - y
        )
        ctx.stroke()
    }
    
    /**
     * @param {any[]} fillData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function drawFill(fillData, canvas, ctx, options) {
        ctx.strokeStyle = 'transparent'
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineCap = 'round'
        ctx.fillStyle = fillData[2][0]
        ctx.globalAlpha = +fillData[2][1]
        ctx.beginPath()
        for (let i = 3; i < fillData.length; i += 4) {
            const x = fillData[i + 0] * options.scale
            const y = fillData[i + 1] * options.scale
            ctx.rect(
                x, y,
                fillData[i + 2] * options.scale, fillData[i + 3] * options.scale
            )
        }
        ctx.fill()
    }
    
    /**
     * @param {any[]} circleData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function drawCircle(circleData, canvas, ctx, options) {
        ctx.fillStyle = 'transparent'
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineCap = 'round'
        ctx.strokeStyle = circleData[2][0]
        ctx.lineWidth = +circleData[2][1] * options.scale
        ctx.globalAlpha = +circleData[2][2]
        ctx.beginPath()
        const x1 = circleData[3][0] * options.scale
        const y1 = circleData[3][1] * options.scale
        const x2 = circleData[4][0] * options.scale
        const y2 = circleData[4][1] * options.scale
        ctx.ellipse((x1 + x2) * 0.5, (y1 + y2) * 0.5, (x2 - x1) * 0.5, (y2 - y1) * 0.5, 0, 0, 2 * Math.PI)
        ctx.stroke()
    }
    
    /**
     * @param {any[]} rectData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function drawFillRect(rectData, canvas, ctx, options) {
        ctx.strokeStyle = 'transparent'
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineCap = 'round'
        ctx.fillStyle = rectData[2][0]
        ctx.lineWidth = 0
        ctx.globalAlpha = +rectData[2][2]
        ctx.beginPath()
        const x = rectData[3][0] * options.scale
        const y = rectData[3][1] * options.scale
        ctx.rect(
            x, y,
            rectData[4][0] * options.scale - x, rectData[4][1] * options.scale - y
        )
        ctx.fill()
    }
    
    /**
     * @param {any[]} circleData 
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{scale: number}} options 
     */
    function drawFillCircle(circleData, canvas, ctx, options) {
        ctx.strokeStyle = 'transparent'
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineCap = 'round'
        ctx.lineWidth = 0
        ctx.fillStyle = circleData[2][0]
        ctx.globalAlpha = +circleData[2][2]
        ctx.beginPath()
        const x1 = circleData[3][0] * options.scale
        const y1 = circleData[3][1] * options.scale
        const x2 = circleData[4][0] * options.scale
        const y2 = circleData[4][1] * options.scale
        ctx.ellipse((x1 + x2) * 0.5, (y1 + y2) * 0.5, (x2 - x1) * 0.5, (y2 - y1) * 0.5, 0, 0, 2 * Math.PI)
        ctx.fill()
    }

    exports.draw = draw
}));
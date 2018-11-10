const w : number = window.innerWidth, h : number = window.innerHeight
const nodes : number = 5
const lines : number = 4
class BoxDiagStepStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#BDBDBD'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : BoxDiagStepStage = new BoxDiagStepStage()
        stage.render()
        stage.initCanvas()
        stage.handleTap()
    }
}

const divideScale : Function = (scale : number , i : number, n : number) : number => Math.min(1/n, Math.max(0, scale - i * (1 / n))) * n

const getScaleFactor : Function = (scale : number) : number => Math.floor(scale / 0.5)

const updateScale : Function = (scale : number, dir : number) : number => {
    const k : number = getScaleFactor(scale)
    return 0.05 * dir * ((1 - k) / lines + k)
}

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += updateScale(this.scale, this.dir)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb(this.prevScale)
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

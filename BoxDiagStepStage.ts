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

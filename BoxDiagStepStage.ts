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

const drawBDSNode : Function = (context : CanvasRenderingContext2D, i, scale) => {
     const gap : number = w / (nodes + 1)
     const sc1 : number = divideScale(scale, 0, 2)
     const sc2 : number = divideScale(scale, 1, 2)
     const size : number = gap / 3
     context.strokeStyle = '#01579B'
     context.lineCap = 'round'
     context.lineWidth = Math.min(w, h) / 60
     const degGap : number = (2 * Math.PI) / lines
     context.save()
     context.translate(gap * (i + 1), h/2)
     context.rotate(sc2 * Math.PI)
     context.strokeRect(-size, -size, 2 * size, 2 * size)
     for (var j = 0; j < lines; j++) {
        const sc : number = divideScale(sc1, i, lines)
        context.save()
        context.rotate(degGap * j)
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(size * sc, size * sc)
        context.stroke()
        context.restore()
     }
     context.restore()
}

class BDSNode {
    state : State = new State()
    prev : BDSNode
    next : BDSNode

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new BDSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        drawBDSNode(context, this.i, this.state.scale)
        this.next.draw(context)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) {
        var curr : BDSNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class BoxDiagStep {

    root : BDSNode = new BDSNode(0)
    curr : BDSNode = this.root
    dir : number = 1
    
    draw(context : CanvasRenderingContext2D) {
        this.root.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}

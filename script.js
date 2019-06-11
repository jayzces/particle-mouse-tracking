const canvas = document.querySelector('#canvas'),
    ctx = canvas.getContext('2d'),
    config = {
        maxParticles: 2,
        maxRadius: 10,
        maxDistance: 100,
        speed: 60
    }

let particles = []

const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

const randomColor = () => {
    let n = Math.round(Math.random() * (280 - 200 + 1)) + 200
    return `hsl(${n}, 100%, 50%)`
}

// return positive/negative distance from n
const randomPosition = n => {
    let pos = Math.round(Math.random() * config.maxDistance),
        control = Math.round(Math.random()) * 2 - 1 // -1 or 1
    return control > 0 ? n + pos : n - pos
}

const requestAnimationFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60)
        }
})()

const animate = () => {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let newArray = []
    for (let i = 0; i < particles.length; i++) {
        if (!particles[i].done) {
            particles[i].update()
            newArray.push(particles[i])
        }
    }

    particles = newArray
}

const drawParticles = e => {
    let nParticles = Math.round(Math.random() * config.maxParticles) + 1
    for (let i = 0; i < nParticles; i++) {
        let p = new Particle(e.clientX, e.clientY)
        particles.push(p)
    }
}

class Particle {
    constructor(x, y) {
        /*
        * p*   particle properties
        * c*   current properties, will be iterated on
        * inc* increments/decrements
        */
        this.x = x
        this.y = y
        this.pX = randomPosition(x)
        this.pY = randomPosition(y)
        this.pRadius = Math.round(Math.random() * config.maxRadius) + 1
        this.pColor = randomColor()
        this.cX = x
        this.cY = y
        this.cRadius = this.pRadius
        this.incX = Math.abs(x - this.pX) / config.speed
        this.incY = Math.abs(y - this.pY) / config.speed
        this.incRadius = this.pRadius / config.speed
        this.done = false

        if (x > this.pX) this.incX *= -1
        if (y > this.pY) this.incY *= -1
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.cX, this.cY, this.cRadius, 0, Math.PI * 2)
        ctx.fillStyle = this.pColor
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.cX += this.incX
        this.cY += this.incY
        this.cRadius = this.cRadius > this.incRadius ? this.cRadius - this.incRadius : 0
        this.draw()

        if (this.cX >= Math.max(this.x, this.pX) ||
            this.cY >= Math.max(this.y, this.pY) ||
            this.cRadius <= 0) {
            this.done = true
        }
    }
}

animate()
resizeCanvas()
window.addEventListener('resize', resizeCanvas, false)
canvas.addEventListener('mousemove', drawParticles)
canvas.addEventListener('click', drawParticles)
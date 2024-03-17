

export default class WaterTexture {
    constructor(options) {
        this.maxAge = 64;
        this.points = [];
        this.radius = this.size * 0.1;
        this.size = 64;
        this.width = this.height = this.size;

        if (options.debug) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.radius = this.width * 0.05;
        }

        this.initTexture();

        if (options.debug) {
            document.body.append(this.canvas);
        }
    }

    addPoint(point) {
        this.points.push({ x: point.x, y: point.y, age: 0 });
    }

    clear() {
        this.ctx.fillStyle = '#1e1a20';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPoint(point) {
        // Convert normalized position into canvas coordinates
        let pos = {
            x: point.x * this.width,
            y: point.y * this.height
        }
        const radius = this.radius;

        let intensity = 1.0 - point.age / this.maxAge;

        let color = '255,255,255';
        let offset = this.width * 5.0;
        this.ctx.shadowOffsetX = offset;
        this.ctx.shadowOffsetY = offset;
        this.ctx.shadowBlur = radius * 1;
        this.ctx.shadowColor = `rgba(${color}, ${0.2 * intensity})`;

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,0,0,1)";
        this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    initTexture() {
        this.canvas = document.querySelector('canvas.webgl');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.clear();
    }

    update() {
        this.clear();
        this.points.forEach((point, index) => {
            point.age += 1;

            if (point.age > this.maxAge) {
                this.points.splice(index, 1);
            } else {
                this.drawPoint(point);
            }
        });
    }
}
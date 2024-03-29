

import * as THREE from "three";

function easeOutQuad(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
}

function easeOutSine(t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}

export default class WaterTexture {
    constructor(options) {
        this.last = null;
        this.maxAge = 64;
        this.points = [];
        this.radius = this.size * 0.1;
        this.size = 64;
        this.width = this.height = this.size;

        if (options.debug) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.radius = this.width * 0.1;
        }

        this.initTexture();

        if (options.debug) {
            document.body.append(this.canvas);
        }
    }

    addPoint(point) {
        let force = 0;
        let vx = 0;
        let vy = 0;
        const last = this.last;

        if (last) {
            const diffX = point.x - last.x;
            const diffY = point.y - last.y;

            const distanceSquared = diffX * diffX + diffY * diffY;
            const distance = Math.sqrt(distanceSquared);

            vx = diffX / distance;
            vy = diffY / distance;

            force = Math.min(distanceSquared * 10000, 1);
        }

        this.last = {
            x: point.x,
            y: point.y
        };

        this.points.push({
            x: point.x,
            y: point.y,
            age: 0,
            force: force,
            vx: vx,
            vy: vy,
        });
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
        };

        const radius = this.radius;
        let intensity = 1;

        if (point.age < this.maxAge * 0.3) {
            intensity = easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
        } else {
            intensity = easeOutQuad(
                1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7),
                0,
                1,
                1
            );
        }

        intensity *= point.force;

        let red = ((point.vx + 1) / 2) * 255;
        let green = ((point.vy + 1) / 2) * 255;
        let blue = intensity * 255;
        let color = `${red}, ${green}, ${blue}`;

        let offset = this.width * 5;
        // 1. Give the shadow a high offset.
        this.ctx.shadowOffsetX = offset;
        this.ctx.shadowOffsetY = offset;
        this.ctx.shadowBlur = radius * 1;
        this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,0,0,1)";
        // 2. Move the circle to the other direction of the offset
        this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    initTexture() {
        this.canvas = document.querySelector('canvas.webgl');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.texture = new THREE.Texture(this.canvas);
        this.clear();
    }

    update() {
        this.clear();
        let agePart = 1.0 / this.maxAge;

        this.points.forEach((point, index) => {
            point.age++;

            if (point.age > this.maxAge) {
                this.points.splice(index, 1);
            } else {
                let slowAsOlder = 1.0 - point.age / this.maxAge;
                let force = point.force * agePart * slowAsOlder;

                point.x += point.vx * force;
                point.y += point.vy * force;

                this.drawPoint(point);
            }
        });

        this.texture.needsUpdate = true;
    }
}
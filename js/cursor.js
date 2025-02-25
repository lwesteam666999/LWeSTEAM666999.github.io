var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;
let RENDER_INTERVAL = 50;
let lastRender = 0;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = { curr: null, prev: null };
        this.pt = [];
        this.rafId = null;
        this.moveHandler = null;
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style.transform = `translate(${left}px, ${top}px)`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        const elements = document.getElementsByTagName('*');
        this.pt = Array.from(elements)
            .filter(el => getStyle(el, "cursor") === "pointer")
            .map(el => el.outerHTML);

        this.scr = document.createElement("style");
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
        document.body.appendChild(this.scr);
    }

    init() {
        this.moveHandler = throttle(e => {
            if (!this.pos.curr) {
                this.move(e.clientX - 8, e.clientY - 8);
            }
            this.pos.curr = { x: e.clientX - 8, y: e.clientY - 8 };
            this.cursor.classList.remove("hidden");
        }, 50);

        document.onmousemove = this.moveHandler.bind(this);
        document.onmouseover = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmouseenter = () => this.cursor.classList.remove("hidden");
        document.onmouseleave = () => this.cursor.classList.add("hidden");
        document.onmousedown = () => this.cursor.classList.add("active");
        document.onmouseup = () => this.cursor.classList.remove("active");
    }

    render(timestamp) {
        if (timestamp - lastRender >= RENDER_INTERVAL) {
            if (this.pos.prev) {
                this.pos.prev.x += (this.pos.curr.x - this.pos.prev.x) * 0.3;
                this.pos.prev.y += (this.pos.curr.y - this.pos.prev.y) * 0.3;
                this.move(this.pos.prev.x, this.pos.prev.y);
            } else {
                this.pos.prev = { ...this.pos.curr };
            }
            lastRender = timestamp;
        }
        this.rafId = requestAnimationFrame(ts => this.render(ts));
    }

    destroy() {
        cancelAnimationFrame(this.rafId);
        document.onmousemove = null;
    }
}

const throttle = (func, limit) => {
    let lastFunc, lastRan;
    return function(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

(() => {
    CURSOR = new Cursor();
})();

document.addEventListener('fps-low', () => {
    RENDER_INTERVAL = Math.min(RENDER_INTERVAL + 50, 200);
});
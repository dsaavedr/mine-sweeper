class Cell extends Rect {
    constructor({
        pos,
        size,
        stroke = false,
        fill = true,
        fillColor = "white",
        mine = false,
        strokeColor = "black",
        count = 0,
        show = false
    }) {
        super({ pos, size, stroke, fill, fillColor, strokeColor });

        this.mine = mine;
        this.count = count;
        this.show = show;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        ctx.save();
        if (this.fill) {
            ctx.fillStyle = this.show ? (this.mine ? "red" : "green") : this.fillColor;
            ctx.fill();
        }
        if (this.stroke) {
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        }
        if (this.show && !this.mine && this.count > 0) {
            ctx.font = "16px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(this.count, this.pos.x + 10, this.pos.y + 20);
        }
        ctx.restore();
        ctx.closePath();
    }

    changeShow() {
        this.show = !this.show;
    }
}

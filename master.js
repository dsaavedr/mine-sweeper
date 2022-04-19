let WIDTH,
    HEIGHT,
    cells = [];

const GRID_X = 10,
    GRID_Y = 10,
    N = GRID_X * GRID_Y,
    CELL_SIZE = 40,
    MINE_PROB = 0.15;

const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

canvas.addEventListener("click", e => {
    // Obtain top corner of clicked cell
    const x = floor(e.offsetX / CELL_SIZE) * CELL_SIZE;
    const y = floor(e.offsetY / CELL_SIZE) * CELL_SIZE;

    for (const c of cells) {
        if (c.pos.x == x && c.pos.y == y) {
            c.changeShow();
            ani();
            break;
        }
    }
});

function init() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.setAttribute("width", CELL_SIZE * GRID_X);
    canvas.setAttribute("height", CELL_SIZE * GRID_Y);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let i = 0; i < GRID_X; i++) {
        for (let j = 0; j < GRID_Y; j++) {
            const mine = random() < MINE_PROB;
            const cell = new Cell({
                pos: new Vector(CELL_SIZE * j, CELL_SIZE * i),
                size: CELL_SIZE,
                stroke: true,
                mine,
                fillColor: "#c0c0c0",
                show: true,
                strokeColor: "white"
            });

            cells.push(cell);
        }
    }

    // Each cell counts the number of mines it's next to
    for (const c of cells) {
        if (c.mine) continue;
        let count = 0;

        // Get x and y
        const x = c.pos.x / CELL_SIZE;
        const y = c.pos.y / CELL_SIZE;

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const newX = x + i;
                const newY = y + j;
                if (newX < 0 || newX > GRID_X - 1 || newY < 0 || newY > GRID_Y - 1) continue;
                const idx = IX(newX, newY, GRID_X);

                if (cells[idx]?.mine) count++;
            }
        }

        c.count = count;
    }

    ani();
}

function ani() {
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (const cell of cells) {
        cell.draw();
    }

    //requestAnimationFrame(ani);
}

init();

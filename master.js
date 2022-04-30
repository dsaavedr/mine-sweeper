let WIDTH,
    HEIGHT,
    cells = [];

const GRID_X = 20,
    GRID_Y = 20,
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

    let target;

    for (const c of cells) {
        if (c.pos.x == x && c.pos.y == y) {
            target = c;
            if (target.show) return;
            if (target.mine) {
                init();
            }
            target.changeShow();
            ani();
            break;
        }
    }

    if (target.count == 0 && !target.mine) {
        showEmptyNeighbors(target);
    }
});

const showEmptyNeighbors = c => {
    const x = c.pos.x / CELL_SIZE;
    const y = c.pos.y / CELL_SIZE;

    const pairs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    // Evaluate only x and y axis neighbors
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const newX = x + i;
            const newY = y + j;
            if (
                newX < 0 ||
                newX > GRID_X - 1 ||
                newY < 0 ||
                newY > GRID_Y - 1 ||
                (i == 0 && j == 0)
            )
                continue;
            const idx = IX(newX, newY, GRID_X);

            const neighbor = cells[idx];

            // If neighbor is shown, is mine or has count > 0, do nothing
            if (neighbor.show || neighbor.mine) continue;

            // If neighbor has count > 0, show it, else, only show if in x or y axis
            if (neighbor.count > 0) {
                neighbor.changeShow();
                continue;
            }

            if (pairs.some(el => arraysEqual([i, j], el))) {
                neighbor.changeShow();
                showEmptyNeighbors(neighbor);
            }
        }
    }

    ani();
};

function init() {
    resetGlobalState();

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
                show: false,
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
}

function resetGlobalState() {
    cells = [];
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

init();

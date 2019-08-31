class Renderer {
    constructor(canvas, text_output, width = 800, height = 600, scale = 20) {
        this.game = Game.with_dimensions(Math.floor(width / scale), Math.floor(height / scale));

        this.canvas = canvas;

        this.height = height;
        this.width = width;

        this.canvas.height = height
        this.canvas.width = width

        this.context = this.canvas.getContext('2d')


        this.directions = []
        this.scale = scale

        this.info_board = text_output
        this.raf = null;
        this.start_time = null;
        this.seconds_passed = -1;
    }

    handlePress(e) {
        if (GameInputs.is_valid(e.code)) {
            this.directions.push(GameInputs.translate(e.code))
        }
    }

    advance(r, f, nr, nf) {
        if (!this.game.is_on) {
            this.clear_screen();
            this.displaytext('Game Over!')
            window.cancelAnimationFrame(this.raf);
            return;
        }

        let next = (this.directions.length === 0) ? this.game.snake.orientation : this.directions.shift();
        this.game = this.game.play(next);


        if (r) { this.game = this.game.add_rock }
        if (nr) { this.game = this.game.remove_food }

        if (f) { this.game = this.game.add_food }
        if (nf) { this.game = this.game.remove_rock }
    }

    displaytext(text) {
        this.info_board.innerHTML = text;
    }

    clear_screen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    paint() {
        const make_point = point => {
            const p = new Path2D();
            p.rect(point.x * this.scale, point.y * this.scale, this.scale, this.scale)
            return p
        }

        const range = length => Array.from(new Array(length))

        this.context.save();
        this.clear_screen();

        const snake = this.game.snake.segments.map(segments => segments.points.map(point => make_point(point))).flat();
        const rocks = this.game.garden.rocks.map(rock => make_point(rock));
        const foods = this.game.garden.foods.map(food => make_point(food));
        const wall = [
            range(0, this.width).map((_, i) => make_point(i, 1)),
            range(0, this.width).map((_, i) => make_point(i, this.height - 1)),
            range(0, this.height).map((_, i) => make_point(1, i)),
            range(0, this.height).map((_, i) => make_point(this.width - 1, i)),
        ].flat();

        [{ points: snake, name: GameObjects.snake },
        { points: rocks, name: GameObjects.rock },
        { points: foods, name: GameObjects.food },
        { points: wall, name: GameObjects.wall },
        ].forEach(({ points, name }) => {
            this.context.fillStyle = GameColors.scheme(name);

            points.forEach(point => this.context.fill(point))
        })

        this.context.restore();

        this.displaytext(`Score:\n ${this.game.score}`)
    }

    static get fps() {
        return 15;
    }

    static get frame_rate() {
        return 1000 / Renderer.fps;
    }

    draw_frame(t) {
        if (!this.start_time) {
            this.start_time = t;
        }

        const seconds = time => Math.floor((time - this.start_time) / 1000);
        const timeout = s => seconds(t) % s === 0;

        let [r, f, nr, nf] = Array.from(new Array(4)).fill(false);

        if (seconds(t) > this.seconds_passed) {
            [r, f, nr, nf] = [timeout(11), timeout(9), timeout(13), timeout(11)];
            this.seconds_passed = seconds(t);
        }

        window.setTimeout(() => {
            this.advance(r, f, nr, nf);
            this.paint();
            this.raf = window.requestAnimationFrame(t => this.draw_frame(t))
        }, Renderer.frame_rate)
    }
}

class GameInputs {
    static get UP() { return 'ArrowUp' }
    static get DOWN() { return 'ArrowDown' }
    static get LEFT() { return 'ArrowLeft' }
    static get RIGHT() { return 'ArrowRight' }

    static get valid_inputs() {
        return [GameInputs.UP, GameInputs.DOWN, GameInputs.LEFT, GameInputs.RIGHT]
    }

    static is_valid(keycode) {
        return GameInputs.valid_inputs.includes(keycode)
    }

    static translate(input) {
        switch (input) {
            case GameInputs.UP: return Direction.DOWN;
            case GameInputs.DOWN: return Direction.UP;
            case GameInputs.LEFT: return Direction.LEFT;
            case GameInputs.RIGHT: return Direction.RIGHT;
        }
    }
}

class GameObjects {
    static get snake() { return 'snake' }
    static get rock() { return 'rock' }
    static get food() { return 'food' }
    static get wall() { return 'wall' }
}

class GameColors {
    static get black() { return 'black' }
    static get red() { return 'red' }
    static get green() { return 'green' }
    static get grey() { return 'gray' }

    static scheme(game_object) {
        switch (game_object) {
            case GameObjects.food: return GameColors.green;
            case GameObjects.rock: return GameColors.red;
            case GameObjects.snake: return GameColors.black;
            case GameObjects.wall: return GameColors.grey;
        }
    }
}


window.onload = function () {

    let started = false;

    document.addEventListener('keydown', e => {
        if (e.code == 'Space') {
            const garden = document.getElementById('garden');
            const info = document.getElementById('info');
            const instructions = document.getElementById('instructions');

            const { width, heigth } = garden.getBoundingClientRect();
            const renderer = new Renderer(garden, info, width, heigth)
            if (!started) {
                instructions.style.display = 'none';
                renderer.raf = window.requestAnimationFrame(t => renderer.draw_frame(t));
                started = true;
            }

            document.addEventListener("keydown", e => renderer.handlePress(e));
        }
    })


}


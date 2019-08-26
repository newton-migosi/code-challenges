class Renderer {
    constructor(canvas, text_output, width=800, height=600, scale=10) {
        this.game = Game.with_dimensions(Math.floor(width/scale), Math.floor(height/scale));
        
        this.canvas = canvas;
        
        this.canvas.height = height
        this.canvas.width = width
        
        if(this.canvas.getContext) {
            this.context = this.canvas.getContext('2d')
        } else {
            throw new Error("Unsupported feature")
        }
        
        this.directions = []
        this.scale = scale

        this.info_board = text_output
    }

    static translate(key) {
        switch(key) {
            case 'ArrowUP' : return Direction.UP;
            case 'ArrowDown' : return Direction.DOWN;
            case 'ArrowLeft': return Direction.LEFT;
            case 'ArrowRight': return Direction.RIGHT;
        }
    }

    handlePress(e) {
        const matches = key => ['ArrowUP', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].some(k => k === key);

        if (matches(e.code)) {
            this.directions.push(translate(e.code))
        }
    }

    advance() {
        while(True) {
            if(!game.is_on) {
                return;
            }
    
            if(directions.length == 0) {
                this.game = game.play(game.snake.orientation);
            }
    
            this.game = game.play(directions.shift());
        }
    }

    drawPoint(point, type) {
        const colors = {
            'snake': 'black', 
            'rock': 'red',
            'food': 'green'
        }

        this.context.fillStyle = colors[type];

        this.context.fillRect(
            point.x * this.scale, point.y * this.scale, this.scale, this.scale
        )
    }

    displaytext(text) {
        this.info_board.innerHTML = text;
    }

    paint() {
        this.game.snake.segments.forEach(segments => segments.points.forEach(point => this.drawPoint(point, 'snake')));
        this.game.garden.rocks.forEach(rock => this.drawPoint(rock, 'rock'))
        this.game.garden.foods.forEach(food => this.drawPoint(food, 'food'))
        this.displaytext(this.game.score)
    }
}


window.onload = function () {
    const renderer = new Renderer(document.getElementById('garden'), document.getElementById('info'))

    renderer.paint();

    document.addEventListener("keypress", e => renderer.handlePress(e));
}


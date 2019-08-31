class Game {
    /**
     * creates a new game
     * 
     * @param {Garden} garden the game's environment
     * @param {Snake} snake the player's persona
     * @param {Number} score the player's score
     */
    constructor(garden = new Garden(), snake = new Snake(), score = 0) {
        this._score = score;
        this._garden = garden;
        this._snake = snake;
    }

    static with_dimensions(width, height) {
        const mid = n => Math.floor(n / 2)

        const head = new Point(mid(height), mid(width))

        const tail = head.move(Direction.RIGHT.steps(3))

        return new Game(Garden.with_objects(width, height, 4, 5), new Snake([head, tail]))
        // return new Game(new Garden(width, height).spawn_food.spawn_food.spawn_rock.spawn_food.spawn_food.spawn_rock, new Snake([head, tail]))
    }

    /**
     * returns the current score
     */
    get score() {
        return this._score;
    }

    /**
     * returns the game's garden
     */
    get garden() {
        return this._garden;
    }

    /**
     * returns the game's snake
     */
    get snake() {
        return this._snake;
    }

    /**
     * checks whether the game should proceed
     */
    get is_on() {
        return this.snake.is_alive;
    }

    /**
     * checks whether the location is safe
     * 
     * @param {Location} location the location to be checked
     */
    is_safe(location) {
        return !(this.snake.on_snake(location) || this.garden.has_obstacle(location) || this.garden.on_edge(location));
    }

    /**
     * advances the game by playing in the direction and adding rocks and food
     * 
     * @param {Direction} direction the direction to play
     */
    play(direction) {
        const next = this.snake.head.neighbor(direction);

        if (!this.is_safe(next)) {
            return new Game(
                this.garden,
                this.snake.die,
                this.score
            );
        }

        if (this.garden.has_food(next)) {
            return new Game(
                this.garden.remove_food(next).spawn_food,
                this.snake.move_and_grow(direction),
                this.score + 1
            );
        }

        return new Game(
            this.garden,
            this.snake.move(direction),
            this.score
        );
    }

    get add_food() {
        return new Game(
            this.garden.spawn_food,
            this.snake,
            this.score
        );
    }

    get add_rock() {
        return new Game(
            this.garden.spawn_rock,
            this.snake,
            this.score
        );
    }

    get remove_food() {
        return new Game(
            this.garden.remove_oldest_food,
            this.snake,
            this.score
        );
    }

    get remove_rock() {
        return new Game(
            this.garden.remove_oldest_rock,
            this.snake,
            this.score
        );
    }
}

class Garden {
    /**
     * creates a new garden
     * 
     * @param {Number} width the width of the garden
     * @param {Number} height the height of the garden
     * @param {...Point} foods points with food on them
     * @param {...Point} rocks points with rocks on them
     */
    constructor(width, height, foods = [], rocks = []) {
        this._width = width;
        this._height = height;

        this._foods = foods;
        this._rocks = rocks;
    }

    static with_objects(width, height, rocks = 0, food = 0) {
        const range = (start = 0, stop = 0, step = 1) => Array.from(new Array((stop - start) / step)).map((_, i) => start + i * step);
        const repeat = (fn, n, first) => range(0, n).reduce(acc => fn(acc), first);
        return [{ fn: g => g.spawn_food, n: food },
        { fn: g => g.spawn_rock, n: rocks }
        ].reduce((g, { fn, n }) => repeat(fn, n, g), new Garden(width, height))
    }

    /**
     * return all the locations with food on them
     */
    get foods() {
        return this._foods;
    }

    /**
     * returns all the locations with rocks on them
     */
    get rocks() {
        return this._rocks;
    }

    /**
     * returns the height of the garden
     */
    get height() {
        return this._height;
    }

    /**
     * returns the width of the garden
     */
    get width() {
        return this._width;
    }


    /**
     * returns an empty random location on the garden
     */
    get empty_random_location() {
        const random_in_range = (min, max) => Math.floor(Math.random() * (max - min)) + min;

        const get_random_location = () => new Point(random_in_range(0, this.width), random_in_range(0, this.height));

        let random_location;
        let tries = 100;

        while (true) {
            random_location = get_random_location();

            if (this.is_empty(random_location)) {
                return random_location;
            }

            if (tries === 0) {
                throw new Error("No empty location found")
            }

            tries--;
        }
    }

    /**
     * checks whether a location is on the edge
     * 
     * @param {Location} location the location to be checked
     */
    on_edge(location) {
        return location.x < 0 || location.x > this.width || location.y < 0 || location.y > this.height;
    }

    /**
     * checks whether a location is empty
     * 
     * @param {Location} location the location to be checked
     */
    is_empty(location) {
        return !this.has_food(location) && !this.has_obstacle(location);
    }

    /**
     * checks whether a location has an obsacle
     * 
     * @param {Location} location the location to be checked
     */
    has_obstacle(location) {
        return this.rocks.some(rock_location => Points.are_equal(rock_location, location));
    }


    /**
     * checks whether a location has food
     * 
     * @param {Location} location the location to be checked
     */
    has_food(location) {
        return this.foods.some(food_location => Points.are_equal(food_location, location));
    }

    /**
     * adds food to the garden
     */
    get spawn_food() {
        return new Garden(this.width, this.height, Arr.extend(this.foods, this.empty_random_location), this.rocks);
    }


    /**
     * adds a rock to the garden
     */
    get spawn_rock() {
        return new Garden(this.width, this.height, this.foods, Arr.extend(this.rocks, this.empty_random_location));
    }

    /**
     * removes food from the location
     * 
     * @param {Location} location the location to be cleared
     */
    remove_food(location) {
        return new Garden(this.width, this.height, this.foods.filter(food_location => !Points.are_equal(food_location, location)), this.rocks);
    }

    /**
     * removes a rock from the location
     * 
     * @param {Location} location the location to be cleared
     */
    remove_rock(location) {
        return new Garden(this.width, this.height, this.foods, this.rocks.filter(rock_location => !Point.are_equal(rock_location, location)));
    }

    get remove_oldest_rock() {
        return new Garden(this.width, this.height, this.foods, this.rocks.slice(1));
    }

    get remove_oldest_food() {
        return new Garden(this.width, this.height, this.foods.slice(1), this.rocks);
    }

    get remove_random() {
        const random_in_range = (min, max) => Math.floor(Math.random() * (max - min)) + min;

        return new Garden(this.width,
            this.height,
            this.foods.slice(random_in_range(0, this.foods.length)),
            this.rocks.slice(random_in_range(0, this.rocks.length)))
    }
}


class Snake {
    /**
     * creates a new snake
     * 
     * @param {...Point} body list of points where the snake bends
     */
    constructor(vertices = []) {
        this._vertices = vertices;
    }

    /**
     * moves snake in the direction
     * 
     * @param {Direction} direction the direction the head of the snake should move
     */
    move(direction) {
        return this.add_at_head(direction).remove_one_from_tail;
    }

    /**
     * moves the snake and increments it's length by one
     * 
     * @param {Direction} direction the direction the head of the snake should move
     */
    move_and_grow(direction) {
        return this.add_at_head(direction);
    }

    /**
     * kills the snake
     */
    get die() {
        return Snake.dead_snake;
    }

    get is_alive() {
        return this._vertices.length > 0;
    }

    static get dead_snake() {
        return new Snake();
    }

    /**
     * checks whether a point is on the snake
     * 
     * @param {Point} point the point to be tested
     */
    on_snake(point) {
        return this.segments.some(segment => segment.contains(point));
    }

    /**
     * returns the total length of the snake
     */
    get length() {
        return this.segments.reduce((acc, segment) => acc + segment.length, 0);
    }

    /**
     * returns the points at which the snake bends
     */
    get bends() {
        return this._vertices;
    }

    /**
     * returns the line segments on the snake
     */
    get segments() {
        if (this.bends.length < 2) {
            return this.bends.map(cell => Line.unit_line(cell));
        }

        return Arr.adjacent_pairs(this.bends)
            .map(pair => Line.between(...pair));
    }

    /**
     * grows the snake by adding a point at the head
     * 
     * @param {Direction} direction the direction to grow the snake in
     */
    add_at_head(direction) {
        const new_head = this.head.neighbor(direction);

        if (Points.are_collinear(this.head, this.second_bend, new_head)) {
            return new Snake([new_head, ...this._vertices.slice(1)]);
        } else {
            return new Snake([new_head, ...this._vertices]);
        }
    }

    /**
     * removes a point from the tail
     */
    get remove_one_from_tail() {
        const new_tail = this.tail.neighbor(this.last_segment.orientation.opposite)

        if (this.last_segment.length > 1) {
            return new Snake([...this.bends.slice(0, -1), new_tail]);
        } else {
            return new Snake([...this.bends.slice(0, -1)]);
        }
    }

    /**
     * returns the head of the snake
     */
    get head() {
        return this._vertices[0];
    }

    /**
     * returns the second bend after the head
     */
    get second_bend() {
        if (this.bends.length > 1) {
            return this.bends[1];
        } else {
            return this.bends[0];
        }
    }

    /**
     * returns the first segment on the snake
     */
    get first_segment() {
        if (this.bends.length > 1) {
            return this.segments[0];
        }

        return Line.null_line;
    }

    /**
     * returns the orientation of the snake's head 
     */
    get orientation() {
        return this.first_segment.orientation.opposite;
    }

    /**
     * returns the last line segment of the snake 
     */
    get last_segment() {
        return Arr.get_last(this.segments);
    }

    /**
     * returns the last point on the snake
     */
    get tail() {
        return Arr.get_last(this.bends);
    }
}

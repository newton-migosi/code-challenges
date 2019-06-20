class Game {
    constructor(garden_dimensions=[20,20]) {
        this._score = 0;
        this._garden = new Garden(...garden_dimensions);
    }

    start() {

    }

    play(instruction) {

    }
}

class Garden {
    constructor(width, height, snake_length=3) {
        this._width = width;
        this._height = height;

        this._foods = [];
        this._rocks = [];

        this._snake = new Snake(centre, snake_length, Direction.RIGHT, this);
    }

    is_empty(location) {

    }

    spawn_food() {

    }

    spawn_rocks() {

    }

    clear_food() {

    }

    clear_rocks() {
        
    }
}

class Snake {
    constructor(location, length, orientation, environment) {
        this._head = location;
        this._orientation = orientation;
        this._body = [new Line(length, orientation.opposite)];
        this._environment = environment;
        this._alive = True;
    }

    get orientation() {
        return this._orientation;
    }

    move(direction) {

    }

    move_is_safe(direction) {

    }

    grow() {

    }
}

class Line {
    constructor(start, length, direction) {
        this._start = start;
        this._length = length;
        this._direction = direction;
    }

    contains(location) {

    }

    get points() {

    }

    trim_first() {

    }

    trim_last() {

    }

    attach_first() {

    }

    attach_last() {

    }
}

class Location {
    constructor(horizontal, vertical) {
        this._x = horizontal;
        this._y = vertical;
    }
}

class Direction {
    constructor(direction) {
        this._direction = direction;
    }

    static get UP() {
        return Direction('UP')
    }

    static get DOWN() {
        return Direction('DOWN')
    }

    static get RIGHT() {
        return Direction('RIGHT')
    }

    static get LEFT() {
        return Direction('LEFT')
    }

    static get options() {
        return [Direction.UP, Direction.DOWN, Direction.RIGHT, Direction.LEFT];
    }

    get opposite() {
        switch (this._direction) {
            case 'UP' : Direction.DOWN;
            case 'DOWN': Direction.UP;
            case 'LEFT': Direction.RIGHT;
            case 'RIGHT' : Direction.LEFT;
        }
    }
}
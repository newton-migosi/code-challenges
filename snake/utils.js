class Vector {
    constructor(x=0,y=0) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    static equals(a, b) {
        return a.x === b.x && a.y === b.y;
    }
}

class CoordinateVector extends Vector {
    static at(x, y) {
        return new Point(x,y)
    }

    move(delta) {
        return new Point(this.x + delta.x, this.y + delta.y)
    }

    neighbor(direction) {
        return this.move(direction)
    }
}

class DisplacementVector extends Vector {
    get opposite() {
        return this.steps(-1)
    }

    steps(n) {
        return new Delta(this.x * n, this.y * n)
    }

}

const Point = CoordinateVector;
const Delta = DisplacementVector;

class Points {
    static are_collinear(...[first, ...points]) {
        return points.every(point => point.x === first.x) || points.every(point => point.y === first.y)
    }

    static flat_distance(start, stop) {
        return start.x === stop.x ? stop.y - start.y : stop.x - start.x
    }
    
    static get null_point() {
        return new Point()
    }

    static are_equal(a, b) {
        return a.x === b.x && a.y === b.y;
    }
}

class Line {
    constructor(start, stop) {
        if (!Points.are_collinear(start, stop)) {
            throw new Error("Cannot create line between non-collinear points")
        }

        this._start = start;
        this._stop = stop;
    }

    static between(start, stop) {
        return new Line(start, stop);
    }

    static unit_line(point) {
        return new Line(point, point)
    }

    get start() {
        return this._start;
    }

    get stop() {
        return this._stop;
    }

    get orientation() {
        if (this.is_horizontal) {
            if(this.magnitude > 0) {
                return Direction.RIGHT
            } else {
                return Direction.LEFT
            }
        } else {
            if(this.magnitude > 0) {
                return Direction.UP
            } else {
                return Direction.DOWN
            }
        }
    }

    get magnitude() {
        return Points.flat_distance(this.start, this.stop)
    }

    get is_vertical() {
        return this.start.x === this.stop.x;
    }

    get is_horizontal() {
        return this.start.y === this.stop.y;
    }

    get length() {
        return Math.abs(this.magnitude)
    }

    cord(point) {
        return this.is_vertical ? point.x : point.y
    }

    contains(point) {
        return Points.are_collinear(this.start, point) && Direction.equals(Line.between(this.start, point).orientation, this.orientation) && Line.between(this.start, point).length <= this.length 
    }

    static get null_line() {
        return new Line(Points.null_point, Points.null_point)
    }

    get points() {
        return Arr.expand(this.start, p=>p.neighbor(this.orientation), this.length)
    }
}

class Direction {
    static get UP() {
        return new Delta(0,1)
    }

    static get DOWN() {
        return new Delta(0, -1)
    }

    static get RIGHT() {
        return new Delta(1, 0)
    }

    static get LEFT() {
        return new Delta(-1, 0)
    }

    static equals(a, b) {
        return Delta.equals(a,b)
    }
}

class Arr {
    static expand(seed, rule, times) {
        const range = n => Array.from(new Array(n))

        return range(times).reduce(acc => [...acc, rule(Arr.get_last(acc))], [seed])
    }

    static extend(arr, item) {
        return [...arr, item];
    }

    static adjacent_pairs(arr) {
        const exclude_first = arr => arr.slice(1)
        const exclude_last = arr => arr.slice(0, -1)

        return Arr.zip(exclude_last(arr), exclude_first(arr));
    }

    static zip(...arrs) {
        if(arrs.length === 0) {
            arrs = [[]];
        }

        const range = n => Array.from(new Array(n))

        return range(arrs[0].length).reduce((acc, _, i) => [...acc, arrs.map(arr=>arr[i])], [])
    }

    static get_last(arr) {
        return arr[arr.length - 1];
    }
}
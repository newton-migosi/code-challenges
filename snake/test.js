const assert = require('chai').assert;
const { Game, Garden, Snake } = require('./snake');

describe('Snake', function () {
    describe('Game', function () {
        describe('#constructor()', function () {
            it('should create a game with a garden and a score of zero', function () {
                const game = new Game();

                assert.instanceof(game.garden, Garden);
                assert.strictEqual(game.score, 0);
            });
        });

        describe('#play()', function() {

        })
    });

    describe('Garden', function () {

        describe('#constructor()', function () {
            it('should create an empty garden with a snake and no food or rocks', function () {
                const garden = new Garden();

                assert.instanceof(garden.snake, Snake);
                assert.strictEqual(len(garden.foods), 0);
                assert.strictEqual(len(garden.rocks), 0);
            });
        });

        describe('#spawnfood()', function () {
            it('should place food away from snake', function () {

            });


        });

        describe('#spawnrock()', function () {
            it('should place rocks away from snake', function () {

            });


        });
    });

    describe('Snake', function () {

        describe('#move()', function () {
            context('with no argument', function () {
                it('should move the snake forward in direction it\'s facing', function () {

                });
            })

            context('with a direction', function () {
                it('should move the snake in the given direction', function () {

                });
            })
        });

        describe('#grow()', function () {
            it('should increase the snake\'s length', function () {

            });
        });

        describe('#onsnake?', function() {
            it('should return true if passed a location on the snake', function() {

            });

            it('should return false if passed location not on the snake', function() {

            });
        });

        describe('#safe?', function () {
            it('should return true if snake moves in a clear space', function () {

            });

            it('should return false if snake hits a wall', function () {

            });

            it('should return false if snake bites itself', function () {

            });

            it('should return false if snake hits a rock', function () {

            });
        })
    });
});
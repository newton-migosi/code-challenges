# Snake SpecSheet

## Components: 
    1. Garden - the game's environment
    2. Snake - the player's agent in the environment
    3. Food - goal of the game
    4. Obstacles - pitfalls of the gamr

## Actions: 
    1. Snake's motion controlled by user input
    2. Snake grows in length after eating food
    3. Snake dies after biting itself or hitting an obstacles

## Prototype UI:
    The garden will be represented as a white square box with a grey border. The snake will be a black line with food and obstacles being dots in the garden. Food will be green and obstacles red.

    The player should be able to control the snake's direction using the arrow buttons or buttons displayed on the page.

## Initialization:
    A snake of length 3 is place at the center of a 20x20 garden with food and obstacles placed at random.


## Tasks:
    1. Create a model for the game components
    2. Implement actions as methods
    3. Develop a prototype UI

### Project Structure
    snake
        - index.html: static elements of game
        - main.css: styling
        - snake.js: components and actions
        - render.js: UI
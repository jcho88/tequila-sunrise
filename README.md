# Battleline JS

A JavaScript example client for the Battleline game.

## Background

This client works with the Battleline game engine. Each client runs as a web server (confusing, yes) hosting an API. The game engine will call the API when significant game events occur, such as it being that clients turn.

A Dockerfile is included to compile and package the code with no additional dependencies required.

## Implementation

The client is a standard Node/Express application. API endpoints are defined in [app.js](app.js). They are:

1. `GET /game/ready` - A basic health check to confirm your client is accepting connections.

2. `POST /game/{gameid}` - Called on game creation. A client run can host multiple games sequentially. This endpoint allows for any persistent state to be initialized at the start of the game. Every call related to the game will pass the same *gameid*, so that can be used as a unique identifier to store game state. No response data is required, but any text returned will be treated as a battlecry that will appear in the game logs ;).

3. `POST /game/{gameid}/state` - Called when it is this players move. The current game state will be passed, including the players hand, the state of the board, and actions taken on previous turns. A "move" data structure is expected back, which includes an optional "trash_talk" field to populate!

4. `DELETE /game/{gameid}` - Called upon game completion. This can be used to clean up any persistent state associated with that game. No response data is expected.

### Example Client

The actual game logic resides in [random_client.js](random_client.js). This client is intentionally dumb. It plays a randomly chosen card from its hand to a randomly chosen flag on the board. If both players have completed that flag by playing 3 cards there each, the client will claim that flag if it has the better hand. There is a lot of room for improvement here.

The other major bit of logic that might be interesting is [combo_evaluator.js](combo_evaluator.js), which implements the logic to compare 2 card combos and declare the winner.

## Instructions

### Docker

From the project root directory:

```shell
docker build -t battleline-js .
```

That will result in a container image named *battleline-js* to be created.

Once the container image is built, simply run the following to launch the client on port 5001 of your local machine:

```shell
docker run --rm -p 5001:8080 battleline-js
```

### Local (Non-Docker instructions)

1. Install project dependencies using `npm install`

**Note:** If you encounter proxy or other networking issues with this step, configure your NPM registry setting as described [here](https://confluence.capgroup.com/display/~KEVM/Copy+of+Developer%27s+Guide+for+NPM).

1. Run the app using node:

Mac example:
```shell
PORT=5001 node app.js
```

Windows Powershell example:
```shell
$env:PORT=5001
node app.js
```

### Important Note

The game engine expects to be able to define the port used by the client on the Docker commandline, so do not modify the application to use a port other than 8080 within the container.

'use strict';

const client = require("./random_client")
const express = require("express");

const app = express();
const bodyparser = require("body-parser");

const port = process.env.PORT || 8080;

const { flag, player, card } = require('./index');

process.on('SIGINT', function() {
    process.exit();
});

// middleware

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// Called at engine startup to verify this client is ready to accept connections.
app.get("/game/ready", (req, res) => {
    res.status(200).end()
})
// Called when the game starts. Use this if you want to initialize
// any persistent state.
app.post("/game/:gameid", (req, res) => {
    res.send('Prepare to lose!')
})

// Called when it is your turn. Game state is passed in the request,
// and the response should contain your move.
app.post("/game/:gameid/state", (req, res) => {
    console.log("Request body = ",req.body);
    const gameState = req.body

    const move = client.move(gameState)

    res.status(200).json(move)
})

// Called when the game is over. 
// Use this if you want to clean up any persistent state.
app.delete("/game/:gameid", (req, res) => {
    res.status(200).end()
})

app.listen(port, () => {
  console.log(`Battleline JavaScript client running at port ${port}`)
})
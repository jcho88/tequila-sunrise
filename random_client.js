'use strict';
const { evalResults, evaluate } = require("./combo_evaluator")

function move(gameState) {
    // Player names. Used as keys into the card dictionary on the flags.
    const player = gameState.active_player
    const opponent = gameState.opposing_player

    // Randomly select a card to play
    const hand = gameState.active_player_hand
    const selectedCard = hand[Math.floor(Math.random() * hand.length)]

    // Select all unclaimed flags
    const unclaimedFlags = gameState.flags.filter(f => f.claimed_by == null)

    // Randomly select a non-full and unclaimed flag to place the card
    const openFlags = unclaimedFlags.filter(f => f.cards[player].length < 3)
    const selectedFlag = openFlags[Math.floor(Math.random() * openFlags.length)]

    // Add the card to the flag so we can evaluate whether it can be claimed
    selectedFlag.cards[player].push(selectedCard)

    // If a flag is complete (both players have played 3 cards), see if we can claim it
    const potentialFlags = unclaimedFlags.filter(f => f.cards[player].length + f.cards[opponent].length == 6)

    // See if we can claim any of them
    const flagsToClaim = []

    potentialFlags.forEach(flag => {
        const evalResult = evaluate(flag.cards[player], flag.cards[opponent])

        if (evalResult == evalResults.PLAYERWINNER || 
            (evalResult == evalResults.TIE && flag.first_to_complete == player)) {
                flagsToClaim.push(flag.id)
            }
    })

    // Return move and any claims    
    return { 
        flag_id: selectedFlag.id,
        card: selectedCard,
        claimed_flag_ids: flagsToClaim,
        trash_talk: "You're embarrassing yourself!"
    }
}

exports.move = move
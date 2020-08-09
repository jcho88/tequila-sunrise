'use strict';
const { evalResults, evaluate, scoreCombo } = require("./combo_evaluator")

function findBestHand(player, hand, openFlags) {
    console.log("entered findBestHand function")
    let scores = []
    let cardSets = []
    let flagSpotIDs = []
    let flagToPlay;

    // find best possible play with cards already played
    // for each already started flag
    const startedFlags = openFlags.filter(f => f.cards[player].length > 0)
    if (startedFlags.length > 0) {
        const oneCardFlags = startedFlags.filter(f => f.cards[player].length == 1)
        const twoCardFlags = startedFlags.filter(f => f.cards[player].length == 2)
        // find scoreCombos for flag spots with single card played
        for (const flag of oneCardFlags) {
            const card3 = flag.cards[player][0]
            for (const card of hand) {
                for (const card2 of hand.filter(c => c != card)) {
                    scores.push(scoreCombo([card, card2, card3]))
                    cardSets.push([card, card2, card3])
                    flagSpotIDs.push(flag.id)
                }
            }
        }
        // find scoreCombos for flag spots with two cards played
        for (const flag of twoCardFlags) {
            const card2 = flag.cards[player][0]
            const card3 = flag.cards[player][1]
            for (const card of hand) {
                scores.push(scoreCombo([card, card2, card3]))
                cardSets.push([card, card2, card3])
                flagSpotIDs.push(flag.id)
            }
        }
    } else {
        // if there are no flags with 0 cards
        // find best hand in current cards
        // play to optimal flag
        const optimalFlags = openFlags.filter(f => [2, 7, 5].includes(f.id))
        if (optimalFlags.length != 0) {
            flagToPlay = optimalFlags[0]
        } else {
            flagToPlay = openFlags[Math.floor(Math.random() * openFlags.length)]
        }
        for (const card of hand) {
            for (const card2 of hand.filter(c => c != card)) {
                for (const card3 of hand.filter(c => (c != card && c != card2))) {
                    scores.push(scoreCombo([card, card2, card3]))
                    cardSets.push([card, card2, card3])
                    flagSpotIDs.push(flagToPlay.id)
                }
            }
        }
    }
    // console.log("finished finding all sets. printing resulting arrays")
    // console.log("scores")
    // console.log(scores)
    // console.log("cardSets")
    // console.log(cardSets)
    // console.log("flagSpotIDs")
    // console.log(flagSpotIDs)
    const bestSetIndex = scores.findIndex(s => s == Math.max(...scores))
    const bestCardSet = cardSets[bestSetIndex]
    // pick any card in the set
    const bestCard = bestCardSet[0]
    const bestFlagToPlay = flagSpotIDs[bestSetIndex]
    console.log("finished findBestHand, printing results below")
    console.log("bestCard")
    console.log(bestCard)
    console.log("bestFlagToPlay")
    console.log(bestFlagToPlay)
    return [bestCard, bestFlagToPlay]

}

function move(gameState) {
    console.log("entered move function")
    // Player names. Used as keys into the card dictionary on the flags.
    const player = gameState.active_player
    const opponent = gameState.opposing_player

    // console.log("gamestate")
    // console.log(gameState)

    const hand = gameState.active_player_hand
    // const selectedCard = hand[Math.floor(Math.random() * hand.length)]

    // Select all unclaimed flags
    const unclaimedFlags = gameState.flags.filter(f => f.claimed_by == null)

    // Find all unclaimed flags
    const openFlags = unclaimedFlags.filter(f => f.cards[player].length < 3)
    // const selectedFlag = openFlags[Math.floor(Math.random() * openFlags.length)]
    // testing: select first open flag
    // const selectedFlag = openFlags[0]

    // Select best card and flag to play based on scoreCombo of all possible hands
    console.log("calling findBestHand function")
    const bestMove = findBestHand(player, hand, openFlags)
    const selectedCard = bestMove[0]
    const selectedFlagID = bestMove[1]
    const selectedFlag = openFlags.filter(f => f.id == selectedFlagID)[0]

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
        trash_talk: "don't even try"
    }
}

exports.move = move
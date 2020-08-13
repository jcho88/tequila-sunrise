'use strict';
const { evalResults, evaluate } = require("./combo_evaluator")
const comboEvaluator = require('./combo_evaluator');

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
    const selectedFlag = selectFlag(openFlags, gameState.move_number);

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

const selectCard = (cards) => {

    cards.forEach((e) => {
        comboEvaluator
    })

}

const selectFlag = (flags, move_number) => {
    flags.forEach((flag) => {

        //block 3 consecutive flags from the start
        if(move_number <= 3) {
            if(flag.id === 5) {
                return flag;
            }

            if(flag.id === 3) {
                return flag;
            }

            if(flag.id === 7) {
                return flag;
            }
        }

        

    })
}

const isStraightPotential = (cards) => {
    let sortedCards = cards.sort(function(a, b) {
        return parseInt(a[1]) - parseInt(b[1]);
    });
    let result = [];

    for(let i = 0; i < sortedCards.length - 1; i++) {

        if(sortedCards[i+1][1] - sortedCards[i][1] === 1) {
            result.push([sortedCards[i], sortedCards[i+1]]);
        }
    }

    return result;
}

const isFlushPotential = (cards) => {

    let colorMap = new Map();

    cards.map(c => c[0]).forEach((e) => {
        if(colorMap.has(e)) {
          colorMap.set(e, colorMap.get(e) + 1);
        } else {
          colorMap.set(e, 1);
        }
    })

    return colorMap;
}

const isTriplePotential = (cards) => {

    let numberMap = new Map();

    cards.map(c => parseInt(c[1])).forEach((e) => {
        if(numberMap.has(e)) {
          numberMap.set(e, numberMap.get(e) + 1);
        } else {
          numberMap.set(e, 1);
        }
    })

    return numberMap;
}

const isStraightFlushPotential = (cards) => {
    let straightPotentialCards = isStraightPotential(cards);
    let result = [];

    straightPotentialCards.forEach((e) => {
      if(e[0][0] === e[1][0]) {
        result.push(e);
      }
    })

    return result;
}

const getStrongestHand = (cards) => {
    let max = 0;
    let possibleHands = getCombinations(cards, 3);
    let strongestHand = [];

    possibleHands.forEach((e) => {
        if(comboEvaluator.scoreCombo(e) > max) {
            max = comboEvaluator.scoreCombo(e);
            strongestHand = e;
        }
    });

    return e;

}

const getCombinations = (cards, n, partial) => {
    if (!partial) partial = [];                 // set default value on first call
    for (var element in cards) {
        if (n > 1) {
            var cards_copy = cards.slice();         // slice() creates copy of array
            cards_copy.splice(element, 1);        // splice() removes element from array
            getCombinations(cards_copy, n - 1, partial.concat([cards[element]]));
        }                                       // a.concat(b) appends b to copy of a
        else document.write("[" + partial.concat([cards[element]]) + "] ");
    }
}

exports.move = move
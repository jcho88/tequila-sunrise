'use strict';

const comboTypes = {
    COLORRUN: 400,
    THREEOFKIND: 300,
    COLOR: 200,
    RUN: 100,
    SUM: 0
}

const evalResults = {
    PLAYERWINNER: 1,
    OPPONENTWINNER: 2,
    TIE: 3
}

function evaluate(playerCards, opponentCards) {
    const playerVal = scoreCombo(playerCards)
    const opponentVal = scoreCombo(opponentCards)

    if (playerVal == opponentVal) {
        return evalResults.TIE
    }
    
    if (playerVal > opponentVal) {
        return evalResults.PLAYERWINNER
    }

    return evalResults.OPPONENTWINNER
}

function scoreCombo(cards) {
    const cardColors = cards.map(c => c[0])
    const cardValues = cards.map(c => parseInt(c[1]))
    const cardSum = cardValues.reduce((v1, v2) => v1 + v2)

    if (cards.length < 3) {
        return cardSum
    }

    const isFlush = new Set(cardColors).size == 1
    const isStraight = Math.max(...cardValues) - Math.min(...cardValues) == 2 && new Set(cardValues).size == 3

    if (isFlush) {
        // Straight flush
        if (isStraight) {
            return comboTypes.COLORRUN + cardSum
        }

        //Flush
        return comboTypes.COLOR + cardSum
    }

    // 3 of a kind
    if (new Set(cardValues).size == 1){
        return comboTypes.THREEOFKIND + cardSum
    }

    // Straight
    if (isStraight) {
        return comboTypes.RUN + cardSum
    }

    return cardSum
}

exports.evalResults = evalResults
exports.evaluate = evaluate
exports.scoreCombo = scoreCombo
"use strict";
const { evalResults, evaluate, scoreCombo } = require("./combo_evaluator");

const fullDeck = [
  "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9",
  "Y1", "Y2", "Y3", "Y4", "Y5", "Y6", "Y7", "Y8", "Y9",
  "O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9",
  "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9",
  "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9",
  "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"
]

const twoCardComboTypes = {
  COLORRUN: 400,
  THREEOFKIND: 300,
  COLOR: 200,
  RUN: 100,
  SUM: 0
}

function twoCardScoreCombo(cards, gameState) {

  const playedCards = gameState.flags.map(f => f.cards[gameState.active_player].concat(f.cards[gameState.opposing_player]))
  const unplayedCards = fullDeck.filter(c => !playedCards.includes(c))

  const cardColors = cards.map(c => c[0])
  const cardValues = cards.map(c => parseInt(c[1]))
  const cardSum = cardValues.reduce((v1, v2) => v1 + v2)

  // if (cards.length === 2) {
  //     return cardSum
  // }

  const isFlush = new Set(cardColors).size == 1
  const isStraight = Math.max(...cardValues) - Math.min(...cardValues) == 1 && new Set(cardValues).size == 2
  let flushPossible = false;

  // before each return statement below:
  // check if any possible third cards are still in play
  // check which cards are required to complete the hand given (param)
  // check if any cards in cardsInPlay have values that match those in requiredCardValues
  // if no cards in cardsInPlay match, return 0
  if (isFlush) {
    // check if flush is possible
    let requiredColor = cardColors[0];
    const unplayedCardsColors = unplayedCards.map(c => c[0])
    if (unplayedCardsColors.includes(requiredColor)) {
      flushPossible = true;
    }
  }


  // apply new scoring based on condition above


  if (isFlush && flushPossible) {
    // Straight flush
    // check if flush is possible
    // if yes - check for straight
    // if not -- need to go directly to 3kind or only-straight checks
    if (isStraight) {
      // straightFlush possibilities where cards are consecutive numbers that are not at the ends (1 or 9)
      if (Math.min(...cardValues) !== 1 && Math.max(...cardValues) !== 9) {
        let requiredCards = [];
        requiredCards.push(cardColors[0] + (Math.max(...cardValues) + 1));
        requiredCards.push(cardColors[0] + (Math.min(...cardValues) - 1));
        // check if any cards in unplayedCards have cards that match those in requiredCards
        if (unplayedCards.includes(requiredCards[0]) || unplayedCardsValues.includes(requiredCards[1])) {
          return twoCardComboTypes.COLORRUN + cardSum
        }
      }
    }
    //Flush
    return twoCardComboTypes.COLOR + cardSum
  }

  // 3 of a kind
  if (new Set(cardValues).size == 1) {
    // put 3kind possible logic here
    return twoCardComboTypes.THREEOFKIND + cardSum
  }

  // Straight
  if (isStraight) {
    let requiredCardsValues = [];
    requiredCardsValues.push(Math.max(...cardValues) + 1);
    requiredCardsValues.push(Math.min(...cardValues) - 1);
    // check if any cards in cardsInPlay have values that match those in requiredCardValues
    let unplayedCardsValues = unplayedCards.map(c => parseInt(c[1]))
    if (unplayedCardsValues.includes(requiredCardsValues[0]) || unplayedCardsValues.includes(requiredCardsValues[1])) {
      return twoCardComboTypes.RUN + cardSum
    }
  }

  return cardSum
}

const getCompleteSets = (combinations, mandatory) => {
  //const combos = combinations; // getCombinations(cards);
  const scores = [];
  const deduped = [];

  combinations.cardSets.forEach((c) => {
    if (mandatory) {
      if (c.filter((o) => mandatory.includes(o)).length === mandatory.length) {
        if (!deduped.includes(c.sort().join(","))) {
          deduped.push(c.sort().join(","));
        }
      }
    } else {
      if (!deduped.includes(c.sort().join(","))) {
        deduped.push(c.sort().join(","));
      }
    }
  });

  const clean = deduped.map((m) => m.split(","));

  clean.forEach((cardSet) => {
    scores.push({
      cardSet,
      score: scoreCombo(cardSet),
    });
  });
  return scores.sort(function (a, b) {
    return b.score - a.score;
  });
};


const getTwoCardSets = (combinations, mandatory, gameState) => {
  //const combos = combinations; // getCombinations(cards);
  const scores = [];
  const deduped = [];

  combinations.cardSets.forEach((c) => {
    if (mandatory) {
      if (c.filter((o) => mandatory.includes(o)).length === mandatory.length) {
        if (!deduped.includes(c.sort().join(","))) {
          deduped.push(c.sort().join(","));
        }
      }
    } else {
      if (!deduped.includes(c.sort().join(","))) {
        deduped.push(c.sort().join(","));
      }
    }
  });

  const clean = deduped.map((m) => m.split(","));

  clean.forEach((cardSet) => {
    scores.push({
      cardSet,
      score: twoCardScoreCombo(cardSet, gameState),
    });
  });
  return scores.sort(function (a, b) {
    return b.score - a.score;
  });
};

/* keeper */
const getCombinations = (hand) => {
  //let scores = [];
  let cardSets = [];
  //let flagSpotIDs = [];

  for (const card of hand) {
    for (const card2 of hand.filter((c) => c != card)) {
      for (const card3 of hand.filter((c) => c != card && c != card2)) {
        //scores.push(scoreCombo([card, card2, card3]));
        cardSets.push([card, card2, card3]);
        //flagSpotIDs.push(flagToPlay.id);
      }
    }
  }

  return {
    cardSets,
    // scores,
    // cardSets,
    // flagSpotIDs,
  };
};

function getTwoCombos(hand) {

  //let scores = [];
  let cardSets = [];
  //let flagSpotIDs = [];

  for (const card of hand) {
    for (const card2 of hand.filter((c) => c != card)) {
      //for (const card3 of hand.filter((c) => c != card && c != card2)) {
      //scores.push(scoreCombo([card, card2, card3]));
      cardSets.push([card, card2]); //, card3]);
      //flagSpotIDs.push(flagToPlay.id);
      //}
    }
  }

  return {
    cardSets,
    // scores,
    // cardSets,
    // flagSpotIDs,
  };

}

const getBestMove = (flagStatus) => {
  // okay best move lets see if position 3 is empty
  const onlyPossibilities = flagStatus.filter(e => e.isPossibility).sort(function (a, b) {
    return b.score - a.score;
  });
  const sureThang = flagStatus.filter(e => !e.isPossibility).sort(function (a, b) {
    return b.score - a.score;
  });

  let bestMove;

  if (sureThang.length) {
    let viableFlags = sureThang.filter(f => f.score == sureThang[0].score);
    // if flag3 is in viableFlags, place 3
    // else if flag7 is in viableFlags, place 7
    // place 5
    // place 4
    // place 6
    // place 2
    // place 8
    // place 1
    // place 9

    const priorityFlags = [3, 7, 5, 4, 6, 2, 8, 1, 9]
    const flagsToPlay = viableFlags.filter(v => priorityFlags.includes(v.flag))
    let orderedFlagsToPlay = [];
    priorityFlags.forEach((id) => {
      flagsToPlay.forEach(f => {
        if (f.flag === id) {
          orderedFlagsToPlay.push(f);
        }
      }
      )
    })
    bestMove = orderedFlagsToPlay[0]
  } else {
    // bestMove = onlyPossibilities[0];
    let viableFlags = onlyPossibilities.filter(f => f.score == onlyPossibilities[0].score);
    const priorityFlags = [3, 7, 5, 4, 6, 2, 8, 1, 9]
    const flagsToPlay = viableFlags.filter(v => priorityFlags.includes(v.flag))
    let orderedFlagsToPlay = [];
    priorityFlags.forEach((id) => {
      flagsToPlay.forEach(f => {
        if (f.flag === id) {
          orderedFlagsToPlay.push(f);
        }
      }
      )
    })
    bestMove = orderedFlagsToPlay[0]
  }
  // if(sureThang.length > 0) {
  //   // get moves in sureThang that have equal high scores
  //   // bestMove = sureThang[0];

  //   viableFlags = sureThang.filter(f => f.score == sureThang[0]);
  //   // if flag3 is in viableFlags, place 3
  //   // else if flag7 is in viableFlags, place 7
  //   // place 5
  //   // place 4
  //   // place 6

  //   viableFlags.filter(flag => sureThang.includes(flag))


  // } else {
  //   bestMove = onlyPossibilities[0];
  // }

  return bestMove;
}
// const isStraightPotential = (cards) => {
//   let sortedCards = cards.sort(function (a, b) {
//     return parseInt(a[1]) - parseInt(b[1]);
//   });
//   let result = [];

//   for (let i = 0; i < sortedCards.length - 1; i++) {
//     if (sortedCards[i + 1][1] - sortedCards[i][1] === 1) {
//       result.push([sortedCards[i], sortedCards[i + 1]]);
//     }
//   }

//   return result;
// };

// const isFlushPotential = (cards) => {
//   let colorMap = new Map();

//   cards
//     .map((c) => c[0])
//     .forEach((e) => {
//       if (colorMap.has(e)) {
//         colorMap.set(e, colorMap.get(e) + 1);
//       } else {
//         colorMap.set(e, 1);
//       }
//     });

//   return colorMap;
// };

// const isTriplePotential = (cards) => {
//   let numberMap = new Map();

//   cards
//     .map((c) => parseInt(c[1]))
//     .forEach((e) => {
//       if (numberMap.has(e)) {
//         numberMap.set(e, numberMap.get(e) + 1);
//       } else {
//         numberMap.set(e, 1);
//       }
//     });

//   return numberMap;
// };

// const isStraightFlushPotential = (cards) => {
//   let straightPotentialCards = isStraightPotential(cards);
//   let result = [];

//   straightPotentialCards.forEach((e) => {
//     if (e[0][0] === e[1][0]) {
//       result.push(e);
//     }
//   });

//   return result;
// };

// const getStrongestHand = (cards) => {
//   let max = 0;
//   let possibleHands = getCombinations(cards, 3);
//   let strongestHand = [];

//   possibleHands.forEach((e) => {
//     if (comboEvaluator.scoreCombo(e) > max) {
//       max = comboEvaluator.scoreCombo(e);
//       strongestHand = e;
//     }
//   });

//   return e;
// };

// const thresholds = {
//   breakpoint1: {
//     min: 15,
//     hand: "triples",
//   },
//   breakpoint2: {
//     min: 25,
//     hand: "flush",
//   },
//   breakpoint3: {
//     min: 35,
//     hand: "straight",
//   },
// };

// const getFlagScores = (openFlags, hand, player) => {
//   openFlags.map((flag) => {
//     const best = flag.cards[player].concat(hand);
//   });
// };

function findBestHand(player, hand, openFlags, moveNumber,gameState) {
  //console.log("entered findBestHand function");


  let flagStatus = [];

  openFlags.forEach((flag, index) => {
    //look for best hand available that we can do now on each flag.
    const combos = getCombinations(hand.concat(flag.cards[player]));
    const sets = getCompleteSets(combos, flag.cards[player]);
    let play;
    if (moveNumber < 15) {
      if (sets[0].score > 300) {
        play = sets[0].cardSet.filter(card => {
          return hand.includes(card);
        })
        flagStatus.push({
          flag: flag.id,
          play: play,
          score: sets[0].score,
          isPossibility: false
        });
      } else {
        if (flag.cards[player].length < 2) {
          const allCards = flag.cards[player].concat(hand);
          const incompletes = getTwoCombos(hand.concat(flag.cards[player]));
          const incompleteSets = getTwoCardSets(incompletes, flag.cards[player], gameState);
          const play = incompleteSets[0].cardSet.filter(card => {
            return hand.includes(card);
          })
          flagStatus.push({
            flag: flag.id,
            play: play,
            score: incompleteSets[0].score,
            isPossibility: true
          });
        }
      }
    }

    if (moveNumber < 30 && moveNumber >= 15) {
      if (sets[0].score > 200) {
        //console.log("score over 200", sets[0]);
        play = sets[0].cardSet.filter(card => {
          return hand.includes(card);
        })
        flagStatus.push({
          flag: flag.id,
          play: play,
          score: sets[0].score,
          isPossibility: false
        });

      } else {
        if (flag.cards[player].length < 2) {
          const allCards = flag.cards[player].concat(hand);
          const incompletes = getTwoCombos(hand.concat(flag.cards[player]));
          const incompleteSets = getTwoCardSets(incompletes, flag.cards[player], gameState);
          const play = incompleteSets[0].cardSet.filter(card => {
            return hand.includes(card);
          })
          flagStatus.push({
            flag: flag.id,
            play: play,
            score: incompleteSets[0].score,
            isPossibility: true
          });
        }
      }
    }

    if (moveNumber < 45 && moveNumber >= 30) {
      if (sets[0].score > 100) {
        //console.log("score over 200", sets[0]);
        play = sets[0].cardSet.filter(card => {
          return hand.includes(card);
        })
        flagStatus.push({
          flag: flag.id,
          play: play,
          score: sets[0].score,
          isPossibility: false
        });
      } else {
        if (flag.cards[player].length < 2) {
          const allCards = flag.cards[player].concat(hand);
          const incompletes = getTwoCombos(hand.concat(flag.cards[player]));
          const incompleteSets = getTwoCardSets(incompletes, flag.cards[player], gameState);
          const play = incompleteSets[0].cardSet.filter(card => {
            return hand.includes(card);
          })
          flagStatus.push({
            flag: flag.id,
            play: play,
            score: incompleteSets[0].score,
            isPossibility: true
          });
        }
      }
    }

    if (moveNumber >= 45) {
      if (sets[0].score > 0) {
        //console.log("score over 200", sets[0]);
        play = sets[0].cardSet.filter(card => {
          return hand.includes(card);
        })
        flagStatus.push({
          flag: flag.id,
          play: play,
          score: sets[0].score,
          isPossibility: false
        });
      } else {
        // const allCards = flag.cards[player].concat(hand);
        // const incompletes = getTwoCombos(hand.concat(flag.cards[player]));
        // const incompleteSets = getTwoCardSets(incompletes);
        // const play = incompleteSets[0].cardSet[0];
        // console.log('play', incompleteSets[0].cardSet[0], 'flag:' + (index + 1));
      }
    }

  });

  return getBestMove(flagStatus);
  //console.log(flagStatus)
}

// function findBestHand(player, hand, openFlags, moveNumber) {



//   console.log("entered findBestHand function");
//   openFlags.forEach(flag => {
//     //look for best hand available that we can do now on each flag.
//     const combos = getCombinations(hand.concat(flag.cards[player]));

//     // do we have something that meets our threshold?
//     if(moveNumber < 15) {
//       if(combos[0].score > 300) {
//         // yeah let's play the trips
//         hand.forEach(c => {
//           c.filter(card => combos[0].cardSet.includes(card));
//         });
//       } else {
//         // look at the board to remove cards in play
//         // look at our hand for possibilities
//       }
//     }
//     if(moveNumber < 25 && moveNumber >= 15) {
//       if(combos[0].score > 200) {
//         // okay flush is looking good now
//       } else {
//         // look at the board to remove cards in play
//         // look at our hand for possibilities
//       }
//     }

//     if(moveNumber < 35 && moveNumber >= 25) {
//       if(combos[0].score > 100) {
//         // it's getting late.  straights are ok
//       } else {
//         // look at the board to remove cards in play
//         // look at our hand for possibilities
//       }
//     }

//   });


//   let scores = [];
//   let cardSets = [];
//   let flagSpotIDs = [];
//   let flagToPlay;

//   // find best possible play with cards already played

//   findBestCombination;

//   // for each already started flag
//   const startedFlags = openFlags.filter((f) => f.cards[player].length > 0);

//   // flag is in play
//   if (startedFlags.length > 0) {
//     const oneCardFlags = startedFlags.filter(
//       (f) => f.cards[player].length == 1
//     );
//     const twoCardFlags = startedFlags.filter(
//       (f) => f.cards[player].length == 2
//     );

//     // find scoreCombos for flag spots with single card played
//     for (const flag of oneCardFlags) {
//       const card3 = flag.cards[player][0];
//       for (const card of hand) {
//         for (const card2 of hand.filter((c) => c != card)) {
//           scores.push(scoreCombo([card, card2, card3]));
//           cardSets.push([card, card2, card3]);
//           flagSpotIDs.push(flag.id);
//         }
//       }
//     }
//     // find scoreCombos for flag spots with two cards played
//     for (const flag of twoCardFlags) {
//       const card2 = flag.cards[player][0];
//       const card3 = flag.cards[player][1];
//       for (const card of hand) {
//         scores.push(scoreCombo([card, card2, card3]));
//         cardSets.push([card, card2, card3]);
//         flagSpotIDs.push(flag.id);
//       }
//     }
//   } else {
//     // if there are no flags with 0 cards
//     // find best hand in current cards
//     // play to optimal flag
//     const optimalFlags = openFlags.filter((f) => [2, 7, 5].includes(f.id));
//     if (optimalFlags.length != 0) {
//       flagToPlay = optimalFlags[0];
//     } else {
//       flagToPlay = openFlags[Math.floor(Math.random() * openFlags.length)];
//     }
//     // getCombination(hand);
//   }
//   // console.log("finished finding all sets. printing resulting arrays")
//   // console.log("scores")
//   // console.log(scores)
//   // console.log("cardSets")
//   // console.log(cardSets)
//   // console.log("flagSpotIDs")
//   // console.log(flagSpotIDs)
//   const bestSetIndex = scores.findIndex((s) => s == Math.max(...scores));
//   const bestCardSet = cardSets[bestSetIndex];
//   // pick any card in the set
//   const bestCard = bestCardSet[0];
//   const bestFlagToPlay = flagSpotIDs[bestSetIndex];
//   console.log("finished findBestHand, printing results below");
//   console.log("bestCard");
//   console.log(bestCard);
//   console.log("bestFlagToPlay");
//   console.log(bestFlagToPlay);
//   return [bestCard, bestFlagToPlay];
// }



function move(gameState) {
  console.log("entered move function");
  // Player names. Used as keys into the card dictionary on the flags.
  const player = gameState.active_player;
  const opponent = gameState.opposing_player;

  // console.log("gamestate")
  // console.log(gameState)

  const hand = gameState.active_player_hand;
  // const selectedCard = hand[Math.floor(Math.random() * hand.length)]

  // Select all unclaimed flags
  const unclaimedFlags = gameState.flags.filter((f) => f.claimed_by == null);

  // Find all unclaimed flags
  const openFlags = unclaimedFlags.filter((f) => f.cards[player].length < 3);
  // const selectedFlag = openFlags[Math.floor(Math.random() * openFlags.length)]
  // testing: select first open flag
  // const selectedFlag = openFlags[0]

  // Select best card and flag to play based on scoreCombo of all possible hands
  console.log("calling findBestHand function");
  const bestMove = findBestHand(player, hand, openFlags, gameState.move_number, gameState);

  //const [selectedCard, selectedFlagID] = bestMove;

  const selectedCard = bestMove.play[0];
  const selectedFlagID = bestMove.flag;
  const selectedFlag = openFlags.filter((f) => f.id == selectedFlagID)[0];

  // Add the card to the flag so we can evaluate whether it can be claimed
  selectedFlag.cards[player].push(selectedCard);

  // If a flag is complete (both players have played 3 cards), see if we can claim it
  const potentialFlags = unclaimedFlags.filter(
    (f) => f.cards[player].length + f.cards[opponent].length == 6
  );

  // See if we can claim any of them
  const flagsToClaim = [];

  potentialFlags.forEach((flag) => {
    const evalResult = evaluate(flag.cards[player], flag.cards[opponent]);

    if (
      evalResult == evalResults.PLAYERWINNER ||
      (evalResult == evalResults.TIE && flag.first_to_complete == player)
    ) {
      flagsToClaim.push(flag.id);
    }
  });

  // Return move and any claims
  console.log({
    flag_id: selectedFlag.id,
    card: selectedCard,
    claimed_flag_ids: flagsToClaim,
    trash_talk: "don't even try",
  });

  return {
    flag_id: selectedFlag.id,
    card: selectedCard,
    claimed_flag_ids: flagsToClaim,
    trash_talk: "don't even try",
  };
}

exports.move = move;

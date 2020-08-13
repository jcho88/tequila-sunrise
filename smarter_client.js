"use strict";
const { evalResults, evaluate, scoreCombo } = require("./combo_evaluator");
const { getTrashTalkLine } = require("./smarter_trash.js");

const fullDeck = [
  "R1",
  "R2",
  "R3",
  "R4",
  "R5",
  "R6",
  "R7",
  "R8",
  "R9",
  "Y1",
  "Y2",
  "Y3",
  "Y4",
  "Y5",
  "Y6",
  "Y7",
  "Y8",
  "Y9",
  "O1",
  "O2",
  "O3",
  "O4",
  "O5",
  "O6",
  "O7",
  "O8",
  "O9",
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "P1",
  "P2",
  "P3",
  "P4",
  "P5",
  "P6",
  "P7",
  "P8",
  "P9",
];

const twoCardComboTypes = {
  COLORRUN: 400,
  THREEOFKIND: 300,
  COLOR: 200,
  RUN: 100,
  SUM: 0,
};

function twoCardScoreCombo(cards, gameState) {
  const playedCards = gameState.flags.map((f) =>
    f.cards[gameState.active_player].concat(f.cards[gameState.opposing_player])
  );

  const turnCount = gameState.move_number;

  const unplayedCards = fullDeck.filter((c) => !playedCards.includes(c));

  const cardColors = cards.map((c) => c[0]);
  const cardValues = cards.map((c) => parseInt(c[1]));
  const cardSum = cardValues.reduce((v1, v2) => v1 + v2);

  // if (cards.length === 2) {
  //     return cardSum
  // }

  const isFlush = new Set(cardColors).size == 1;
  const isStraight =
    Math.max(...cardValues) - Math.min(...cardValues) == 1 &&
    new Set(cardValues).size == 2;
  let flushPossible = false;

  // before each return statement below:
  // check if any possible third cards are still in play
  // check which cards are required to complete the hand given (param)
  // check if any cards in cardsInPlay have values that match those in requiredCardValues
  // if no cards in cardsInPlay match, return 0
  if (isFlush) {
    // check if flush is possible
    let requiredColor = cardColors[0];
    const unplayedCardsColors = unplayedCards.map((c) => c[0]);
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
        if (
          unplayedCards.includes(requiredCards[0]) ||
          unplayedCardsValues.includes(requiredCards[1])
        ) {
          return twoCardComboTypes.COLORRUN + cardSum;
        }
      }
    }
    //Flush
    return twoCardComboTypes.COLOR + cardSum;
  }

  // 3 of a kind
  if (new Set(cardValues).size == 1) {
    // put 3kind possible logic here
    return twoCardComboTypes.THREEOFKIND + cardSum;
  }

  // Straight
  if (isStraight) {
    let requiredCardsValues = [];
    requiredCardsValues.push(Math.max(...cardValues) + 1);
    requiredCardsValues.push(Math.min(...cardValues) - 1);
    // check if any cards in cardsInPlay have values that match those in requiredCardValues
    let unplayedCardsValues = unplayedCards.map((c) => parseInt(c[1]));
    if (
      unplayedCardsValues.includes(requiredCardsValues[0]) ||
      unplayedCardsValues.includes(requiredCardsValues[1])
    ) {
      return twoCardComboTypes.RUN + cardSum;
    }
  }

  return cardSum;
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
      cardSets.push([card, card2]); //, card3]);
    }
  }

  return {
    cardSets 
  };
}

const getBestMove = (flagStatus) => {
  // okay best move lets see if position 3 is empty
  const onlyPossibilities = flagStatus
    .filter((e) => e.isPossibility)
    .sort(function (a, b) {
      return b.score - a.score;
    });
  const sureThang = flagStatus
    .filter((e) => !e.isPossibility)
    .sort(function (a, b) {
      return b.score - a.score;
    });

  let bestMove;

  if (sureThang.length) {
    let viableFlags = sureThang.filter((f) => f.score == sureThang[0].score);
    // if flag3 is in viableFlags, place 3
    // else if flag7 is in viableFlags, place 7
    // place 5
    // place 4
    // place 6
    // place 2
    // place 8
    // place 1
    // place 9

    const priorityFlags = [3, 7, 5, 4, 6, 2, 8, 1, 9];
    const flagsToPlay = viableFlags.filter((v) =>
      priorityFlags.includes(v.flag)
    );
    let orderedFlagsToPlay = [];
    priorityFlags.forEach((id) => {
      flagsToPlay.forEach((f) => {
        if (f.flag === id) {
          orderedFlagsToPlay.push(f);
        }
      });
    });
    bestMove = orderedFlagsToPlay[0];
  } else {
    // bestMove = onlyPossibilities[0];
    let viableFlags = onlyPossibilities.filter(
      (f) => f.score == onlyPossibilities[0].score
    );
    const priorityFlags = [3, 7, 5, 4, 6, 2, 8, 1, 9];
    const flagsToPlay = viableFlags.filter((v) =>
      priorityFlags.includes(v.flag)
    );
    let orderedFlagsToPlay = [];
    priorityFlags.forEach((id) => {
      flagsToPlay.forEach((f) => {
        if (f.flag === id) {
          orderedFlagsToPlay.push(f);
        }
      });
    });
    bestMove = orderedFlagsToPlay[0];
  }

  return bestMove;
};


function findBestHand(player, hand, openFlags, moveNumber, gameState) {

  let flagStatus = [];

  openFlags.forEach((flag, index) => {
    //look for best hand available that we can do now on each flag.
    const combos = getCombinations(hand.concat(flag.cards[player]));
    const sets = getCompleteSets(combos, flag.cards[player]);
    const opponentCardsOnFlag = flag.cards[gameState.opposing_player];
    let opponentScore = 0;
    const opponentIsPossibility =
      opponentCardsOnFlag.length === 3 ? false : true;
    //
    // let opponentScore;
    if (opponentCardsOnFlag.length === 3) {
      opponentScore = getCompleteSets({ cardSets: [opponentCardsOnFlag] }, []);
    } else if (opponentCardsOnFlag.length === 2) {
      opponentScore = getTwoCardSets(
        { cardSets: [opponentCardsOnFlag] },
        [],
        gameState
      );
    } else {
      if(opponentCardsOnFlag.length === 0) {
        opponentScore = 0;
      } else {
        opponentScore = parseInt(opponentCardsOnFlag[0].split('')[1]);
      }
    }


    let play;
    if (moveNumber < 15) {
      if (sets[0].score > 300) {
        play = sets[0].cardSet.filter((card) => {
          return hand.includes(card);
        });
        flagStatus.push({
          flag: flag.id,
          play: play,
          score: sets[0].score,
          isPossibility: false,
          opponentCards: opponentCardsOnFlag,
          opponentScore: opponentScore,
          opponentIsPossibility: opponentIsPossibility,
        });
      } else {
        if (flag.cards[player].length < 2) {
          const allCards = flag.cards[player].concat(hand);
          const incompletes = getTwoCombos(hand.concat(flag.cards[player]));
          const incompleteSets = getTwoCardSets(
            incompletes,
            flag.cards[player],
            gameState
          );
          const play = incompleteSets[0].cardSet.filter((card) => {
            return hand.includes(card);
          });
          flagStatus.push({
            flag: flag.id,
            play: play,
            score: incompleteSets[0].score,
            isPossibility: true,
            opponentCards: opponentCardsOnFlag,
            opponentScore: opponentScore,
            opponentIsPossibility: opponentIsPossibility,
          });
        }
      }
    }

    if (moveNumber < 30 && moveNumber >= 15) {
      if (sets[0].score > 200) {
        play = sets[0].cardSet.filter((card) => {
          return hand.includes(card);
        });
        flagStatus.push({
          flag: flag.id,
          play: play,
          score: sets[0].score,
          isPossibility: false,
          opponentCards: [],
          opponentScore: [],
          opponentIsPossibility: false,
        });
      } else {
        if (flag.cards[player].length < 2) {
          const allCards = flag.cards[player].concat(hand);
          const incompletes = getTwoCombos(hand.concat(flag.cards[player]));
          const incompleteSets = getTwoCardSets(
            incompletes,
            flag.cards[player],
            gameState
          );
          const play = incompleteSets[0].cardSet.filter((card) => {
            return hand.includes(card);
          });
          flagStatus.push({
            flag: flag.id,
            play: play,
            score: incompleteSets[0].score,
            isPossibility: true,
            opponentCards: [],
            opponentScore: [],
            opponentIsPossibility: false,
          });
        }
      }
    }

    if (moveNumber < 45 && moveNumber >= 30) {
      if (sets[0].score > 100) {
        play = sets[0].cardSet.filter((card) => {
          return hand.includes(card);
        });
        flagStatus.push({
          flag: flag.id,
          play: play,
          score: sets[0].score,
          isPossibility: false,
          opponentCards: opponentCardsOnFlag,
          opponentScore: opponentScore,
          opponentIsPossibility: opponentIsPossibility,
        });
      } else {
        if (flag.cards[player].length < 2) {
          const allCards = flag.cards[player].concat(hand);
          const incompletes = getTwoCombos(hand.concat(flag.cards[player]));
          const incompleteSets = getTwoCardSets(
            incompletes,
            flag.cards[player],
            gameState
          );
          const play = incompleteSets[0].cardSet.filter((card) => {
            return hand.includes(card);
          });
          flagStatus.push({
            flag: flag.id,
            play: play,
            score: incompleteSets[0].score,
            isPossibility: true,
            opponentCards: opponentCardsOnFlag,
            opponentScore: opponentScore,
            opponentIsPossibility: opponentIsPossibility,
          });
        }
      }
    }

    if (moveNumber >= 45) {
      if (sets[0].score > 0) {
        play = sets[0].cardSet.filter((card) => {
          return hand.includes(card);
        });
        flagStatus.push({
          flag: flag.id,
          play: play,
          score: sets[0].score,
          isPossibility: false,
          opponentCards: opponentCardsOnFlag,
          opponentScore: opponentScore,
          opponentIsPossibility: opponentIsPossibility,
        });
      } else {
        // const allCards = flag.cards[player].concat(hand);
        // const incompletes = getTwoCombos(hand.concat(flag.cards[player]));
        // const incompleteSets = getTwoCardSets(incompletes);
        // const play = incompleteSets[0].cardSet[0];
      }
    }
  });

  return getBestMove(flagStatus);
}

function move(gameState) {
  // Player names. Used as keys into the card dictionary on the flags.
  const player = gameState.active_player;
  const opponent = gameState.opposing_player;


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
  const bestMove = findBestHand(
    player,
    hand,
    openFlags,
    gameState.move_number,
    gameState
  );

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

  return {
    flag_id: selectedFlag.id,
    card: selectedCard,
    claimed_flag_ids: flagsToClaim,
    trash_talk: getTrashTalkLine(gameState),
  };
}

exports.move = move;
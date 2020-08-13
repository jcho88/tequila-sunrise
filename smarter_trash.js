"use strict";

function getTrashTalkLine(gameState) {
  //Select flags claimed by player

  const trashLines = {
    1: "This is going to be a tremendous move!",
    2: "Worst card play of all time. Terrible!",
    3: "That's an awful move, terrible move.",
    4: "Not sure that's you are trying to do but STOP IT! BAD!",
    5: "This move is a GREAT move, believe me.",
    6: "Making a BIGLY claim on that Flag.",
    7: "No collusion here, absolutely no collusion. Looks like I'm WINNING.",
    9: "We're only losing because we test more.",
    10: "We have all the cards. The most cards.",
    11: "This game slaps bro. [Kevin, in case you're wondering, it's a good thing.]",
    12: "WRONG!!!"
  };

  const moveNumber = gameState.move_number;

  const playerClaimedFlags = gameState.flags.filter(
    (f) => f.claimed_by == gameState.active_player
  );

  const opponentClaimedFlags = gameState.flags.filter(
    (f) => f.claimed_by == gameState.opposing_player
  );
const viableTrashLines = [trashLines[12]];

  //firstmove
  if (moveNumber === 1) {
    viableTrashLines.push(trashLines[1]);
  }
  //both players are tied
  else if (playerClaimedFlags.length === opponentClaimedFlags.length) {
    viableTrashLines.push(trashLines[4]);
  }
  //Losing
  else if (playerClaimedFlags.length < opponentClaimedFlags.length) {
    viableTrashLines.push(trashLines[6]);
    viableTrashLines.push(trashLines[9]);
  }
  //Winning
  else if (playerClaimedFlags.length > opponentClaimedFlags.length) {
    viableTrashLines.push(trashLines[2]);
    viableTrashLines.push(trashLines[3]);
    viableTrashLines.push(trashLines[7]);
    viableTrashLines.push(trashLines[11]);
  } else {
      viableTrashLines.push(trashLines[5]);
      viableTrashLines.push(trashLines[10]);
  }

  return viableTrashLines[Math.floor(Math.random() * viableTrashLines.length)]
}

exports.getTrashTalkLine = getTrashTalkLine;
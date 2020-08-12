"use strict";

function getTrashTalkLine(gameState) {
  //Select flags claimed by player

  const trashLines = {
    1: "This is going to be a tremendous move!",
    2: "Worst card play of all time. Terrible!",
    3: "That's an awful move, terrible move",
    4: "Not sure that's you are trying to do but STOP IT!",
    5: "This move is a GREAT move, believe me",
    6: "Making a BIGLY claim on that Flag",
    7: "No collusion here, absolutely no collusion. Looks like I'm WINNING",
  };

  const moveNumber = gameState.move_number;

  const playerClaimedFlags = gameState.flags.filter(
    (f) => f.claimed_by == gameState.active_player
  );

  const opponentClaimedFlags = gameState.flags.filter(
    (f) => f.claimed_by == gameState.opposing_player
  );

  //firstmove
  if (moveNumber === 1) {
    return trashLines[1];
  }
  //both players are tied
  else if (playerClaimedFlags.length === opponentClaimedFlags.length) {
    return trashLines[4];
  }
  //Winning
  else if (playerClaimedFlags.length > opponentClaimedFlags.length) {
    return trashLines[7];
  } else return trashLines[5];
}

exports.getTrashTalkLine = getTrashTalkLine;

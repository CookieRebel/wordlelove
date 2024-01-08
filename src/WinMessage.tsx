import React from "react";
import { IMessageWon } from "./types";

const WinMessage: React.FC<IMessageWon> = ({
  onReset,
  correctWord,
  currentPlayer,
  player1,
  player2,
  player1Score,
  player2Score,
}) => (
  <div className="win-message">
    <div>
      The word is {correctWord}. {currentPlayer} won!
    </div>
    <div>
      Score: {player1}:{player1Score} - {player2}:{player2Score}
    </div>
    <button className={"play-again-button"} onClick={onReset}>
      New Game
    </button>
  </div>
);

export default WinMessage;

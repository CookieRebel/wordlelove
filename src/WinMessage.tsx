import React from "react";
import { IMessageWon } from "./types";

const WinMessage: React.FC<IMessageWon> = ({
  onReset,
  correctWord,
  currentPlayer,
}) => (
  <div className="win-message">
    <div>
      The word is {correctWord}. {currentPlayer} won!
    </div>
    <button className={"play-again-button"} onClick={onReset}>
      Next Game
    </button>
  </div>
);

export default WinMessage;

import React from "react";
import { IMessageWon } from "./types";

const WinMessage: React.FC<IMessageWon> = ({ onReset, currentPlayer }) => (
  <div className="win-message">
    <div>{currentPlayer} won!</div>
    <button className={"play-again-button"} onClick={onReset}>
      Play Again
    </button>
  </div>
);

export default WinMessage;

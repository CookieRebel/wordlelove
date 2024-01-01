import React from "react";
import { IMessage } from "./types";

const WinMessage: React.FC<IMessage> = ({ onReset, correctWord }) => (
  <div className="win-message">
    Congratulations! You've guessed the word {correctWord.toUpperCase()}!
    <button className={"play-again-button"} onClick={onReset}>
      Play Again
    </button>
  </div>
);

export default WinMessage;

import React from "react";
import { IMessage } from "./types";

const WinMessage: React.FC<IMessage> = ({ onReset, correctWord }) => (
  <div className="win-message">
    <div>
      Congratulations! You've guessed the word {correctWord.toUpperCase()}!
    </div>
    <button className={"play-again-button"} onClick={onReset}>
      Play Again
    </button>
  </div>
);

export default WinMessage;

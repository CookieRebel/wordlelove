import React from "react";
import { IMessage } from "./types";

const LostMessage: React.FC<IMessage> = ({ onReset, correctWord }) => (
  <div className="game-lost-message">
    <div className={"correct-word"}>{correctWord.toUpperCase()}</div>
    <button className={"play-again-button"} onClick={onReset}>
      Play Again
    </button>
  </div>
);

export default LostMessage;

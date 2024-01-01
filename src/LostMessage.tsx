import React from "react";
import { IMessage } from "./types";

const LostMessage: React.FC<IMessage> = ({ onReset, correctWord }) => (
  <div className="game-lost-message">
    Sorry, you're out of tries! The word was {correctWord.toUpperCase()}.
    <button className={"play-again-button"} onClick={onReset}>
      Play Again
    </button>
  </div>
);

export default LostMessage;

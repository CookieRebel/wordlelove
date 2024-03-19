import React from "react";
import { IMessageLost } from "./types";

const LostMessage: React.FC<IMessageLost> = ({
  onReset,
  correctWord,
  player1,
  player2,
}) => (
  <div className="lost-message">
    <div>
      {player1} and {player2} lost! The correct word was{" "}
      {correctWord.toUpperCase()}.
    </div>
    <button className={"play-again-button"} onClick={onReset}>
      Play Again
    </button>
  </div>
);

export default LostMessage;

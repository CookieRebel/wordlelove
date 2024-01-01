// PlayerNameInput.tsx

import React from "react";

interface PlayerNameInputProps {
  player1: string;
  player2: string;
  setPlayer1: React.Dispatch<React.SetStateAction<string>>;
  setPlayer2: React.Dispatch<React.SetStateAction<string>>;
  inputStage: string;
  setInputStage: (stage: string) => void;
  onSubmit: (player1: string, player2: string) => void;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({
  player1,
  player2,
  setPlayer1,
  setPlayer2,
  inputStage,
  setInputStage,
  onSubmit,
}) => {
  const handleSubmit = () => {
    if (player1 && player2) {
      onSubmit(player1, player2);
    } else {
      alert("Please enter names for both players");
    }
  };

  return (
    <div className="player-name-input-container">
      {inputStage === "player1" && (
        <input
          type="text"
          placeholder="Player 1 Name"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value.toUpperCase())}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setInputStage("player2");
            }
          }}
          autoFocus
        />
      )}
      {inputStage === "player2" && (
        <input
          type="text"
          placeholder="Player 2 Name"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value.toUpperCase())}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          autoFocus
        />
      )}
    </div>
  );
};

export default PlayerNameInput;

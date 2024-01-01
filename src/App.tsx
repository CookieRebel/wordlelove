import React, { useState } from "react";
import "./App.css";
import CurrentPlayerIndicator from "./CurrentPlayerIndicator";
import PlayerNameInput from "./PlayerNameInput";
import useWordle from "./useWordle";
import GameBoard from "./GameBoard";
import InvalidWordMessage from "./InvalidWordMessage";
import Keyboard from "./Keyboard";
import LostMessage from "./LostMessage";
import WinMessage from "./WinMessage";

const App: React.FC = () => {
  const {
    boardState,
    lettersState,
    shakeTiles,
    gameWon,
    gameLost,
    invalidWord,
    currentTry,
    correctWord,
    currentPlayer,
    resetGame,
    handleKeyPress,
    isGameStarted,
    setIsGameStarted,
  } = useWordle();
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [inputStage, setInputStage] = useState("player1");

  const handlePlayerNameSubmit = (name1: string, name2: string) => {
    setPlayer1(name1);
    setPlayer2(name2);
    setIsGameStarted(true);
  };

  const handlePlayerNameKeyPress = (key: string) => {
    console.log(key);
    if (isGameStarted) return; // Ignore if the game has started

    if (key === "ENTER") {
      if (inputStage === "player1") {
        // Validate Player 1's name
        if (player1) {
          setInputStage("player2");
        } else {
          alert("Please enter a name for Player 1");
        }
      } else if (inputStage === "player2") {
        // Validate Player 2's name
        if (player2) {
          setIsGameStarted(true); // Start the game if Player 2's name is entered
        } else {
          alert("Please enter a name for Player 2");
        }
      }
    } else if (key === "DELETE") {
      // Update the name of the active player
      if (inputStage === "player1") {
        setPlayer1((name) => name.slice(0, -1));
      } else {
        setPlayer2((name) => name.slice(0, -1));
      }
    } else if (/^[A-Z]$/.test(key)) {
      if (inputStage === "player1") {
        setPlayer1((name) => name + key);
      } else {
        setPlayer2((name) => name + key);
      }
    }
  };

  let currentPlayerName = currentPlayer === 1 ? player1 : player2;

  // Render the game board and   keyboard
  return (
    <div className="wordle">
      <div className="wordle-title">Wordle</div>
      <hr />

      <div className="wordle-container">
        {isGameStarted ? (
          <>
            <CurrentPlayerIndicator currentPlayerName={currentPlayerName} />
            {gameWon && (
              <WinMessage
                onReset={resetGame}
                currentPlayer={currentPlayerName}
              />
            )}

            {gameLost && (
              <LostMessage
                onReset={resetGame}
                correctWord={correctWord}
                player1={player1}
                player2={player2}
              />
            )}
            <GameBoard
              boardState={boardState}
              shakeTiles={shakeTiles}
              currentTry={currentTry}
            />

            {invalidWord && <InvalidWordMessage />}
          </>
        ) : (
          <PlayerNameInput
            player1={player1}
            player2={player2}
            setPlayer1={setPlayer1}
            setPlayer2={setPlayer2}
            inputStage={inputStage}
            setInputStage={setInputStage}
            onSubmit={handlePlayerNameSubmit}
          />
        )}
        <Keyboard
          onKeyPress={isGameStarted ? handleKeyPress : handlePlayerNameKeyPress}
          disabled={gameWon}
          lettersState={lettersState}
        />
      </div>
    </div>
  );
};

export default App;

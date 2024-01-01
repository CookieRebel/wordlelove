import React from "react";
import "./App.css";
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
    resetGame,
    handleKeyPress,
  } = useWordle();

  // Render the game board and   keyboard
  return (
    <div className="wordle">
      <div className="wordle-title">Wordle</div>
      <hr />

      <div className="wordle-container">
        {gameWon && (
          <WinMessage onReset={resetGame} correctWord={correctWord} />
        )}

        {gameLost && (
          <LostMessage onReset={resetGame} correctWord={correctWord} />
        )}
        <GameBoard
          boardState={boardState}
          shakeTiles={shakeTiles}
          currentTry={currentTry}
        />

        {invalidWord && <InvalidWordMessage />}

        <Keyboard
          onKeyPress={handleKeyPress}
          disabled={gameWon}
          lettersState={lettersState}
        />
      </div>
    </div>
  );
};

export default App;

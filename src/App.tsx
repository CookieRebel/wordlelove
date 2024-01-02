import React, { useState } from "react";
import "./App.css";
import "./StartScreen.css";
import "./HowToPlay.css";
import HowToPlay from "./HowToPlay";
import StartScreen from "./StartScreen";
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
  } = useWordle();

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isStartScreenVisible, setIsStartScreenVisible] = useState(true);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [inputStage, setInputStage] = useState("player1");
  // State to manage whether the How To Play screen is visible
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleStart = () => {
    setIsStartScreenVisible(false);
  };

  const onHowToPlay = () => {
    setShowHowToPlay(true);
  };

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

  // Function to close the How To Play screen
  const handleCloseHowToPlay = () => {
    setShowHowToPlay(false);
  };

  // Conditional rendering based on the game state
  const renderContent = () => {
    if (!isGameStarted) {
      // Render the player name input screen
      return (
        <>
          <PlayerNameInput
            player1={player1}
            player2={player2}
            setPlayer1={setPlayer1}
            setPlayer2={setPlayer2}
            inputStage={inputStage}
            setInputStage={setInputStage}
            onSubmit={handlePlayerNameSubmit}
          />
          <Keyboard
            onKeyPress={
              isGameStarted ? handleKeyPress : handlePlayerNameKeyPress
            }
            disabled={gameWon}
            lettersState={lettersState}
          />
          ;
        </>
      );
    } else {
      // Render the main game screen
      return (
        <>
          <CurrentPlayerIndicator
            currentPlayerName={currentPlayer === 1 ? player1 : player2}
          />
          {gameWon && (
            <WinMessage
              onReset={resetGame}
              currentPlayer={currentPlayer === 1 ? player1 : player2}
              correctWord={correctWord}
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
          <Keyboard
            onKeyPress={
              isGameStarted ? handleKeyPress : handlePlayerNameKeyPress
            }
            disabled={gameWon}
            lettersState={lettersState}
          />
          ;
        </>
      );
    }
  };

  return (
    <div className="wordle">
      {showHowToPlay && <HowToPlay onClose={handleCloseHowToPlay} />}
      {isStartScreenVisible ? (
        <StartScreen onHowToPlay={onHowToPlay} onPlay={handleStart} />
      ) : (
        <>
          <div className="wordle-title">Wordle</div>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            height="28"
            viewBox="4 4 24 24"
            width="28"
            className="help-icon"
            data-testid="icon-help"
            onClick={onHowToPlay}
          >
            <path
              fill="var(--color-tone-1)"
              d="M14.8333 23H17.1666V20.6667H14.8333V23ZM15.9999 4.33334C9.55992 4.33334 4.33325 9.56001 4.33325 16C4.33325 22.44 9.55992 27.6667 15.9999 27.6667C22.4399 27.6667 27.6666 22.44 27.6666 16C27.6666 9.56001 22.4399 4.33334 15.9999 4.33334ZM15.9999 25.3333C10.8549 25.3333 6.66659 21.145 6.66659 16C6.66659 10.855 10.8549 6.66668 15.9999 6.66668C21.1449 6.66668 25.3333 10.855 25.3333 16C25.3333 21.145 21.1449 25.3333 15.9999 25.3333ZM15.9999 9.00001C13.4216 9.00001 11.3333 11.0883 11.3333 13.6667H13.6666C13.6666 12.3833 14.7166 11.3333 15.9999 11.3333C17.2833 11.3333 18.3333 12.3833 18.3333 13.6667C18.3333 16 14.8333 15.7083 14.8333 19.5H17.1666C17.1666 16.875 20.6666 16.5833 20.6666 13.6667C20.6666 11.0883 18.5783 9.00001 15.9999 9.00001Z"
            ></path>
          </svg>

          <hr />
          <div className="wordle-container">{renderContent()}</div>
        </>
      )}
    </div>
  );
};

export default App;

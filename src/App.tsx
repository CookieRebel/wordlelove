import React, { useEffect, useState } from "react";
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
import { HelpCircle, RotateCcw } from "react-feather";

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
    player1Score,
    player2Score,
    handleGamePlayKeyPress,
    resetScore,
  } = useWordle();

  const [isStartScreenVisible, setIsStartScreenVisible] = useState(true);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [playerNamesReady, setPlayerNamesReady] = useState(false);
  const [inputStage, setInputStage] = useState("player1");
  // State to manage whether the How To Play screen is visible
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  // Retrieve player names from localStorage on initial render
  useEffect(() => {
    const storedPlayer1 = localStorage.getItem("player1");
    const storedPlayer2 = localStorage.getItem("player2");

    if (storedPlayer1) {
      setPlayer1(storedPlayer1);
    }

    if (storedPlayer2) {
      setPlayer2(storedPlayer2);
    }
  }, []);

  useEffect(() => {
    console.log("player1", player1);
    console.log("player2", player2);
    // Save player names to localStorage on change
    localStorage.setItem("player1", player1);
    localStorage.setItem("player2", player2);
  }, [player1, player2]);

  const handleStart = () => {
    setIsStartScreenVisible(false);
  };

  const onHowToPlay = () => {
    setShowHowToPlay(true);
  };

  const handlePlayerNameSubmit = (name1: string, name2: string) => {
    setPlayerNamesReady(true);
  };

  const handlePlayerNameKeyPress = (key: string) => {
    // console.log(key);

    if (key === "ENTER") {
      if (inputStage === "player1") {
        // Validate Player 1's name
        if (player1 !== "") {
          setInputStage("player2");
        } else {
          alert("Please enter a name for Player 1");
        }
      } else if (inputStage === "player2") {
        // Validate Player 2's name
        if (player2 === "") {
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

  const resetAll = () => {
    resetGame();
    setPlayer1("");
    setPlayer2("");
    setPlayerNamesReady(false);
    setIsStartScreenVisible(true);
    setInputStage("player1");
    resetScore();
  };
  // Conditional rendering based on the game state
  const renderContent = () => {
    if (!playerNamesReady) {
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
              player1={player1}
              player2={player2}
              player1Score={player1Score}
              player2Score={player2Score}
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
              playerNamesReady
                ? handleGamePlayKeyPress
                : handlePlayerNameKeyPress
            }
            disabled={gameWon}
            lettersState={lettersState}
          />
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
          <div className="title-row">
            <div className="wordle-title">Wordle For Two</div>
            <div className="wordle-score">
              {playerNamesReady && (
                <>
                  {player1}: {player1Score} - {player2}: {player2Score}
                </>
              )}
            </div>
            <div className={"right-buttons"}>
              <button
                onClick={resetAll}
                title={"Reset Game"}
                className="button"
              >
                <RotateCcw className={"button-icon"} />
              </button>
              &nbsp;
              <button
                onClick={onHowToPlay}
                title={"How To Play"}
                className="button"
              >
                <HelpCircle className={"button-icon"} />
              </button>
            </div>
          </div>
          <hr />
          <div className="wordle-container">{renderContent()}</div>
        </>
      )}
    </div>
  );
};

export default App;

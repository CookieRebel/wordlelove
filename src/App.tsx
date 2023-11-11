import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Words } from "./Words";
import Keyboard from "./Keyboard";
// Define types for our game state
interface Tile {
  letter: string;
  status: "correct" | "present" | "absent" | "default";
}

type BoardState = Tile[][];

const WORD_LENGTH = 5;
const MAX_TRIES = 6;

const App: React.FC = () => {
  // State to store the current guess, all guesses, and the correct word
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [boardState, setBoardState] = useState<BoardState>(
    Array(MAX_TRIES).fill(
      Array(WORD_LENGTH).fill({ letter: "", status: "default" })
    )
  );
  const [correctWord, setCorrectWord] = useState<string>("react"); // This should be randomized
  const [currentTry, setCurrentTry] = useState<number>(0);
  const [lettersState, setLettersState] = useState<{
    [key: string]: "correct" | "present" | "absent" | "default";
  }>({});

  const [gameWon, setGameWon] = useState<boolean>(false);
  const [invalidWord, setInvalidWord] = useState<boolean>(false);
  const [gameLost, setGameLost] = useState<boolean>(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const availableWords = Words;
  const checkWordValidity = async (word: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          // Word not found, so it's not a valid word
          return false;
        }
        console.error("Failed to check word validity");
        return false;
      }
      // If the word exists, the API will return a 200 status
      return true;
    } catch (error) {
      console.error("Error checking word validity:", error);
      return false;
    }
  };

  const getRandomWord = useCallback((): string => {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex].toUpperCase();
  }, [availableWords]); // Dependencies array ensures this is only redefined if availableWords changes

  useEffect(() => {
    setCorrectWord(getRandomWord());
  }, [getRandomWord]);

  useEffect(() => {
    console.log("update board state");

    setBoardState((prevBoardState) => {
      const newBoardState = prevBoardState.map((row, index) => {
        if (index === currentTry) {
          let guessTiles = currentGuess.split("").map(
            (letter): Tile => ({
              letter,
              status: "default",
            })
          );
          guessTiles = guessTiles.concat(
            Array(WORD_LENGTH - guessTiles.length).fill({
              letter: "",
              status: "default",
            })
          );
          return guessTiles;
        }
        return row;
      });
      return newBoardState;
    });
  }, [currentGuess, currentTry]);

  const handleKeyPress = (key: string) => {
    if (key === "ENTER") {
      // Your existing logic to handle enter press
      handleGuessSubmit();
    } else if (key === "DELETE") {
      // Your existing logic to handle backspace
      setCurrentGuess(currentGuess.slice(0, -1));
      setInvalidWord(false);
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      // Your existing logic to handle letter input
      setCurrentGuess(`${currentGuess}${key}`);
      setInvalidWord(false);
    }
  };

  const handleGuessSubmit = async () => {
    if (currentGuess.toUpperCase() === correctWord.toUpperCase()) {
      // The guess is correct, proceed with winning logic
      setGameWon(true);
      submitGuess(); // Update board state with correct guess
    } else {
      // If the guess is not correct, check if the word is valid
      const isValidWord = await checkWordValidity(currentGuess);
      if (isValidWord) {
        // If the word is valid but not the correct word, proceed with the guess
        setInvalidWord(false);
        submitGuess(); // Update board state with the valid guess
      } else {
        // If the word is not valid, notify the user
        setInvalidWord(true);
      }
    }
  };

  // Function to submit a guess
  const submitGuess = () => {
    console.log("submit guess");
    if (gameWon) {
      // The game has already been won, do nothing
      return;
    }
    // Ensure the guess is the correct length
    if (currentGuess.length !== WORD_LENGTH) {
      alert("Guess must be 5 letters");
      return;
    }

    // Check each letter in the guess and assign statuses
    const guessTiles: Tile[] = currentGuess
      .split("")
      .map((letter, index): Tile => {
        if (correctWord[index].toUpperCase() === letter) {
          return { letter, status: "correct" as const }; // Correct position
        } else if (correctWord.toUpperCase().includes(letter)) {
          return { letter, status: "present" as const }; // Wrong position, but present
        } else {
          return { letter, status: "absent" as const }; // Not present in the word at all
        }
      });

    // Update the board state with the new guess
    const newBoardState = [...boardState];
    newBoardState[currentTry] = guessTiles;
    setBoardState(newBoardState);
    console.log("new board state", newBoardState);
    // Reset current guess
    setCurrentGuess("");
    setGameLost(false);

    const newLettersState = { ...lettersState };
    guessTiles.forEach((tile) => {
      if (
        !newLettersState[tile.letter] ||
        newLettersState[tile.letter] === "default"
      ) {
        newLettersState[tile.letter] = tile.status;
      } else if (
        newLettersState[tile.letter] === "present" &&
        tile.status === "correct"
      ) {
        newLettersState[tile.letter] = "correct";
      }
    });
    setLettersState(newLettersState);

    // Move to the next try or handle game over conditions
    if (currentTry === MAX_TRIES - 1) {
      setGameLost(true);
    }
    // Move on to the next try
    setCurrentTry(currentTry + 1);
    setCurrentGuess("");
  };

  // Function to reset the game
  const resetGame = () => {
    // Reset all game states to their initial values
    setBoardState(
      Array(MAX_TRIES).fill(
        Array(WORD_LENGTH).fill({ letter: "", status: "default" })
      )
    );
    setCorrectWord(getRandomWord());
    setCurrentGuess("");
    setCurrentTry(0);
    setGameWon(false);
    setGameLost(false);
    setLettersState({});
  };

  useEffect(() => {
    if (gameWon) {
      setIsCelebrating(true);
      const timeoutId = setTimeout(
        () => setIsCelebrating(false),
        1200 + (WORD_LENGTH - 1) * 100
      );

      return () => clearTimeout(timeoutId); // Cleanup the timeout if the component unmounts
    }
  }, [gameWon]); // Only re-run this effect if gameWon changes

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (invalidWord) {
      timeoutId = setTimeout(() => {
        setInvalidWord(false);
      }, 2000);
    }

    // Cleanup timeout on unmount or if invalidWord changes
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [invalidWord]);

  console.log(correctWord);
  // Render the game board and   keyboard
  return (
    <div className="wordle">
      <div className="wordle-title">Wordle</div>
      <hr />

      <div className="wordle-container">
        {invalidWord && (
          <div className="invalid-word-message">Invalid word</div>
        )}
        {gameWon && (
          <div className="win-message">
            <div>You have won!</div>
            <button className={"play-again-button"} onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}

        {gameLost && (
          <div className="game-lost-message">
            Sorry, you're out of tries! The word was {correctWord.toUpperCase()}
            .
            <button className={"play-again-button"} onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
        <div className="wordle-board">
          {boardState.map((row, rowIndex) => (
            <div key={rowIndex} className="wordle-row">
              {row.map((tile, tileIndex) => (
                <div
                  className={`wordle-tile ${tile.status} ${
                    isCelebrating ? `dance-${tileIndex + 1}` : ""
                  }`}
                >
                  {tile.letter}
                </div>
              ))}
            </div>
          ))}
        </div>
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

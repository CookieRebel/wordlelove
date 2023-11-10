import React, { useState, useEffect } from "react";
import "./App.css";
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
  const [lettersState, setLettersState] = useState<{ [key: string]: string }>(
    {}
  );
  const [gameWon, setGameWon] = useState<boolean>(false);

  useEffect(() => {
    console.log("update board state");
    // This effect updates the board with the current guess
    const newBoardState = boardState.map((row, index) => {
      if (index === currentTry) {
        // Transform the current guess into an array of Tile objects
        let guessTiles = currentGuess.split("").map(
          (letter): Tile => ({
            letter,
            status: "default",
          })
        );
        // Fill the rest of the row with empty tiles if guess is not complete
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
    setBoardState(newBoardState);
  }, [currentGuess, currentTry]); // Depend on currentGuess and currentTry

  const handleKeyPress = (key: string) => {
    if (key === "ENTER") {
      // Your existing logic to handle enter press
      submitGuess();
    } else if (key === "DELETE") {
      // Your existing logic to handle backspace
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      // Your existing logic to handle letter input
      setCurrentGuess(`${currentGuess}${key}`);
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

    // Optionally, you could check if the guess is a valid word here

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

    // Move to the next try or handle game over conditions
    if (currentGuess.toUpperCase() === correctWord.toUpperCase()) {
      // The guess is correct, the game is won
      setGameWon(true);
      setCurrentTry(currentTry + 1);
    } else if (currentTry === MAX_TRIES - 1) {
      // This was the last try, the game is lost
      alert(
        `Sorry, you're out of tries! The word was ${correctWord.toUpperCase()}.`
      );
    } else {
      // Move on to the next try
      setCurrentTry(currentTry + 1);
    }
  };

  // Function to reset the game
  const resetGame = () => {
    // Reset all game states to their initial values
    setBoardState(
      Array(MAX_TRIES).fill(
        Array(WORD_LENGTH).fill({ letter: "", status: "default" })
      )
    );
    setCorrectWord("PLACE"); // Set this to a new word
    setCurrentGuess("");
    setCurrentTry(0);
    setGameWon(false);
  };

  // Render the game board and keyboard
  return (
    <div className="wordle-container">
      <div className="wordle-board">
        {boardState.map((row, rowIndex) => (
          <div key={rowIndex} className="wordle-row">
            {row.map((tile, tileIndex) => (
              <div key={tileIndex} className={`wordle-tile ${tile.status}`}>
                {tile.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Keyboard onKeyPress={handleKeyPress} disabled={gameWon} />
      <div className="win-message">
        {gameWon ? (
          <>
            <div>You have won!</div>
            <button onClick={resetGame}>Play Again</button>
          </>
        ) : (
          <div>Guess the word!</div>
        )}
      </div>
    </div>
  );
};

export default App;

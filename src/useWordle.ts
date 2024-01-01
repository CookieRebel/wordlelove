import { useCallback, useEffect, useState } from "react";
import { ITile } from "./types";
import { Words } from "./Words";

// Define types for our game state
interface Tile {
  letter: string;
  status: "correct" | "present" | "absent" | "default";
}

type BoardState = Tile[][];

const WORD_LENGTH = 5;
const MAX_TRIES = 6;

const useWordle = () => {
  // State to store the current guess, all guesses, and the correct word
  const [currentGuess, setCurrentGuess] = useState("");
  const [boardState, setBoardState] = useState<BoardState>(
    Array(MAX_TRIES).fill(
      Array(WORD_LENGTH).fill({ letter: "", status: "default" })
    )
  );
  const [correctWord, setCorrectWord] = useState("react"); // Randomized in useEffect
  const [currentTry, setCurrentTry] = useState(0);
  const [lettersState, setLettersState] = useState<{
    [key: string]: "correct" | "present" | "absent" | "default";
  }>({});
  const [gameWon, setGameWon] = useState(false);
  const [invalidWord, setInvalidWord] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [shakeTiles, setShakeTiles] = useState(false);

  // Function to get a random word from the Words list
  const getRandomWord = useCallback((): string => {
    const randomIndex = Math.floor(Math.random() * Words.length);
    return Words[randomIndex].toUpperCase();
  }, []);

  useEffect(() => {
    const randomWord = getRandomWord();
    console.log("Correct word", randomWord);
    setCorrectWord(randomWord);
  }, [getRandomWord]);

  // Function to check the validity of a word using an API
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

  const processGuess = useCallback(async () => {
    // Check for game over or invalid guess length
    if (gameWon || gameLost || currentGuess.length !== WORD_LENGTH) {
      return;
    }

    let isWinningGuess = false;

    if (currentGuess.toUpperCase() === correctWord.toUpperCase()) {
      isWinningGuess = true;
      setTimeout(() => {
        setGameWon(true);
      }, 2000); // Delay for win animation
    } else {
      // Validate the word if it's not a winning guess
      const isValidWord = await checkWordValidity(currentGuess);
      if (!isValidWord) {
        setInvalidWord(true);
        setShakeTiles(true);
        setTimeout(() => {
          setShakeTiles(false);
        }, 500);
        return;
      }
    }
    // Process guess tiles and update board and letters state
    const guessTiles: Tile[] = currentGuess.split("").map((letter, index) => {
      if (correctWord[index].toUpperCase() === letter) {
        return { letter, status: "correct" as "correct" }; // Explicitly cast the status
      } else if (correctWord.toUpperCase().includes(letter)) {
        return { letter, status: "present" as "present" }; // Explicitly cast the status
      } else {
        return { letter, status: "absent" as "absent" }; // Explicitly cast the status
      }
    });

    const newBoardState = [...boardState];
    newBoardState[currentTry] = guessTiles;
    setBoardState(newBoardState);

    const newLettersState = { ...lettersState };
    guessTiles.forEach((tile) => {
      newLettersState[tile.letter] = tile.status;
    });
    setLettersState(newLettersState);

    // Update current try and check for game over
    setCurrentTry(currentTry + 1);
    if (currentTry === MAX_TRIES - 1 && !isWinningGuess) {
      setTimeout(() => {
        setGameLost(true);
      }, 2000); // Delay for lose animation
    }

    // Reset current guess
    setCurrentGuess("");
  }, [
    currentGuess,
    correctWord,
    currentTry,
    gameWon,
    gameLost,
    lettersState,
    boardState,
  ]);

  // Function to handle key presses
  const handleKeyPress = (key: string) => {
    if (key === "ENTER") {
      // Your existing logic to handle enter press
      processGuess();
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

  // Function to reset the game
  const resetGame = () => {
    // Reset all game states to their initial values
    setBoardState(
      Array(MAX_TRIES).fill(
        Array(WORD_LENGTH).fill({ letter: "", status: "default" })
      )
    );
    const randomWord = getRandomWord();
    console.log("Correct word", randomWord);
    setCorrectWord(randomWord);
    setCurrentGuess("");
    setCurrentTry(0);
    setGameWon(false);
    setGameLost(false);
    setLettersState({});
  };

  // Effect to update the board state when the current guess changes
  useEffect(() => {
    console.log("update board state");

    setBoardState((prevBoardState) => {
      const newBoardState = prevBoardState.map((row, index) => {
        if (index === currentTry) {
          let guessTiles = currentGuess.split("").map(
            (letter): ITile => ({
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

  // Effect to handle key presses
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        // handle enter
        processGuess();
      } else if (event.key === "Backspace") {
        // handle backspace
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (
        /^[A-Za-z]$/.test(event.key) &&
        currentGuess.length < WORD_LENGTH
      ) {
        // handle letter input
        setCurrentGuess(currentGuess + event.key.toUpperCase());
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess, processGuess]);

  return {
    boardState,
    correctWord,
    currentTry,
    lettersState,
    gameWon,
    invalidWord,
    gameLost,
    shakeTiles,
    handleKeyPress,
    processGuess,
    resetGame,
  };
};

export default useWordle;

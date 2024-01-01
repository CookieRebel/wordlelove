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
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [shakeTiles, setShakeTiles] = useState(false);

  // Function to get a random word from the Words list
  const getRandomWord = useCallback((): string => {
    const randomIndex = Math.floor(Math.random() * Words.length);
    return Words[randomIndex].toUpperCase();
  }, []);

  useEffect(() => {
    const randomWord = getRandomWord();
    console.log("Random word", randomWord);
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

  // Function to submit a guess
  const submitGuess = () => {
    console.log("submit guess");

    // Prevent submission if the game is already won or if the guess is the wrong length
    if (gameWon || currentGuess.length !== WORD_LENGTH) {
      return;
    }

    // Check each letter in the guess and assign color statuses
    const guessTiles: ITile[] = currentGuess
      .split("")
      .map((letter, index): ITile => {
        if (correctWord[index].toUpperCase() === letter) {
          return { letter, status: "correct" as const }; // Correct position
        } else if (correctWord.toUpperCase().includes(letter)) {
          return { letter, status: "present" as const }; // Wrong position, but present
        } else {
          return { letter, status: "absent" as const }; // Not present in the word at all
        }
      });

    // Update the letters state with the new guess
    const newLettersState = { ...lettersState };
    guessTiles.forEach((tile) => {
      newLettersState[tile.letter] = tile.status;
    });
    setLettersState(newLettersState);

    // Check if the current guess is the correct word
    const isWinningGuess =
      currentGuess.toUpperCase() === correctWord.toUpperCase();
    if (isWinningGuess) {
      setGameWon(true);
    }

    // Update the board state with the new guess
    const newBoardState = [...boardState];
    newBoardState[currentTry] = guessTiles;
    setBoardState(newBoardState);

    if (isWinningGuess) {
      // If the guess wins the game, trigger any win animations or actions here
      // For example, set a state to trigger the "dance" animation
      setIsCelebrating(true);
      return; // End function execution after winning
    }

    // Update current try, and check for game over condition
    setCurrentTry(currentTry + 1);
    if (currentTry === MAX_TRIES - 1) {
      setGameLost(true);
    }

    // Reset current guess
    setCurrentGuess("");
  };

  // Function to handle key presses
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

  // Function to handle guess submission
  const handleGuessSubmit = async () => {
    console.log("handleGuessSubmit");
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
        setShakeTiles(true);
        setTimeout(() => {
          setShakeTiles(false);
        }, 500); // Reset after the animation duration  (500ms)
      }
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
    setCorrectWord(getRandomWord());
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
    if (gameWon) {
      setIsCelebrating(true);
      const timeoutId = setTimeout(() => {
        setIsCelebrating(false);
      }, 1200 + (WORD_LENGTH - 1) * 100);

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

  return {
    boardState,
    correctWord,
    currentTry,
    lettersState,
    gameWon,
    invalidWord,
    gameLost,
    isCelebrating,
    shakeTiles,
    handleKeyPress,
    handleGuessSubmit,
    resetGame,
  };
};

export default useWordle;

# Wordle For Two
This is a version of the popular game Wordle modified for 2 players and built by ChatGPT and me. WordleLove is a detailed implementation of the popular word puzzle game Wordle using React and TypeScript. This project demonstrates the use of modern web technologies to create an interactive and engaging user experience.


## How to run

1. Go to the application root directory and type `npm start` in the terminal.
2. A browser tab will open with the game

## Game Rules

### Objective
Two players take turns to guess the Wordle in 6 tries.
- Each guess must be a valid 5-letter word. Hit the enter button to
submit.
- After each guess, the color of the tiles will change to show how
close your guess was to the word.
- Players alternate guesses in one match by passing the keyboard or
phone to the other player. The player whose turn it is is shown at
the top.
- You can play as many matches as you like. Players alternate successive
matches: player 1 starts the first match, player 2 starts the 2nd
match, and so on.
- The total game score is displayed on the top.

### Gameplay
- The secret word is always five letters.
- Players have six attempts to guess it correctly.
- Feedback is given for each guess:
    - **Green Tile**: Correct letter in the right position.
    - **Yellow Tile**: Correct letter but in the wrong position.
    - **Gray Tile**: Incorrect letter.

## Animations and Visual Effects

### Tile Flipping Animation
- **Description**: When a guess is submitted, each letter tile flips to reveal its color based on the guess's accuracy.
- **Implementation**: Combines CSS animations for the flip effect and React's state management to determine the color of each tile post-flip.

### Shake Animation for Invalid Words
- **Trigger**: Occurs when an entered word is invalid.
- **Behavior**: The row of tiles shakes to indicate the need for a new guess.

### Win/Lose Message Display
- **Description**: Upon game completion, messages appear to indicate a win or loss.
- **Effect**: Utilizes a fade-in animation for a smooth appearance of the message.

## `useWordle` Custom Hook

### Functionality
- Manages the game's core logic and state.
- Controls word validation through an external API.
- Handles game progression, including win and loss conditions.

### Keyboard Support
- Captures user input from both the on-screen keyboard and the physical keyboard.
- Synchronizes key presses with the game's logic.

### Word Source
- Words are sourced from a predefined list (`Words` array), with a random selection mechanism for each new game.

### State Management
- Manages various states like the current guess, board state, number of tries, and letter statuses.
- Employs `useCallback` to optimize rendering performance.

## Project Structure and Peculiarities

### Component-Based Structure
- **One File Per Component**: Adopts a modular approach where each React component is defined in its own file, enhancing readability and maintainability.
- Examples include `Tile.tsx` for each letter tile and `Keyboard.tsx` for the on-screen keyboard.

### Centralized Interface Definitions
- **`types.ts` File**: All interfaces and type definitions are centralized in `types.ts`. This approach simplifies the management of types and interfaces across the project.
- Includes definitions for props, state structures, and custom types like `Tile` and `BoardStateType`.

---

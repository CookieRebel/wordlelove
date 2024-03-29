// HowToPlay.tsx

import React from "react";

interface HowToPlayProps {
  onClose: () => void; // Function to close the How To Play screen
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onClose }) => {
  return (
    <div className="how-to-play-overlay">
      <div className="how-to-play-container">
        <div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <h1>How To Play</h1>
        <p>Two players take turns to guess the Wordle in 6 tries.</p>
        <ul>
          <li>
            Each guess must be a valid 5-letter word. Hit the enter button to
            submit.
          </li>
          <li>
            After each guess, the color of the tiles will change to show how
            close your guess was to the word.
          </li>
          <li>
            Players alternate guesses in one match by passing the keyboard or
            phone to the other player. The player whose turn it is is shown at
            the top.
          </li>
        </ul>
        <p>
          You can play as many matches as you like. Players alternate successive
          matches: player 1 starts the first match, player 2 starts the 2nd
          match, and so on.
        </p>
        <p>The total game score is displayed on the top.</p>
        <p>Examples</p>
        <div>
          <span className="letter correct">W</span>
          <span className="letter default">E</span>
          <span className="letter default">A</span>
          <span className="letter default">R</span>
          <span className="letter default">Y</span>
        </div>
        <p className="instruction-text">
          <span className={"bold"}>W</span> is in the word and in the correct
          spot.
        </p>
        <div>
          <span className="letter default">P</span>
          <span className="letter present">I</span>
          <span className="letter default">L</span>
          <span className="letter default">L</span>
          <span className="letter default">S</span>
        </div>
        <p className="instruction-text">
          <span className="bold">I</span> is in the word but in the wrong spot.
        </p>
        <div>
          <span className="letter default">V</span>
          <span className="letter default">A</span>
          <span className="letter default">G</span>
          <span className="letter absent">U</span>
          <span className="letter default">E</span>
        </div>
        <p className="instruction-text">
          <span className="bold">U</span> is not in the word in any spot.
        </p>
      </div>
    </div>
  );
};

export default HowToPlay;

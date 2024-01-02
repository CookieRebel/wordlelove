import React from "react";

interface StartScreenProps {
  onPlay: () => void; // Callback for when the 'Play' button is clicked
  onHowToPlay: () => void; // Callback for when the 'How to Play' button is clicked
}

const StartScreen: React.FC<StartScreenProps> = ({ onPlay, onHowToPlay }) => {
  return (
    <div className="start-screen">
      <div className="start-screen-logo"></div>
      <h1>Wordlelove - A Game for Two</h1>
      <p>Two players together get 6 chances to guess a 5-letter word.</p>
      <div className="button-container">
        <button onClick={onHowToPlay}>How to play</button>
        <button className="play-button" onClick={onPlay}>
          Play
        </button>
      </div>
      <div className="footer">
        <span>Written by ChatGPT and Marc Fasel</span>
      </div>
    </div>
  );
};

export default StartScreen;

import React from "react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  disabled: boolean;
}

const keysRow1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keysRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keysRow3 = ["Z", "X", "C", "V", "B", "N", "M"];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, disabled }) => {
  const renderKey = (key: string) => {
    return (
      <button
        className="wordle-key"
        onClick={() => onKeyPress(key)}
        disabled={disabled}
      >
        {key}
      </button>
    );
  };

  return (
    <div className="wordle-keyboard">
      <div className="wordle-keyboard-row">{keysRow1.map(renderKey)}</div>
      <div className="wordle-keyboard-row">{keysRow2.map(renderKey)}</div>
      <div className="wordle-keyboard-row">
        <button
          className="wordle-key large"
          disabled={disabled}
          onClick={() => onKeyPress("ENTER")}
        >
          ENTER
        </button>
        {keysRow3.map(renderKey)}
        <button
          className="wordle-key large"
          disabled={disabled}
          onClick={() => onKeyPress("DELETE")}
        >
          DEL
        </button>
      </div>
    </div>
  );
};

export default Keyboard;

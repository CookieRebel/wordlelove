import React, { useEffect, useState } from "react";
import { ITileProps } from "./types";

const Tile: React.FC<ITileProps> = ({ tile, tileIndex, isShaking }) => {
  const [prevStatus, setPrevStatus] = useState(tile.status);
  const [shouldFlip, setShouldFlip] = useState(false);
  const [defaultState, setDefaultState] = useState(true);

  useEffect(() => {
    if (tile.status !== prevStatus && tile.status !== "default") {
      setShouldFlip(true);
      setTimeout(() => {
        setDefaultState(false);
      }, 600);
      setTimeout(() => {
        setShouldFlip(false);
      }, 1200);
    }
    if (tile.status === "default") {
      setDefaultState(true);
    }
    setPrevStatus(tile.status);
  }, [tile.status, prevStatus]);

  const flipDelay = 0.1 * tileIndex; // delay between each tile flip

  return (
    <div
      className={`wordle-tile ${defaultState ? "default" : tile.status} ${
        isShaking ? "shake" : ""
      } ${shouldFlip ? "flip" : ""} `}
      style={shouldFlip ? { animationDelay: `${flipDelay}s` } : {}}
    >
      {tile.letter}
    </div>
  );
};

export default Tile;

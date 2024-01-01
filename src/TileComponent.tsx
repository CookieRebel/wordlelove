import React from "react";
import { ITileProps } from "./types";

const Tile: React.FC<ITileProps> = ({
  tile,
  isCelebrating,
  tileIndex,
  isShaking,
}) => (
  <div
    className={`wordle-tile ${tile.status} ${
      isCelebrating ? `dance-${tileIndex + 1}` : ""
    } ${isShaking ? "shake" : ""}`}
  >
    {tile.letter}
  </div>
);

export default Tile;

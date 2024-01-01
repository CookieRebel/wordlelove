import React, { FC } from "react";
import Tile from "./Tile";
import { BoardStateType } from "./types";

interface IGameBoardProps {
  boardState: BoardStateType;
  shakeTiles: boolean;
  currentTry: number;
}

const GameBoard: FC<IGameBoardProps> = (props: IGameBoardProps) => {
  const { boardState, shakeTiles, currentTry } = props;

  return (
    <div className="wordle-board">
      {boardState.map((row, rowIndex) => (
        <div key={"row-" + rowIndex} className="wordle-row">
          {row.map((tile, tileIndex) => (
            <Tile
              key={"tile-" + tileIndex}
              tile={tile}
              tileIndex={tileIndex}
              isShaking={shakeTiles && rowIndex === currentTry}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;

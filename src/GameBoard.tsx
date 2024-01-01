import React, { FC } from "react";
import TileComponent from "./TileComponent";
import { BoardStateType } from "./types";

interface IGameBoardProps {
  boardState: BoardStateType;
  isCelebrating: boolean;
  shakeTiles: boolean;
  currentTry: number;
}

const GameBoard: FC<IGameBoardProps> = (props: IGameBoardProps) => {
  const { boardState, isCelebrating, shakeTiles, currentTry } = props;

  return (
    <div className="wordle-board">
      {boardState.map((row, rowIndex) => (
        <div key={rowIndex} className="wordle-row">
          {row.map((tile, tileIndex) => (
            <TileComponent
              tile={tile}
              isCelebrating={isCelebrating}
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

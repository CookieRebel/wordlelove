export interface ITileProps {
  tile: ITile;
  tileIndex: number;
  isShaking: boolean;
}

export interface IMessageWon {
  onReset: () => void;
  currentPlayer: string;
}

export interface IMessageLost {
  onReset: () => void;
  correctWord: string;
  player1?: string;
  player2?: string;
}

export interface ITile {
  letter: string;
  status: "correct" | "present" | "absent" | "default";
}

export type BoardStateType = ITile[][];

export interface IGameBoardProps {
  boardState: ITile[][];
  isCelebrating: boolean;
  shakeTiles: boolean;
  currentTry: number;
}

export type LettersStateType = {
  [key: string]: "correct" | "present" | "absent" | "default";
};

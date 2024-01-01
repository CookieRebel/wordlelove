import React from "react";

interface CurrentPlayerIndicatorProps {
  currentPlayerName: string;
}

const CurrentPlayerIndicator: React.FC<CurrentPlayerIndicatorProps> = ({
  currentPlayerName,
}) => {
  return (
    <div className="current-player-indicator">{currentPlayerName}'s turn</div>
  );
};

export default CurrentPlayerIndicator;

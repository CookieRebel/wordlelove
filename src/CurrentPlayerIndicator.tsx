import React from "react";

interface CurrentPlayerIndicatorProps {
  currentPlayerName: string;
}

const CurrentPlayerIndicator: React.FC<CurrentPlayerIndicatorProps> = ({
  currentPlayerName,
}) => {
  return (
    <div className="current-player-indicator">{currentPlayerName}'S TURN</div>
  );
};

export default CurrentPlayerIndicator;

import useGameStore from "@/store/useGameStore";
import { useEffect } from "react";

const PlayerOne = () => {
  const gameData = useGameStore((state) => state.gameData);

  return (
    <div className="flex space-x-12 items-center">
      {gameData.playerOne ? (
        <img
          width={100}
          height={100}
          className={`w-[60px] h-[60px] rounded-full object-cover z-10 ${
            gameData.currentStreak === 1 &&
            "border-2 border-opacity-50 border-[#FE8341] shadow-[0px_-5px_10px_2px_rgba(236,118,57,0.3)] drop-shadow-[0px_5px_10px_rgba(235,238,118,0.3)]"
          }`}
          src={gameData.playerOne.avatar}
          alt="p1 avatar"
        />
      ) : (
        <div
          className={`w-[60px] h-[60px] rounded-full bg-jetblack z-10 ${
            gameData.currentStreak === 1 &&
            "border-2 border-opacity-50 border-[#FE8341] shadow-[0px_-5px_10px_2px_rgba(236,118,57,0.3)] drop-shadow-[0px_5px_10px_rgba(235,238,118,0.3)]"
          }`}
        />
      )}

      <p className="text-timberwolf text-3xl font-bold">{gameData.p1Score}</p>
    </div>
  );
};

const PlayerTwo = () => {
  const gameData = useGameStore((state) => state.gameData);

  return (
    <div className="flex space-x-12 items-center">
      <p className="text-timberwolf text-3xl font-bold">{gameData.p2Score}</p>
      {gameData.playerTwo ? (
        <img
          width={100}
          height={100}
          className={`w-[60px] h-[60px] rounded-full object-cover z-10 ${
            gameData.currentStreak === 2 &&
            "border-2 border-opacity-50 border-[#FE8341] shadow-[0px_-5px_10px_2px_rgba(236,118,57,0.3)] drop-shadow-[0px_5px_10px_rgba(235,238,118,0.3)]"
          }`}
          src={gameData.playerTwo.avatar}
          alt="p2 avatar"
        />
      ) : (
        <div
          className={`w-[60px] h-[60px] rounded-full bg-jetblack z-10 ${
            gameData.currentStreak === 2 &&
            "border-2 border-opacity-50 border-[#FE8341] shadow-[0px_-5px_10px_2px_rgba(236,118,57,0.3)] drop-shadow-[0px_5px_10px_rgba(235,238,118,0.3)]"
          }`}
        />
      )}
    </div>
  );
};

const GameHeader = () => {
  return (
    <div className="flex h-[108px] pt-5 mb-5 items-center justify-center space-x-5">
      <PlayerOne />
      <p className="text-timberwolf text-2xl font-bold">:</p>
      <PlayerTwo />
    </div>
  );
};

export default GameHeader;

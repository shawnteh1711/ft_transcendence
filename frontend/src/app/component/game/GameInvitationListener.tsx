import { SocketContext } from "@/app/socket/SocketProvider";
import { UserData } from "@/store/useUserStore";
import { use, useContext, useEffect, useState } from "react";
import game from "../../../../pages/game";
import { GameContext, useGameData } from "./GameContext";
import InvitationPopup from "./InvitationPopup";
import LoadingScreen from "./LoadingScreen";

const GameInvitationListener = () => {
  const { clearGameInvitation, handleInviteGame, gameInvitation } =
    useContext(GameContext);
  const socket = useContext(SocketContext);
  const [showPopup, setShowPopup] = useState(false);
  const {
    setGameState,
    isLoadingScreenVisible,
    player1User,
    player2User,
    roomId,
  } = useGameData();

  useEffect(() => {
    console.log("GameInvitationListener");
    console.log(
      "players from game state",
      player1User,
      player2User,
      isLoadingScreenVisible,
    );

    const handleInvite = (data: { user: UserData; friend: UserData }) => {
      console.log("handleInvite");
      handleInviteGame(data);
    };

    socket?.on("invite-player", handleInvite);
    return () => {
      socket?.off("invite-player", handleInviteGame);
      clearGameInvitation();
    };
  }, [socket]);

  return (
    <>
      {gameInvitation && (
        <InvitationPopup
          user={gameInvitation.user}
          friend={gameInvitation.friend}
          onAccept={gameInvitation.onAccept}
          onDecline={gameInvitation.onDecline}
        />
      )}
      {isLoadingScreenVisible && player1User && player2User && roomId && (
        <LoadingScreen
          player1User={player1User}
          player2User={player2User}
          roomId={roomId}
        />
      )}
    </>
  );
};

export default GameInvitationListener;
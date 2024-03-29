import { SocketContext } from "@/app/socket/SocketProvider";
import { UserData } from "@/store/useUserStore";
import { log } from "console";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface GameContextProps {
  gameState: any;
  setGameState: (state: any) => void;
  gameInvitation: GameInvitationProps | null;
  clearGameInvitation: () => void;
  handleInviteGame: (data: { user: UserData; friend: UserData }) => void;
  isLoadingScreenVisible: boolean;
  setLoadingScreenVisible: (state: boolean) => void;
  player1User: UserData | null;
  player2User: UserData | null;
  setPlayer1User: (user: UserData | null) => void;
  setPlayer2User: (user: UserData | null) => void;
  roomId: string | null;
  setRoomId: (roomId: string | null) => void;
}

export interface GameInvitationProps {
  user: UserData;
  friend: UserData;
  onAccept: () => void;
  onDecline: () => void;
}

interface Temp {
  roomId: String;
}

const defaultGameContext: GameContextProps = {
  gameState: null,
  setGameState: () => {},
  gameInvitation: null,
  clearGameInvitation: () => {},
  handleInviteGame: () => null,
  isLoadingScreenVisible: false,
  setLoadingScreenVisible: () => {},
  player1User: null,
  player2User: null,
  setPlayer1User: () => {},
  setPlayer2User: () => {},
  roomId: null,
  setRoomId: () => {},
};

export const GameContext = createContext<GameContextProps>(defaultGameContext);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<any>(null);
  const [gameInvitation, setGameInvitation] =
    useState<GameInvitationProps | null>(null);
  const socket = useContext(SocketContext);
  const router = useRouter();
  const [isLoadingScreenVisible, setLoadingScreenVisible] = useState(false);
  const [player1User, setPlayer1User] = useState<UserData | null>(null);
  const [player2User, setPlayer2User] = useState<UserData | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const clearGameInvitation = () => {
    setGameInvitation(null);
  };

  const handleInviteGame = (data: { user: UserData; friend: UserData }) => {
    // console.log('Game invitation from', data.user);
    // console.log('Game invitation to', data.friend);
    setGameInvitation({
      user: data.user,
      friend: data.friend,
      onAccept: () => {
        socket?.emit("accept-game-invitation", {
          user: data.user,
          friend: data.friend,
        });
      },
      onDecline: () => {
        socket?.emit("decline-game-invitation", {
          user: data.user,
          friend: data.friend,
        });
        clearGameInvitation();
      },
    });
  };

  useEffect(() => {
    socket?.on("to-loading-screen", (data: any) => {
      setRoomId(data.roomId);
      setLoadingScreenVisible(true);
      setPlayer1User(data.player1User);
      setPlayer2User(data.player2User);
      setGameState(data);
    });
    clearGameInvitation();
  }, [gameState]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        gameInvitation,
        clearGameInvitation,
        handleInviteGame,
        isLoadingScreenVisible,
        setLoadingScreenVisible,
        player1User,
        setPlayer1User,
        player2User,
        setPlayer2User,
        roomId,
        setRoomId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameData = () => useContext(GameContext);

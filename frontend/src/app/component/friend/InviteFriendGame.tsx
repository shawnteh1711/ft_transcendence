import { UserData } from "@/store/useUserStore";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-hot-toast";

interface InviteFriendGameProps {
  user: UserData;
  friend: UserData;
  socket: Socket<any, any> | null;
  isButtonDisabled: boolean;
  setIsButtonDisabled: any;
}

// take in current user, friend user
const InviteFriendGame = ({ user, friend, socket, isButtonDisabled, setIsButtonDisabled}: InviteFriendGameProps) => {

  const [gameStatus, setGameStatus] = useState<any[]>([]);
  const cooldownTime = 60000; // 60 seconds

  useEffect(() => {
    if (friend.id) {
      console.log('fetching game status');
      fetchGameStatus(friend.id);
    }
  }, [friend, socket])

  const fetchGameStatus = async (friendId: number) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_NEST_HOST + "/friend/getGameStatus/" + friendId,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (response.ok) {
        const Data = await response.json();
        setGameStatus(Data);
        return gameStatus;
      }
    } catch (error) {
      // console.log("Error fetching messages data:", error);
    }
  };

  const handleInviteFriendGame = async () => {
    // console.log(`Inviting friend to game`);
    // console.log(`User:`, user);
    // console.log(`Friend:`, friend);
    if (isButtonDisabled == false) {
      await fetchGameStatus(friend.id as number);
      toast.success('Invited friend to game');
      if (gameStatus.length == 0) {
        socket?.emit('invite-game', {
          user: user,
          friend: friend,
        });
      } else {
          toast.error('Game already in progress. Refresh to view');
      }
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, cooldownTime)
    } else {
      toast.error('Please wait before inviting another friend');
    }
  };

  return (
    <>
        <button
          onClick={handleInviteFriendGame}
          className="transition-transform hover:scale-105 hover:bg-slate-950 hover:text-white py-2 px-4 rounded-md"
        >
          <FontAwesomeIcon icon={faGamepad} className="mr-2" />
          Invite
        </button>
    </>
  );
};

export default InviteFriendGame;

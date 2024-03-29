import { SocketContext } from "@/app/socket/SocketProvider";
import UserData from "@/hooks/userData";
import { useContext, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";
import './friend.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import toast from "react-hot-toast";
import ConfirmationModel from "./ConfirmationModel";

interface FriendRequestProps {
  userId: number;
  currUser: any;
  friendRequestArray: { requestId: number, senderId: number, receiverId: number, status: string }[];
  setFriendRequestArray: React.Dispatch<React.SetStateAction<{ requestId: number; senderId: number; receiverId: number; status: string; }[]>>;
  friendRequestStatus: { [key: number]: boolean };
  setFriendRequestStatus: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}

const FriendRequest = ( {userId, currUser, friendRequestArray, setFriendRequestArray, friendRequestStatus, setFriendRequestStatus } : FriendRequestProps) => {

  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  // const userData = UserData();
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (userId) {
      socket?.on('friend-request', handleFriendRequestReceived);
      const storedStatus = sessionStorage.getItem("friendRequestStatus");
      if (storedStatus) {
          setFriendRequestStatus(JSON.parse(storedStatus));
      }
      const storedFriendRequests = sessionStorage.getItem("friendRequestArray");
      if (storedFriendRequests) {
        setFriendRequestArray(JSON.parse(storedFriendRequests));
      }
      fetchFriendRequests();
    }
    return () => {
      socket?.off('friend-request', handleFriendRequestReceived);
    };
  }, [socket, userId]);


  useEffect(() => {
    sessionStorage.setItem("friendRequestStatus", JSON.stringify(friendRequestStatus));
    sessionStorage.setItem("friendRequestArray", JSON.stringify(friendRequestArray));
}, [friendRequestArray, friendRequestStatus]);


  const fetchFriendRequests = async () => {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_HOST}/friend/friend-requests/${userId}`, {
              credentials: 'include',
          });
          if (response.ok) {
              const friendRequests = await response.json() as any[];
              setFriendRequests(friendRequests);
          } else {
              throw new Error('Failed to fetch friend requests');
          }
      } catch (error) {
          console.log('Error fetching friend requests:', error);
      }
  };

  const handleFriendRequestReceived = (friendRequest: any) => {
    setFriendRequests(() => {
      const updatedRequest = [...friendRequest];
      return updatedRequest.sort((a, b) => a.id - b.id);
      // return updatedRequest;
    })    
  };

  const acceptFriendRequest = async (friendRequestId: number, senderId: number, accepterId: number) => {
    try {
      await new Promise<void>((resolve) => {
        const closeModel = () => {
          resolve();
        };
        const confirmAction = () => {
          resolve();
          socket?.emit('accept-friend-request', {
            userId: userId,
            friendRequestId: friendRequestId,
            senderId: senderId,
          });
          setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [accepterId]: false }));
          setFriendRequests((prevFriendRequests) => prevFriendRequests.filter((request) => request.id !== friendRequestId));
        };
        toast(
          <ConfirmationModel
            message="Are you sure you want to accept this friend request?"
            onConfirm={confirmAction}
            onCancel={closeModel}
            confirmMessage="We are friends now!"
            closeMessage="No, I don't want to be friends"
          />
        );
      });
    } catch (error) {
      console.log('Error accepting friend request:', error);
    }
  };

  const declineFriendRequest = async (friendRequestId: number, declinerId: number) => {
    try {
      await new Promise<void>((resolve) => {
        const closeModel = () => {
          resolve();
        };
        const confirmAction = () => {
          resolve();
          socket?.emit('decline-friend-request', {
            userId: userId,
            friendRequestId: friendRequestId,
          });
          setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [declinerId]: false }));
          setFriendRequests((prevFriendRequests) => prevFriendRequests.filter((request) => request.id !== friendRequestId));
        };
        toast(
          <ConfirmationModel
            message="Are you sure you want to decline this friend request?"
            onConfirm={confirmAction}
            onCancel={closeModel}
            confirmMessage="Friend request declined!"
            closeMessage="Cancel decline friend request"
          />
        );
      });
    } catch (error) {
      console.log('Error declining friend request:', error);
    }
  };

  return (
      <div className="friend-request flex-col bg-mydarkgrey rounded-lg text-center">
        <h1 className="font-semibold text-2xl mb-4 text-timberwolf">Friend Requests</h1>
        { friendRequests?.length > 0 ? (
          friendRequests
          // .filter((friendRequest) => friendRequest?.receiver?.id === userData?.id)
          .filter((friendRequest) => friendRequest?.status !== 'friended')
          .map((friendRequest) => (
            <div className="flex items-center gap-10 p-10" key={friendRequest?.id}>
              <div className="h-22 w-20 overflow-hidden">
                <Avatar
                  src={friendRequest?.sender?.avatar}
                  alt="user avatar"
                  width={50}
                  height={50}
                />
             </div>
            <div className="flex-col gap-1">
              <p>Sender: {friendRequest?.sender?.username}</p>
              <p>Status: {friendRequest?.status}</p>
              <div className="flex gap-5 my-5">
                <button onClick={ () => acceptFriendRequest(friendRequest.id, friendRequest.sender.id, friendRequest.receiver.id) }
                disabled={ friendRequest.status === 'friended'}
                className={
                  `transition-transform hover:scale-105 hover:bg-green hover:text-white py-2 px-4 rounded-md
                  ${friendRequest.status === 'friended' || friendRequest.status === 'decline' ? 'disabled-button' : ''}`
                }
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-3"/>Yes
                </button>
                <button onClick={ () => declineFriendRequest(friendRequest.id, friendRequest.receiver.id) }
                disabled={ friendRequest.status === 'decline'}
                className={
                  `transition-transform hover:scale-105 hover:bg-tomato hover:text-white py-2 px-4 rounded-md
                  ${friendRequest.status === 'decline' || friendRequest.status === 'friended'? 'disabled-button' : ''}`
                }
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-3"/>No
                </button>
              </div>
            </div>
          </div>
        ))) : (
          <p className="text-gray-700 py-4">No friend requests received</p>
        )}
      </div>
  );
};

export default FriendRequest;

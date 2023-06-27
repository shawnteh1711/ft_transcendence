import useUserStore from "@/hooks/useUserStore";
import React, { useState, useEffect, RefObject } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface ChangeAccountModalProps {
  isOpen: boolean;
  closeModal: () => void;
  accRef: RefObject<HTMLDivElement>;
}

const ChangeAccountModal = ({
  isOpen,
  closeModal,
  accRef,
}: ChangeAccountModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isNameUpdated, setIsNameUpdated] = useState(false);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleNameUpdate = (inputValue: string) => {
    if (inputValue === "") {
      toast.error("Failed to change name: Name is not allowed to be empty!");
    } else {
      closeModal();
      setIsNameUpdated(true);
      console.log(inputValue);
      const updateUserDto = {
        username: inputValue,
      };
      axios
        .patch(`/users/${userData?.id}`, updateUserDto)
        .then(() => {
          setUserData({ ...userData, username: inputValue });
          toast.success("Name successfully updated!");
        })
        .catch(() => {
          toast.error("Name update failed! Please try again later");
        });
    }
  };

  useEffect(() => {
    if (isOpen === false) setInputValue("");
    setIsNameUpdated(false);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="overlay w-screen h-screen flex items-center justify-center bg-black/75 absolute top-0">
          <div
            className="overlay-content w-[400px] h-[190px] bg-onyxgrey rounded-2xl p-8"
            ref={accRef}
          >
            <h2>
              <p className="text-2xl text-dimgrey">Update name</p>
            </h2>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="New name"
              className="w-full my-3 rounded-md px-2 py-1 bg-jetblack placeholder-dimgrey text-xl text-timberwolf outline-none caret-saffron"
            />
            <button
              className="flex w-full rounded-md px-2 py-1 bg-jetblack justify-center"
              onClick={() => handleNameUpdate(inputValue)}
            >
              <p className="text-xl text-timberwolf">Update</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeAccountModal;

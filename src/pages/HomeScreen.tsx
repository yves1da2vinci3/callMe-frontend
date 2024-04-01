import {
  Avatar,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { FC, useRef, useState } from "react";
import { IoIosCall } from "react-icons/io";
import { Socket } from "socket.io-client";
import generateKey from "../utils/generateKey";
import { useNavigate } from "react-router";
import { FaUpload } from "react-icons/fa";
import notificationService from "../services/NotificationService";

const IMAGE_SIZE = 420;
const IMAGE_URL =
  "https://cdni.iconscout.com/illustration/premium/thumb/friends-calling-via-social-media-platform-4658589-3867958.png?f=webp";

interface HomeScreenProps {
  socket: Socket;
}
export const HomeScreen: FC<HomeScreenProps> = ({ socket }) => {
  const [RoomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userNameModal, setUserNameModal] = useState(true);
  const textInputRef = useRef<HTMLInputElement>(null);
  //  Handle CreateRoom
  const HandlerRoomCreation = (): void => {
    setIsLoading(true);
    const RoomId = generateKey();

    socket.emit("createRoom", {
      userName: userName,
      roomId: RoomId,
    });
    socket.on("feedbackCreatingRoom", (data: { status: string }) => {
      if (data.status === "success") {
        setIsLoading(false);
        navigate(`/room/${RoomId}`);
      }
    });
  };

  const saveUserName = () => {
    if (textInputRef.current !== null) {
      if (textInputRef.current.value === "") {
        notificationService.showErrorNotification("Enter your name");
      } else {
        setUserNameModal(false);
        const userName = textInputRef.current.value;
        localStorage.setItem("userName", userName);
      }
    }
  };

  // Handle Join
  const joinRoom = (): void => {
    setIsLoading(true);
    console.log("click on join button");

    socket.emit("joinRoom", {
      roomId: RoomId,
      userName: localStorage.getItem("userName"),
    });

    socket.on(
      "feedbackJoiningRoom",
      (data: {
        roomId: string;
        askerName: string;
        status: string;
        message: string;
      }) => {
        if (data.roomId === RoomId && data.askerName === userName) {
          if (data.status === "success") {
            setIsLoading(false);
            navigate(`/room/${RoomId}`);
          } else {
            setIsLoading(false);
            notificationService.showErrorNotification(`${data.message}`);
          }
        }
      }
    );
  };

  return (
    <div className=" h-[90vh] relative">
      {/* Modal pour name */}
      <Modal
        title="Name Modal"
        centered
        opened={userNameModal}
        onClose={() => setUserNameModal(false)}
      >
        <Stack>
          <TextInput ref={textInputRef} placeholder={"enter your mane"} />
          <Button
            style={{
              backgroundColor: "#1877f3",
            }}
            onClick={() => saveUserName()}
          >
            sauvergarder
          </Button>
        </Stack>
      </Modal>
      {/* Loader */}
      <LoadingOverlay visible={isLoading} />
      <Group h="100%" justify="center" align="center">
        <Stack align="flex-start">
          <Title>Welcome to the callMe</Title>
          <Text> Free call application to talk with your friend</Text>
          <Group>
            <Button
              onClick={() => HandlerRoomCreation()}
              leftSection={<IoIosCall size={20} color="white" />}
              size="md"
            >
              create a call
            </Button>
            <TextInput
              onChange={(e) => setRoomId(e.target.value)}
              size="md"
              placeholder="enter the callID"
            />
            {RoomId.length !== 0 && (
              <Button
                onCanPlay={() => joinRoom()}
                variant="transparent"
                size="md"
              >
                join a call
              </Button>
            )}
          </Group>
        </Stack>
        {/* Image */}
        <Avatar size={rem(IMAGE_SIZE)} src={IMAGE_URL} />
      </Group>

      <div className="w-full h-[4rem] flex items-center justify-center bg-gray-100">
        <Text>made with love 😍 by yvesdavinci</Text>
      </div>
    </div>
  );
};

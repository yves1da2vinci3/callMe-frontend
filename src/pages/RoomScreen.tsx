import { FC, useEffect, useRef, useState } from "react";
import { Box, Group, Paper, Stack, Title, Text } from "@mantine/core";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { Device } from "mediasoup-client";
import { Socket } from "socket.io-client";
import { useParams } from "react-router";

const paperSize = 450;
const BOX_SIZE = 40;

interface RoomScreenProps {
  socket: Socket;
}

export const RoomScreen: FC<RoomScreenProps> = ({ socket }) => {
  const params = useParams();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (localStream) => {
        if (localVideoRef) {
          localVideoRef.current.srcObject = localStream;
          setLocalStream(localStream);
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);

  const [videoStatus, setVideoStatus] = useState(true);
  const [AudiStatus, setAudiStatus] = useState(true);

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !videoStatus;
      });
      setVideoStatus(!videoStatus);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !AudiStatus;
      });
      setAudiStatus(!AudiStatus);
    }
  };

  return (
    <div className="h-[100vh] flex flex-col p-10 ">
      <Group style={{ alignSelf: "center" }}>
        <Title>RoomID : </Title>
        <Title c={"blue"}>{params.roomId}</Title>
      </Group>
      <Stack justify="center" align="center" flex={1}>
        <Group justify="space-between">
          {/* Local */}
          <Paper
            className="relative"
            p={0}
            style={{
              marginRight: 40,
            }}
            h={paperSize}
            w={paperSize}
          >
            <video
              autoPlay
              loop
              className="h-full w-full"
              ref={localVideoRef}
            />
            <Text
              className="absolute top-4 left-4 m-4"
              size="lg"
              fw={"500"}
              c={"black"}
            >
              you
            </Text>
            <Group className="absolute bottom-0 left-auto self-center">
              <Box
                onClick={() => toggleVideo()}
                className={`flex bg-red-500 cursor-pointer items-center justify-center`}
                h={BOX_SIZE}
                w={BOX_SIZE}
                style={{
                  borderRadius: "999px",
                }}
              >
                {videoStatus ? (
                  <IoVideocamOff color="white" size={20} />
                ) : (
                  <IoVideocam color="white" size={20} />
                )}
              </Box>
              <Box
                onClick={() => toggleAudio()}
                className=" bg-blue-500 flex cursor-pointer items-center justify-center"
                h={BOX_SIZE}
                w={BOX_SIZE}
                style={{
                  borderRadius: "999px",
                }}
              >
                {AudiStatus ? (
                  <AiOutlineAudioMuted color="white" size={20} />
                ) : (
                  <AiOutlineAudio color="white" size={20} />
                )}
              </Box>
            </Group>
          </Paper>
          {/* Remote */}
          <Paper
            className="relative"
            bg={"green"}
            style={{
              marginRight: 40,
            }}
            h={paperSize}
            w={paperSize}
          >
            <video
              autoPlay
              loop
              className="h-full bg-red-100 w-full"
              ref={remoteVideoRef}
            />
            <Text
              className="absolute top-4 left-4 m-4"
              fw={"500"}
              size="lg"
              c={"black"}
            >
              yves lionel
            </Text>
          </Paper>
        </Group>
      </Stack>
    </div>
  );
};

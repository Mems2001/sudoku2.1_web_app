import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import variables from "./variables"; // Import your backend URL

const useSocket = (roomId: string, player: { userId: string; username: string }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(variables.socket_url, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    // Join the room
    newSocket.emit("join-room", { roomId, player });

    // Listen for "player-joined" events
    newSocket.on("player-joined", (updatedPlayers) => {
      console.log("Updated players:", updatedPlayers);
      setPlayers(updatedPlayers);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [roomId, player]);

  return { socket, players };
};

export default useSocket;
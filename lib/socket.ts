import { io } from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_API_HOST}`, {
  transports: ["websocket"],
  //   auth: {
  //     token: "JWT token here",  // kalau mau auth protected socket
  //   },
  reconnection: true, // otomatis reconnect kalau putus
  reconnectionAttempts: 5,
  timeout: 2000, // timeout dalam ms
});

export default socket;

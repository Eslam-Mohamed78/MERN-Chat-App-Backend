import { Server } from "socket.io";

const connectSocket = (server) => {
  // create socket on the express server (app.listen)
  const io = new Server(server, { cors: "*", pingTimeout: 60000 });

  // make socket connection
  io.on("connection", (socket) => {
    // console.log("connected to socketId:", socket.id);

    // when user click chat he will join room chat
    // between him and other user (join is server only concept)
    socket.on("join chat", (roomId) => {
      socket.join(roomId);
      console.log("user joined room:", roomId);
    });

    // recieve message
    socket.on("newMessage", (chat) => {
      // data
      const roomId = chat.chatId._id;
      console.log(roomId);

      // send the message to all room members
      socket.in(roomId).emit("recieveMessage", chat);
    });
  });
};

export default connectSocket;

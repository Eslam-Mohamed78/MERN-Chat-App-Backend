import { Server } from "socket.io";

const connectSocket = (server) => {
  // create socket on the express server (app.listen)
  const io = new Server(server, { cors: "*", pingTimeout: 60000 });

  // make socket connection
  io.on("connection", (socket) => {
    // make room for each user to send message to him
    socket.on("userRoom", (userId)=> {
      socket.join(userId)
    })

    // make room for each chat
    socket.on("join chat", (roomId) => {
      socket.join(roomId);
      console.log(`user: ${socket.id} joined room: ${roomId}`);
    });

    // recieve message
    socket.on("newMessage", (chat) => {
      // data
      const roomId = chat.chatId._id;

      chat.chatId.users?.map((user) => {
        if (user._id === chat.sender._id) return;

        // send the message to a specific user each time
        socket.in(user._id).emit("recieveMessage", chat);
      });
    });
  });
};

export default connectSocket;

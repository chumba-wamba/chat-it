module.exports = {
  socketServer: (io) => {
    io.on("connection", (socket) => {
      socket.emit("roomId-request", `Requesting roomId for ${socket.id}`);

      socket.on("roomId-response", (room, msg) => {
        socket.join(room);
        console.log(`Room id for ${socket.id} id: ${room}`);
      });

      socket.on("chat-message", (room, msg) => {
        console.log(`Message recieved - ${JSON.stringify(msg)}`);
        socket.to(room).broadcast.emit(
          "chat-message-response",
          JSON.stringify({
            randomNumber: Math.random(),
            id: socket.id,
          })
        );
      });

      socket.on("disconnect", (socket) =>
        console.log("User Disconnected from room.")
      );
    });
  },
};

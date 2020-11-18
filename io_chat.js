module.exports = {
  socketServer: (io) => {
    io.on("connection", (socket) => {
      socket.on("button-message", (room, msg) => {
        socket.join(room);
        console.log(room);
        console.log(msg);
        socket.to(room).broadcast.emit("button-message-response", {
          data: "bar",
          id: socket.id,
        });
      });
    });
  },
};

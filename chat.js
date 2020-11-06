var counter = 0;
module.exports = function chatBoilerplate(io) {
  io.on("connection", function (socket) {
    counter += 1;
    if (counter > 2) {
      console.log("cant connect");
    } else {
      console.log("A user connected");
      console.log(`count: ${counter}`);
    }

    socket.on("disconnect", function () {
      counter -= 1;
      console.log("A user disconnected");
    });
  });
};

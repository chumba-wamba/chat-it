const crypto = require("crypto");
const redis = require("redis");
const redisClient = redis.createClient();

var roomId, userName;
module.exports = {
  socketServer: (io) => {
    io.on("connection", (socket) => {
      socket.emit("info-request", `Requesting info for ${socket.id}`);

      socket.on("info-response", (msg) => {
        roomId = msg.roomId;
        userName = msg.userName;
        socket.join(roomId);
        console.log(
          `information for ${socket.id} id => room: ${roomId}; username: ${userName} `
        );

        // Add code for RSA key pair gen and storage
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

        console.log(`added public key for ${userName}`);
        redisClient.set(userName, publicKey);
        socket.emit("private-key-emit", privateKey);
      });

      socket.on("chat-message", (roomId, msg) => {
        console.log(`message recieved - ${JSON.stringify(msg)}`);
        socket.to(roomId).broadcast.emit(
          "chat-message-broadcast",
          JSON.stringify({
            message: msg.message,
            id: socket.id,
          })
        );
      });

      socket.on("public-key-request", (roomId, userName) => {
        console.log("sending public key");
        var publicKey;
        redisClient.get(userName, function (err, reply) {
          console.log(`obtained public key for ${userName}`);
          socket.emit("public-key-response", reply);
        });
      });

      socket.on("disconnect", () =>
        console.log("user disconnected from room.")
      );
    });
  },
};

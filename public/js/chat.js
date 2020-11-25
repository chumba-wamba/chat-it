const socket = io();
button = document.getElementById("send-button");
input = document.getElementById("message-input");
var privateKey;

socket.on("info-request", (msg) => {
  console.log(msg),
    socket.emit("info-response", { roomId: roomId, userName: userName });
});

socket.on("private-key-emit", (key) => {
  // console.log(key);
  privateKey = key;
  console.log("obtained private key");
});

button.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(input.value);
  if (input) {
    socket.emit("public-key-request", roomId, friendName);
    socket.on("public-key-response", (key) => {
      console.log(key);
    });

    socket.emit("chat-message", roomId, {
      chatMessage: `${userName} => ${input.value}`,
      id: socket.id,
    });

    input.value = "";
  }
});

socket.on("chat-message-broadcast", (msg) => {
  console.log(`Message recieved - ${msg}`);
});

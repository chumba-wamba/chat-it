const socket = io();
button = document.getElementById("send-button");
input = document.getElementById("message-input");
chatContainer = document.getElementById("chat-container");
var privateKey;

socket.on("info-request", (msg) => {
  // console.log(msg),
  socket.emit("info-response", { roomId: roomId, userName: userName });
});

socket.on("private-key-emit", (key) => {
  // console.log(key);
  privateKey = key;
  console.log("obtained private key");
});

button.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log(input.value);
  if (input) {
    socket.emit("public-key-request", roomId, friendName);
    socket.on("public-key-response", (key) => {
      console.log(key);
    });

    socket.emit("chat-message", roomId, {
      message: `${userName} => ${input.value}`,
      id: socket.id,
    });
    var tag = document.createElement("p");
    var text = document.createTextNode(`${userName} => ${input.value}`);
    tag.appendChild(text);
    chatContainer.appendChild(tag);
    input.value = "";
  }
});

socket.on("chat-message-broadcast", (msg) => {
  // console.log(`message recieved - ${msg}`);
  var tag = document.createElement("p");
  var text = document.createTextNode(JSON.parse(msg).message);
  tag.appendChild(text);
  chatContainer.appendChild(tag);
});

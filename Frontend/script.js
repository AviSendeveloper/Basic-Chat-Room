const inputMsg = document.getElementById("message");
const room = document.getElementById("room");
const createRoomBtn = document.getElementById("createRoom");
const form = document.getElementById("form");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    displayMessage(`You are connect to server with id: ${socket.id}`);
});

socket.on("joined", ({ connectedId }) => {
    displayMessage(`${connectedId} joined`);
});

socket.on("push-message", ({ pushedMessage }) => {
    console.log("pushedMessage: ", pushedMessage);
    displayMessage(pushedMessage);
});

// Action
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = inputMsg.value;
    if (message === "") return;
    inputMsg.value = "";

    socket.emit("send-message", message, room.value);
    displayMessage(message);
});

createRoomBtn.addEventListener("click", () => {
    const roomName = room.value;
    socket.emit("join-room", roomName, () => {
        displayMessage(`you joined in room: ${roomName}`);
    });
});

function displayMessage(msg) {
    const div = document.createElement("div");
    div.className = "msg-div";
    div.textContent = msg;
    document.getElementById("message-container").append(div);
}

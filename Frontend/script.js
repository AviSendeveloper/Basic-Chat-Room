const inputMsg = document.getElementById("message");

const room = document.getElementById("room");
const createRoomBtn = document.getElementById("createRoom");

const form = document.getElementById("form");

// Action
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = inputMsg.value;
    inputMsg.value = "";
    displayMessage(message);
});

createRoomBtn.addEventListener("click", () => {
    console.log("create room clicked");
});

function displayMessage(msg) {
    const div = document.createElement("div");
    div.textContent = msg;
    document.getElementById("message-container").append(div);
}

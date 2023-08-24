# Basic-Chat-Room

Create basic chat room using node and socket.io

## Events

### Connection

**Backend**

```js
io.on("connection", (socket) => {
    console.log(`A client connect with id: ${socket.id}`);
});
```

**Forntend** \
listen connect

```js
socket.on("connect", () => {
    displayMessage(`You are connect to server with id: ${socket.id}`);
});
```

### Creat Event and Listen

**Backend**

```js
io.on("connection", (socket) => {
    console.log(`A client connect with id: ${socket.id}`);

    // send event
    /*
        io.emit("joined", { connectedId: socket.id });
        this will send 'joined' event to everyone including own/connected client
    */
    socket.broadcast.emit("joined", { connectedId: socket.id });

    // listent event
    socket.on("send-message", (message, room) => {
        if (room === "") {
            socket.broadcast.emit("push-message", { pushedMessage: message });
        } else {
            socket.to(room).emit("push-message", { pushedMessage: message });
        }
    });
});
```

> socket.broadcast.emit() send event to all except own/connected client

**Frontend**

```js
// send event
socket.emit("join-room", roomName, () => {
    displayMessage(`you joined in room: ${roomName}`);
});

// listen event
socket.on("push-message", ({ pushedMessage }) => {
    displayMessage(pushedMessage);
});
```

> Create event and listen event are both directional

### Join room

```js
// frontend
createRoomBtn.addEventListener("click", () => {
    const roomName = room.value;
    socket.emit("join-room", roomName, () => {
        displayMessage(`you joined in room: ${roomName}`);
    });
});

// backend
socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb();
});
```

> We can also pass callback function from client and execute in backend, like previous example

## Backend

```js
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:8080"],
    },
});

io.on("connection", (socket) => {
    console.log(`A client connect with id: ${socket.id}`);

    // emit joined event
    socket.broadcast.emit("joined", { connectedId: socket.id });

    // listent send msg
    socket.on("send-message", (message, room) => {
        if (room === "") {
            socket.broadcast.emit("push-message", { pushedMessage: message });
        } else {
            socket.to(room).emit("push-message", { pushedMessage: message });
        }
    });

    // join room event listen
    socket.on("join-room", (room, cb) => {
        socket.join(room);
        cb();
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listen at ${PORT}`));
```

## Frontend

```js
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
```

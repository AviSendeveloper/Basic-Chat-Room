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

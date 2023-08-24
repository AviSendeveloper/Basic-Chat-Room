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
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listen at ${PORT}`));

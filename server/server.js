const express = require("express");
const path = require("path");
require("./src/config/env");
const http = require("http");
const ws = require("./src/websocket/ws");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

app.use("/chat", require("./src/routes/chat.routes"))
app.use("/auth", require("./src/routes/auth.routes"));

const server = http.createServer(app);
ws.init(server, app);

server.listen(3000, () => {
    console.log("http://localhost:3000");
});
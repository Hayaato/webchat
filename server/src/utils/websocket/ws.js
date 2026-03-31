const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
let wss;
const clients = new Map();
const CONTROLLER = require("../../controllers/chat.controller");

function init(server) {
    if (wss) return wss;

    wss = new WebSocket.Server({ server });

    wss.on("connection", ws => {
        let user = null;

        ws.on("message", async raw => {
            let msg;
            try {
                msg = JSON.parse(raw.toString());
            } catch (e) {
                ws.close();
                return;
            }
            const token = msg.token;
            if (!token) return ws.close();
            const cleanToken = token.replace('Bearer ', '');
            let decoded;
            try {
                decoded = jwt.verify(cleanToken, SECRET);
            } catch (e) {
                ws.send(JSON.stringify({ error: "Token is not valid" }));
                return ws.close();
            }
            user = decoded.login;
            if (msg.type === "get_messages") {
                try {
                    if(clients.has(user)) {
                        ws.close(4000, 'Already connected');
                        return;
                    }

                    const response = await CONTROLLER.getData()
                    clients.set(user, ws);
                    ws.send(JSON.stringify({
                        type: "get_messages",
                        data: response
                    }));
                } catch (err) {
                    console.error("WS → ROUTE:", err.response?.data || err.message);
                    ws.send(JSON.stringify({ error: err.message }));
                }
            } else {
                try {
                    const response = await CONTROLLER.message(msg.text, user)
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: "message",
                                user: response.user,
                                text: response.text,
                                color: response.color,
                                id: response.id
                            }));
                        }
                    });
                } catch (err) {
                    console.error("WS → ROUTE:", err.response?.data || err.message);
                    ws.send(JSON.stringify({ error: err.message }));
                }
            }
        });

        ws.on("close", () => {
            if (user) {
                clients.delete(user);
            }
        });
    });

    return wss;
}

function broadcast(payload) {
    if (!wss) return;
    const data = JSON.stringify(payload);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

function disconnectUser(user) {
    const ws = clients.get(user);
    if (ws) {
        if(sendToUser(user,{type: "disconnect"})) {
            ws.close(4000, "Disconnected by administrator");
            clients.delete(user);
            return true;
        }
    }
    return false;
}
function sendToUser(user, payload) {
    const ws = clients.get(user);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        return true;
    }
    return false;
}

module.exports = { init, broadcast, disconnectUser };
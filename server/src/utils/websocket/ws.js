const WebSocket = require("ws");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
let wss;
const clients = new Map();

function init(server) {
    if (wss) return wss;

    wss = new WebSocket.Server({ server });

    wss.on("connection", ws => {
        let user = null;

        ws.on("message", async raw => {
            const msg = JSON.parse(raw.toString());
            if (msg.type === "get_messages") {
                try {
                    const token = msg.token;
                    if (!token) return ws.close();

                    const cleanToken = token.replace('Bearer ', '');
                    const decoded = jwt.verify(cleanToken, SECRET);
                    user = decoded.login;

                    if(clients.has(user)) {
                        ws.close(4000, 'Already connected');
                        return;
                    }

                    const response = await axios.post(
                        "http://localhost:3000/chat/getData",
                        {},
                        { headers: { Authorization: `Bearer ${cleanToken}` } }
                    );

                    clients.set(user, ws);
                    ws.send(JSON.stringify({
                        type: "get_messages",
                        data: response.data
                    }));
                } catch (err) {
                    console.error("WS → ROUTE:", err.response?.data || err.message);
                    ws.send(JSON.stringify({ error: err.message }));
                }
            } else {
                try {
                    const data = msg;
                    const response = await axios.post(
                        "http://localhost:3000/chat/message",
                        { text: data.text },
                        { headers: { Authorization: `Bearer ${data.token}` } }
                    );

                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: "message",
                                user: response.data.user,
                                text: response.data.text,
                                color: response.data.color
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
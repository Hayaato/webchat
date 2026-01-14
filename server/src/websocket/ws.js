const WebSocket = require("ws");
const axios = require("axios");

function init(server) {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("Клиент подключился");

        ws.on("message", async (msg) => {
            try {
                const data = JSON.parse(msg);
                const response = await axios.post(
                    "http://localhost:3000/chat/message",
                    { text: data.text },
                    {headers: { Authorization: `Bearer ${data.token}`}}
                );

                const message = JSON.stringify(response.data);

                wss.clients.forEach(client => {
                        client.send(message);
                });

            } catch (err) {
                console.error("WS → ROUTE:", err.response?.data || err.message);
                ws.send(JSON.stringify({ error: err.message }));
            }
        });

        ws.on("close", () => console.log("Клиент отключился"));
    });
}

module.exports = { init };

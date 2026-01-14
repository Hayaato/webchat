const WebSocket = require("ws");
const axios = require("axios");

function init(server) {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        ws.on("message", async (raw) => {
            const msg = JSON.parse(raw.toString());
            if (msg.type === "get_messages") {
                try {
                    const token = msg.token;
                    const response = await axios.post(
                        "http://localhost:3000/chat/getData",
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    ws.send(JSON.stringify({
                        type: "get_messages",
                        data: response.data
                    }));
                } catch(err){
                    console.error("WS → ROUTE:", err.response?.data || err.message);
                    ws.send(JSON.stringify({ error: err.message }));
                }
            }
            else
                {
                    try {
                        const data = msg
                        const response = await axios.post(
                            "http://localhost:3000/chat/message",
                            {text: data.text},
                            {headers: {Authorization: `Bearer ${data.token}`}}
                        );

                        const message = JSON.stringify(response.data);

                        wss.clients.forEach(client => {
                            client.send(JSON.stringify({
                                type: "message",
                                user: response.data.user,
                                text: response.data.text
                            }));
                        });
                    } catch (err) {
                        console.error("WS → ROUTE:", err.response?.data || err.message);
                        ws.send(JSON.stringify({error: err.message}));
                    }
                }
        });

        ws.on("close", () => console.log("Клиент отключился"));
    });
}

module.exports = { init };

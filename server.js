const express = require("express");
const server = require("http").createServer();
const app = express();
const port = 3000;
app.use(express.static("public"));

app.get("/ping", (req, res) => res.send("Hello World!"));

server.on("request", app);
server.listen(3000, () => {
  console.log("server is started");
});

/** Begin Web Sockets  */
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log("Clients Connected:", numClients);

  wss.broadcast(`Current Visitors: ${numClients}`);
  if (ws.readyState === ws.OPEN) {
    ws.send("welcome to my server");
  }

  ws.on("close", () => {
    const numClients = wss.clients.size;
    wss.broadcast(`Current Visitors: ${numClients}`);
    console.log("A client has disconnected");
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

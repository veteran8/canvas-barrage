const websocket = require("ws");
const ws = new websocket({ port: 8080 });
const wssArr = [];
wss.on("connection", function connection(ws) {
  wssArr.push(ws);
  wssArr.on("message", function incoming(message) {
    
  });
});

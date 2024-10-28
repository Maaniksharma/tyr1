let ws;
const proto = window.location.protocol === "https" ? "wss" : "ws";
ws = new WebSocket(`${proto}://${window.location.host}`);
ws.onmessage = (event) => {
  console.log(event.data);
};

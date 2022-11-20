const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const timer = {
  time: 30*60,
  players: 3,
  timerlist: [],
  state: "init",
  activePlayer: 0
}

function setup() {
  timer.timerlist = Array(timer.players).fill(timer.time);
}

setup();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/timer.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  io.emit("timer object transfer", timer);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

/*   socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  }); */
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

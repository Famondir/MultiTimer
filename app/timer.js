const { count } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const { setgroups } = require("process");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const timer = {
  time: 30 * 60,
  playerNumber: 3,
  timerlist: [],
  state: "init",
  activePlayer: 0,
  playerList: [],
};

function setup(timer) {
  timer.state = "init";

  if (timer.playerList.length == 0) {
    timer.playerList = Array(timer.playerNumber).fill("Spieler:in");
  } else if (timer.playerList.length < timer.playerNumber) {
    for (let i = 0; i<timer.playerNumber-timer.playerList.length; i++) {
      timer.playerList.push("Spieler:in");
    }
  }

  timer.activePlayer = 0;
  timer.timerlist = Array(timer.playerNumber).fill(timer.time);
}

async function countdown(timer) {
  await new Promise(resolve => setTimeout(resolve, 100));

  while (timer.state=="active") {
      let old = Math.floor(timer.timerlist[timer.activePlayer]);

      timer.timerlist[timer.activePlayer]=timer.timerlist[timer.activePlayer]-0.1;
      let recent = Math.floor(timer.timerlist[timer.activePlayer]);

      if (old > recent) {
        io.emit("player timer display update", [timer.activePlayer, timer.timerlist[timer.activePlayer]]);
        /* console.log("updated time: "+timer.timerlist[timer.activePlayer]); */
      }

      await new Promise(resolve => setTimeout(resolve, 100));
  }
}

function stopTimer() {
  timer.state="paused";
  io.emit("timer status updated", timer.state);
}

function startTimer() {
  timer.state="active";
  io.emit("timer status updated", timer.state);
  countdown(timer);
}

setup(timer);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/timer.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  io.emit("timer object transfer", timer);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("reset timer", () => {
    stopTimer();
    setup(timer);
    io.emit("timer object transfer", timer);
  });

  socket.on("active player changes", (playerID) => {
    console.log("active player changes to " + playerID);
    timer.activePlayer = playerID;
    io.emit("active player changes", playerID);
  });

  socket.on("toogle timer state", () => {
    if (timer.state=="active") {
      stopTimer();
  } else {
      startTimer();
  }
  });

  socket.on("set time", (time) => {
    timer.time = time;
  });

  socket.on("set player number", (playerNumber) => {
    timer.playerNumber = playerNumber;
  });

  socket.on("changed playernames", (playerList) => {
    timer.playerList = playerList;
    io.emit("changed playernames", playerList);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

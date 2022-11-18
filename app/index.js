const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const options = {port: 3700};
httpServer.listen(options);

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
app.use(express.static(__dirname + '/public'));


console.log("Listening on port " + options["port"]);

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: 'welcome to the chat' });
  socket.on('send', function (data) {
      io.sockets.emit('message', data);
  });
});
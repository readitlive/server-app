var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

mongoose.connect('mongodb://readitlive:rilonlymenotme2398@capital.0.mongolayer.com:10030,capital.1.mongolayer.com:10030/readitlive2');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log("YAAAY");
});

app.get('/', function(req, res){
  res.sendFile('index.html',{root: '/root/liveblog/'});
});

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('info', { msg: 'Enjoy the decline' });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});

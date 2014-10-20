var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//require redis adaptor for multiple nodes, in cases of long polling to store in-memory
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

//connecting to remote MongoDB database using Mongoose ORM
var mongoose = require('mongoose');

mongoose.connect('mongodb://readitlive:HR14Rules@proximus.modulusmongo.net:27017/Y8jyguwu');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log("Connected to remote MongoDB database");
});

function find (collec, query, callback, number) {
    mongoose.connection.db.collection(collec, function (err, collection) {
    collection.find(query).limit(number).toArray(callback);
    });
}
//ROUTES FOR OUR API
// -----------------------------------------------------

var router = express.Router();

router.get('/',function(req,res){
     res.sendFile(__dirname + '/public/index.html');
});

router.route('/events')

     //create an event accessible at /api/events/
     .post(function(req, res){

     })
     //get all events from DB limit to 20
     .get(function(req,res){
        console.log("Fetching events");
        find('events',{},function(err,events){
          res.send(events);
        },15);
     });

     //create a new event
router.route('/events/:event_id')
    .get(function(req,res){
      res.sendFile(__dirname + '/public/creator.html');
    });


//register app so all routes will use '/api'

app.use('/api',router);
//----------------------------------------
io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('info', { msg: 'Enjoy the decline' });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

    //recieve client data
  socket.on('client_comment', function(data){
    console.log(data.comment);
    // socket.broadcast.emit('new_comment',{msg : data.comment});
  });

  socket.on('creator_stream', function(data){
    console.log("The Creator sent something", data);
    socket.broadcast.emit('new_comment',{msg: data.comment});
  })
});


//Starting a server on port 3000
http.listen(3000, function(){
  console.log('listening on port 3000');
});

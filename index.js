var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//require redis adaptor for multiple nodes, in cases of long polling to store in-memory
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

//connecting to remote MongoDB database using Mongoose ORM
var mongoose = require('mongoose');

mongoose.connect('mongodb://readitlive:rilonlymenotme2398@capital.0.mongolayer.com:10030,capital.1.mongolayer.com:10030/readitlive2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log("Connected to remote MongoDB database");
});

//ROUTES FOR OUR API
// -----------------------------------------------------

var router = express.Router();

router.get('/',function(req,res){
     res.sendFile('index.html',{root: '/root/liveblog/'});
});

//create a new user
router.route('/signup')

    .post(function(req,res){

    });


//login an existing user
router.route('/login')

    .post(function(req,res){     

     });





//for the events route
router.route('/events')
    
     .get(function(req,res){
      return db.events.find({}).limit(10)

     }
     .post(function(req,res){
        
  

     });	

// for a specific event
router.route('/events/:id'){


}
//register app so all routes will use '/api'
app.use('/api',router);

//----------------------------------------
io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('info', { msg: 'Enjoy the decline' });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

//Starting a server on port 3000
http.listen(3000, function(){
  console.log('listening on port 3000');
});

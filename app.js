var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , Twit = require('twit')
  , io = require('socket.io').listen(server);

var fs = require('fs');

// listen on a l33t port
server.listen(1337);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var credentials;

// read credentials from private.json
fs.readFile('./private.json', function (err, data) {
  if (err) throw err;

  // parse creds from file
  credentials = JSON.parse(data);

  // init Twit
  var T = new Twit({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token: credentials.access_token,
    access_token_secret: credentials.access_token_secret
  })

  // array of terms to track
  var trackList = ['untp it'];

  // open socket connection
  io.sockets.on('connection', function (socket){
    var stream = T.stream('statuses/filter', { track: trackList })
    stream.on('tweet', function (tweet) {
      io.sockets.emit('stream',tweet);
    });
  });

});



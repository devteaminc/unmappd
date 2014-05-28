var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  Twit = require('twit'),
  io = require('socket.io').listen(server);

// listen on port 5000
server.listen(process.env.PORT || 5000);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get(/^(.+)$/, function(req, res) { 
  res.sendfile(__dirname + req.params[0]); 
});

// init Twit
var T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret
});

// array of terms to trackList
var trackList = ['untp it'];

// open socket connection
io.on('connection', function (socket){
  var stream = T.stream('statuses/filter', { track: trackList });
  stream.on('tweet', function (tweet) {
    io.emit('stream',tweet);
  });
});
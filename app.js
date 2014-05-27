var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  Twit = require('twit'),
  io = require('socket.io').listen(server);

// read credentials from private.json
var fs = require('fs');
var data = fs.readFileSync('./private.json');

// listen on a l33t port
server.listen(process.env.PORT || 1337);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get(/^(.+)$/, function(req, res) { 
  res.sendfile(__dirname + req.params[0]); 
});

// parse creds from file
var credentials = JSON.parse(data);

// init Twit
var T = new Twit({
  consumer_key: credentials.consumer_key,
  consumer_secret: credentials.consumer_secret,
  access_token: credentials.access_token,
  access_token_secret: credentials.access_token_secret
});

// array of terms to trackList
var trackList = ['untp it'];

// open socket connection
io.sockets.on('connection', function (socket){
  var stream = T.stream('statuses/filter', { track: trackList });
  stream.on('tweet', function (tweet) {
    io.sockets.emit('stream',tweet);
  });
});
var http = require('http');  
var express = require('express');  
var app = express();  
var Twit = require('twit');  
var server = http.createServer(app).listen(process.env.PORT || 5000);
var io = require('socket.io').listen(server);
var T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret
});

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get(/^(.+)$/, function(req, res) { 
  res.sendfile(__dirname + req.params[0]); 
});

// array of terms to trackList
var trackList = ['untp it'];

// open socket connection
io.on('connection', function (socket){

  // open stream to Twitter
  var stream = T.stream('statuses/filter', { track: trackList });

  // Emitted each time a status (tweet) comes into the stream
  stream.on('tweet', function (tweet) {
    io.emit('stream',tweet);
  });

  // Emitted when a connection attempt is made to Twitter
  stream.on('connect', function (request) {
    console.log('attempting to connect');
  });

  // Emitted when the response is received from Twitter
  stream.on('connected', function (response) {
    console.log('connected');
  });

  // Emitted when a disconnect message comes from Twitter
  stream.on('disconnect', function (disconnectMessage) {
    console.log(disconnectMessage);
  });

  // Emitted each time a limitation message comes into the stream
  stream.on('limit', function (limitMessage) {
    console.log(disconnectMessage);
  });

  // Emitted when a reconnection attempt to Twitter is scheduled - probably been rate limited
  stream.on('reconnect', function (request, response, connectInterval) {
    console.log('reconnect called');
  });
});
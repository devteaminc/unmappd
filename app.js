var http = require('http');  
var express = require('express');  
var app = express();  
var Twit = require('twit');  
var request = require('request');
var cheerio = require('cheerio');
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
var trackList = ['untp beer'];

// open stream to Twitter
var stream = T.stream('statuses/filter', { track: trackList });

// open socket connection
io.on('connection', function (socket){

  // Emitted each time a status (tweet) comes into the stream
  stream.on('tweet', function (tweet) {
    io.emit('stream',tweet);
  });

    // Emitted each time a status (tweet) comes into the stream
  socket.on('photo-found', function (data) {

    var url = data.url;

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){

            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);

            // get image src  
            var imsrc = $("#slide > div.indiv_item > div.photo.photo-container-remove > div > img").attr("src");
            
            // make sure image exists
            request(imsrc, function (err, resp) {

              // if image request returns 200 then send it back 
              if (resp.statusCode === 200) {
                var ValidJSON = JSON.stringify({imsrc: imsrc, id: data.id});
                io.emit('photosend',ValidJSON);
              }
            });
            
        }
    });

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
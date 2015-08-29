var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , Twit = require('twit')
  , io = require('socket.io').listen(server)
  , port = process.env.PORT || 8080
  , fs = require('fs');

  server.listen(port);
  console.log('app running at port' + port)

//routing
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
})

//Keys
var keyarray = fs.readFileSync(__dirname + '/api_key.txt').toString().split(',')
var consumerKey = keyarray[0];
var consumerSecret = keyarray[1];
var accessToken = keyarray[2];
var accessTokenSecret = keyarray[3];

//twitter initiate
var api = new Twit({
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
  access_token: accessToken,
  access_token_secret: accessTokenSecret
})


//stream phrase
var keyword = ['bersih'];

io.sockets.on('connection', function (socket) {
	var stream = api.stream('statuses/filter', {track:keyword})

	stream.on('tweet', function(tweet) {
		console.log(tweet);
		io.sockets.emit('stream',tweet);
	});
});

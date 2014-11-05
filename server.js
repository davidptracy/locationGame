//===========================================================
//=================== HTTP PORTION ==========================
//===========================================================

var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(4000, '0.0.0.0');

console.log("Listening on 4000");

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
	
	// Read index.html
	
	fs.readFile(__dirname + parsedUrl.pathname, 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

//========================================================
//=============== SOCKET.IO PORTION ======================
//========================================================

var io = require('socket.io').listen(httpServer);

var countDownActive = false;

io.sockets.on('connection', function (socket){

	console.log("We have a new client: " + socket.id);

	// receives a random photo from a client
	socket.on('clientLocation', function(locationData){

		console.log("Received client coordinates!");

		var locationBroadcast = [socket.id, locationData];

		socket.broadcast.emit('locationFromServer', locationBroadcast);

	});

	socket.on('disconnect', function(){
		console.log("Client has disconnected!");
	})

});
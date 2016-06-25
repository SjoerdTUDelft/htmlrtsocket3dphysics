 /// <reference path="typings/globals/express-serve-static-core/index.d.ts" />
/// <reference path="typings/globals/express/index.d.ts" />
/// <reference path="typings/globals/node/index.d.ts" />
/// <reference path="typings/globals/serve-static/index.d.ts" />
/// <reference path="typings/globals/socket.io-client/index.d.ts" />
/// <reference path="typings/globals/socket.io/index.d.ts" />


var Players = [];
var PlayerAmount = 0;

var oldTime = new Date().getTime();
var deltaTime = new Date().getTime();

   var 
        gameport        = process.env.PORT || 4004,
        UUID          = require('node-uuid'),
        verbose      = true;

 
var app = require('express')();
var httptemp = require('http');
var http = httptemp.Server(app);
var io = require('socket.io')(http);
var THREE = require('three');
http.listen(gameport, function(){
	StartTime();
	console.log('listening on *:gameport');
});
/* 
var bodyParser     =        require("body-parser");
app.use(bodyParser)

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
*/
app.get('/', function(req, res){
	res.sendFile(__dirname + '/simplest.html',function(err) {
		if(err) {
			console.error(err);
		}	//error
	}); //res.sendFile
}); //app.get /

app.get( '/*' , function( req, res, next ) {

	var file = req.params[0]; 
	//if(verbose) console.log('\t :: Express :: file requested : ' + file);
	res.sendFile( __dirname + '/' + file );
}); //app.get /*

		
io.on('connection', function(socket){
	io.emit('this', { will: 'be received by everyone'});
    console.log(socket.id + ' connected');
	
	//CHAT MESSAGE
	socket.on('chat message', function(msg){
		io.to(1).emit('chat message', msg);
		console.log('message: ' + msg);
    });

	//JOIN REQUEST
	socket.on('join', function(newroom){
		var oldroom = Object.keys(socket.rooms)[0]

		//LEAVING ROOM
		socket.leave(oldroom, function( ) { 
			console.log( '\t' + socket.id + " has left room "  + oldroom);

			//JOINING ROOM
			socket.join(newroom , function()  {
				console.log('\t'+ socket.id + " has joined room "  + newroom);
				io.to(newroom).emit('chat message', socket.id + " has joined "+newroom);
				
				var data = [];
				for(var z in Players) {
					data.push(Players[z].id)
					data.push(Players[z].position);
					data.push(Players[z].quaternion);
					data.push(Players[z].velocity);
					data.push(Players[z].rotVelocity);
				}
				socket.emit("joinedRoom", data);

				addplayer(socket);
				var thisPlayer = [];
				thisPlayer.push(socket.id);
				thisPlayer.push(Players[socket.id].position);
				thisPlayer.push(Players[socket.id].quaternion);
				thisPlayer.push(Players[socket.id].velocity);
				thisPlayer.push(Players[socket.id].rotVelocity);
				socket.broadcast.to(1).emit("newPlayer",thisPlayer);
			})
		})
	});

	//DISCONNECT
	socket.on('disconnect', function(a){
		removeplayer(socket.id);
		console.log(socket.id + ' disconnected');
	});

	//RECEIVING DATA
	socket.on("clientsend", function(data) {
		Players[socket.id].position.copy(data.position);
		Players[socket.id].quaternion._x = data.quaternion._x;
		Players[socket.id].quaternion._y = data.quaternion._y;
		Players[socket.id].quaternion._z = data.quaternion._z;
		Players[socket.id].quaternion._w = data.quaternion._w;
		Players[socket.id].velocity.copy(data.pVelocity);
		Players[socket.id].rotVelocity.copy(data.rVelocity);
	})
	
});

function StartTime() {
	setInterval(function(){
		deltaTime = new Date().getTime() - oldTime;
		oldTime = new Date().getTime();
		sendToClient();
	}, 30);
}

function sendToClient() {
	var data = [];
	for(var z in Players) {
		data.push(Players[z].id)
		data.push(Players[z].position);
		data.push(Players[z].quaternion);
		data.push(Players[z].velocity);
		data.push(Players[z].rotVelocity);
	}
 
	io.to(1).emit("serversend", data);
}

Player = function(sock) {
	this.id = sock.id
	this.position = new THREE.Vector3();
 	this.quaternion = new THREE.Quaternion();
	this.velocity = new THREE.Vector3();
	this.rotVelocity = new THREE.Vector3();
	return this;
}

function addplayer(sock) {
	
	Players[sock.id] = new Player(sock);
	Players[sock.id].position = new THREE.Vector3(2*PlayerAmount-2,0,0);
	PlayerAmount++;
	console.log(PlayerAmount)
}

function removeplayer(socketid) {
	if(Players[socketid]) {
		console.log("removing " + socketid)
		delete Players[socketid];
		PlayerAmount--;
	}
}







/*
window = {};
var lastTime = 0;
var frame_time = 60/1000;
window.requestAnimationFrame = function ( callback ) {
	var currTime = Date.now(), timeToCall = Math.max( 0, frame_time - ( currTime - lastTime ) );
	var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
	lastTime = currTime + timeToCall;
	return id;
};
    


funca = function() {
	console.log(3);

}

window.requestAnimationFrame(funca);
*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var debug = require('debug')('nodewebapp:server');
var http = require('http');
var sms = require('./model/sms');

var user = require('./model/user');
var KAVENEGAR_API_KEY = require('./config/kavenegar');
var SMS_PERMISSION_AUTH_TOKEN = require('./config/token');
var validator = require('validator');
const httpProxy = require('express-http-proxy');
var rn = require('random-number');
var gen = rn.generator({
  min:  999
, max:  10000
, integer: true
})

// Create an express app with websocket support
var app = require('express-ws-routes')();
const userServiceProxy = httpProxy('http://user-registration');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res, next) {

res.sendFile(__dirname + "/index.html");

})

app.get('/verify', function(req, res, next) {

res.sendFile(__dirname + "/index1.html");

})

// Add routes directly to the app... 
app.websocket('/createUser', function(info, cb, next) {
	 console.log(userServiceProxy(req, res, next));
	// `info` is the same as ws's verifyClient
	/*  console.log(
		'ws req from %s using origin %s',
		info.req.originalUrl || info.req.url,
		info.origin
	); 
	console.log(cb); */
	// Accept connections by passing a function to cb that will handle the connected websocket
	 /* cb(function(socket) {
		socket.send('connected!');
	});  */
	
	cb(function(socket) {
		socket.on('message', function(message) {
		/* console.log(msg);
		socket.send(msg); */
		
		message = JSON.parse(message);
		if(message.type=="message"){
			var phone = message.phone;
			var name = message.message;
			
			var otp = gen();
			console.log("otp is: "+otp);
			if(validator.isMobilePhone(phone,'fa-IR') === true){
	
						 KAVENEGAR_API_KEY.VerifyLookup({
								receptor: phone,
								token: otp,
								template: "registerlogin"
							}, function(response, status) {
								console.log(response);
								console.log(status);
								  if(status==200){
									var data = {phone: phone,name: name, otp:otp, sent_time:response[0].date, sms_status:"Sent", sender_number:response[0].sender, messageid:response[0].messageid };
									console.log(data);
									sms.create(data, function(err, data){
										//console.log("created");
										console.log(err);
										console.log(data);
										
										//res.json({"status":"true","Response":"Message sent Successfully"});
										socket.send(JSON.stringify({"status":"true","Response":"Message sent Successfully"}));
									});
								}  
								else{
									//res.json({"status":"false","Response":"Please try again!"});
									socket.send(JSON.stringify({"status":"false","Response":"Please try again!"}));
								}
							}); 
						
			}
			else{
				
				//res.json({"status":"false","Response":"Please enter correct phone number!"});	
				socket.send(JSON.stringify({"status":"false","Response":"Please enter correct phone number!"}));				
			}
			
			
		}
		
	});
	});

});


app.websocket('/verifyOTP', function(info, cb, next) {
	
	cb(function(socket) {
		socket.on('message', function(message) {
		console.log(message);
		//socket.send(message);
		
		message = JSON.parse(message);
		if(message.type=="message"){
			var otp = message.otp;
			
			sms.findOne({"otp":otp}, function(err, result) {
				if (err) throw err;
				if(result!=null){
					var unique_token = gen();
					var data = {phone: result.phone,name: result.name, unique_token:unique_token, date:result.date };
									console.log(data);
									user.create(data, function(err, data){
										//console.log("created");
										console.log(err);
										console.log(data);
										
										//res.json({"status":"true","Response":"Message sent Successfully"});
										socket.send(JSON.stringify({"status":"true","Response":"User Added Successfully."}));
									});
				}
				else{
					socket.send(JSON.stringify({"status":"false","Response":"Wrong OTP."}));
				}
				
				
			  });
			
		} 
		
	});
	});

});



// Skip handlers by calling next(), just like normal routes
app.websocket('/skipped', function(info, cb, next) {
	console.log(info);
	console.log('Skipped!');
	next();
});

// Using app.listen will also create a require('ws').Server
var server = app.listen(3006, function() {
	console.log('Server listening on port 3006...');
});

// The WebSocket server instance is available as a property of the HTTP server
server.wsServer.on('connection', function(socket) {
	console.log('connection to %s', socket.upgradeReq.url);
 /* 	socket.on('message',function(message){
		console.log(message);
		socket.send(message);
	});  */
});

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
var KAVENEGAR_API_KEY = require('./config/kavenegar');
var SMS_PERMISSION_AUTH_TOKEN = require('./config/token');
var validator = require('validator');


var WebSocket = require('ws').Server;

var app = express();
const server = http.createServer(app);
const s = new WebSocket({ server });

s.on('connection',function(ws){
	
	
	ws.on('message', async function(message){
		
		
		message = JSON.parse(message);
		if(message.type=="message"){
			var phone = message.phone;
			var token = message.message;
			
			
			if(validator.isMobilePhone(phone,'fa-IR') === true){
				if(SMS_PERMISSION_AUTH_TOKEN == token){
						 await KAVENEGAR_API_KEY.VerifyLookup({
								receptor: phone,
								token: token,
								template: "registerlogin"
							}, function(response, status) {
								console.log(response);
								console.log(status);
								  if(status==200){
									var data = {receiver_number: phone, SMS_text:token, sent_time:response[0].date, sms_status:"Sent", sender_number:response[0].sender, messageid:response[0].messageid };
									console.log(data);
									sms.create(data, function(err, data){
										//console.log("created");
										console.log(err);
										console.log(data);
										
										//res.json({"status":"true","Response":"Message sent Successfully"});
										ws.send(JSON.stringify({"status":"true","Response":"Message sent Successfully"}));
									});
								}  
								else{
									//res.json({"status":"false","Response":"Please try again!"});
									ws.send(JSON.stringify({"status":"false","Response":"Please try again!"}));
								}
							}); 
				}
				else{
					//res.json({"status":"503-Service Unavailable | Your service is disabled"});
					ws.send(JSON.stringify({"status":"503-Service Unavailable | Your service is disabled"}));
				}		
			}
			else{
				
				//res.json({"status":"false","Response":"Please enter correct phone number!"});	
				ws.send(JSON.stringify({"status":"false","Response":"Please enter correct phone number!"}));				
			}
			
			
		}
		
	});
	
	ws.on('error', () => console.log('errored'));
	
	ws.on('close',function(){
			console.log(ws.personName+" left the chat");
	
	});
	
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function(req, res, next) {

res.sendFile(__dirname + "/index.html");
});

app.get('/viewsms', function(req, res, next) {

	sms.find(function(err, data){
		  res.json({"Response" : data});
	  });
  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
server.listen(3004, function listening() {
  console.log('Listening on %d', server.address().port);
});


module.exports = app;

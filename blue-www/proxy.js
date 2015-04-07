var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var request = require('request')
var app = express()
var count = 1
var recentList = null
var currentServer = null;
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
//client.set("key", "value");
//client.get("key", function(err,value){ console.log(value)});

//client.on('error', function(error)
//{
//	console.log("Error while connecting the socket connection");
//});

//client.set('key', 'value');
//client.get('key', function(err,value)
//{
//	console.log('The value is: ' + value);
//});

// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
 {
 	console.log(client.rpoplpush("servers","servers"));
 	next(); // Passing the request to the next handler in the stack.
 });

app.get('/', function(req, res) {
	client.lrange("servers", 0, 0, function(err,reply){
  		//console.log(reply);
  		var site = 'http://localhost:' + reply
  		console.log(site);
		request(site, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		//console.log(response)
    		res.send(body)
  			}
		})
	})
})

app.get('/get', function(req, res) {
	client.lrange("servers", 0, 0, function(err,reply){
  		//console.log(reply);
  		var site = 'http://localhost:' + reply + '/get'
  		console.log(site);
		request(site, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		//console.log(response)
    		res.send(body)
  			}
		})
	})
})

app.get('/set', function(req, res) {
	client.lrange("servers", 0, 0, function(err,reply){
  		//console.log(reply);
  		var site = 'http://localhost:' + reply + '/set'
  		console.log(site);
		request(site, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		//console.log(response)
    		res.send(body)
  			}
		})
	})
})

app.get('/recent', function(req, res) {
	client.lrange("servers", 0, 0, function(err,reply){
  		//console.log(reply);
  		var site = 'http://localhost:' + reply + '/recent'
  		console.log(site);
		request(site, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		//console.log(response)
    		res.send(body)
  			}
		})
	})
})

app.get('/meow', function(req, res) {
	client.lrange("servers", 0, 0, function(err,reply){
  		//console.log(reply);
  		var site = 'http://localhost:' + reply + '/meow'
  		console.log(site);
		request(site, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		//console.log(response)
    		res.send(body)
  			}
		})
	})
})

app.get('/remove', function(req, res) {
	client.lrange("servers", 0, 0, function(err,reply){
  		//console.log(reply);
  		var site = 'http://localhost:' + reply + '/remove'
  		console.log(site);
		request(site, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		//console.log(response)
    		res.send(body)
  			}
		})
	})
})

var server = app.listen(3007, function () {
   
   var host = server.address().address
   var port = server.address().port
   console.log('Proxy Server', host, port)

   client.lpush("servers",'3003', function(err, reply){
   		if(err)	throw err
   		client.ltrim("servers", 0, 1);
   		//console.log(reply);
   });
   client.lpush("servers",'3004', function(err, reply){
   		if(err) throw err
   		client.ltrim("servers", 0, 1);
   		//console.log(reply);
   });
  
   client.lrange("servers", 0, -1, function(err, reply){
  	//console.log(reply);
 })
})
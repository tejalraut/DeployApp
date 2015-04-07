var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var recentList = null
var args = process.argv.slice(2);
var PORT = args[0];
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

// Hooks to get all visited URLS.
app.use(function(req, res, next) 
 {
	//console.log(count++,req.method, req.url);
	client.lpush("recentList", req.url, function(err, reply){
	client.ltrim("recentList", 0, 4);
  	//console.log(reply);
	});
 	next(); // Passing the request to the next handler in the stack.
 });


 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
      console.log(req.body) // form fields
      console.log(req.files) // form files

      if( req.files.image )
      {
   	   fs.readFile( req.files.image.path, function (err, data) {
    		if (err) throw err;
   	  		var img = new Buffer(data).toString('base64');
   	  		console.log(img);
   	  		client.lpush('image',img);
   		});
   	}
      res.status(204).end()
  }]);

  app.get('/meow', function(req, res) {
  	client.lrange('image',0,0,function(err,items){
		if (err) throw err
		res.writeHead(200, {'content-type':'text/html'});
		items.forEach(function (imagedata) 
		{
		    res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
		});
		res.end();
  		});  	
  })

  app.get('/remove', function(req, res){
  	client.lpop('image', function(err)
  		{
  			if(err)
  				throw err
  		});
  	res.send('Top image is removed');
  })

   app.get('/', function(req, res) {
   res.send('Hello world')
 })

  app.get('/set', function(req, res) {
  	client.set("key", "this message will self-destruct in 10 seconds");
  	client.expire("key", 10);
  	res.send('set function. key is set')
})


 app.get('/get', function(req, res) {
 	var response = null;
 	client.get("key", function(err, value)
	{ 
		if(err)
		{
			throw err
		}
		response = JSON.stringify(value)
		//console.log(response)
		res.send(response)
	});
})

 app.get('/recent', function(req, res) {
 	client.lrange("recentList", 0, -1, function(err, recentList){
  	console.log(recentList); //replies with all strings in the list
  	var response = JSON.stringify(recentList)
 	res.send("Recent sites: " + response)
	})
 })

// HTTP SERVER
var server = app.listen(PORT, function () {

   var host = server.address().address
   var port = server.address().port
   console.log('Example app listening at http://%s:%s', host, port)
 })

/*var server = app.listen(3004, function () {

   var host = server.address().address
   var port = server.address().port
   console.log('Example app listening at http://%s:%s', host, port)
 })*/

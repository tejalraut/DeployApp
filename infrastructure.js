var http      = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;
var request = require("request");
var redis = require('redis');

var GREEN = 'http://127.0.0.1:5060';
var BLUE  = 'http://127.0.0.1:9090';

// to get the commandline value whether to mirror or not.
var args = process.argv.slice(2);
var MIRROR = args[0];
//default instance
var TARGET = BLUE;

//redis clients
var greenRedisClient = redis.createClient(6379, '127.0.0.1', {});
var blueRedisClient = redis.createClient(6380, '127.0.0.1', {});

var infrastructure =
{
  setup: function()
  {
    // Proxy.
    var options = {};
    var proxy   = httpProxy.createProxyServer(options);

    var server  = http.createServer(function(req, res){
      console.log(req.url);
      if(req.url =='/switch')
      {
        if(TARGET == BLUE)
          {
            TARGET = GREEN;
            console.log("Green client");

            blueRedisClient.lrange("BimageQueue",0,-1,function(err,value){
                  value.forEach(function(image){
                    greenRedisClient.lpush("GimageQueue",image);
                  });
            });
          }

        else
          {
            TARGET = BLUE;
            console.log("Blue client");
            greenRedisClient.lrange("BimageQueue",0,-1,function(err,value){
                  value.forEach(function(image){
                    blueRedisClient.lpush("GimageQueue",image);
                  });
            });
          }
      }
      
      if(MIRROR == 'true' && req.url == '/upload')
      { 
        if(TARGET == BLUE )
        {
          req.pipe(request.post(GREEN+'/upload'));
          proxy.web( req, res, {target: TARGET } );
        }
            
        else
        {
          req.pipe(request.post(BLUE+'/upload'));
          proxy.web( req, res, {target: TARGET } );
        }
      }
      
      else
      {
        proxy.web( req, res, {target: TARGET } );
        console.log("server working");
        console.log(TARGET);
      }
  });
    server.listen(8181);

    // Launch green slice
    exec('forever start blue-www/main.js 9090');
    console.log("blue slice");

    // Launch blue slice
    exec('forever start green-www/main.js 5060');
    console.log("green slice");

//setTimeout
//var options = 
//{
//  url: "http://localhost:8080",
//};
//request(options, function (error, res, body) {
  },

  teardown: function()
  {
    exec('forever stopall', function()
    {
      console.log("infrastructure shutdown");
      process.exit();
    });
  },
}

infrastructure.setup();

// Make sure to clean up.
process.on('exit', function(){infrastructure.teardown();} );
process.on('SIGINT', function(){infrastructure.teardown();} );
process.on('uncaughtException', function(err){
  console.log(err);
  infrastructure.teardown();} );

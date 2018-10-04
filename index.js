/*
root file for the API
*/

//dependecncies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require('fs');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

// Instantiate httpserver
var httpServer = http.createServer(function(req,res){
  unifiedserver(req,res);
});


//server listens on port httpPort
httpServer.listen(config.httpPort,function(){
  console.log("The server is now listening on :",config.httpPort);
});

// Instantiate httpserver
var httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/key-cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedserver(req,res);
});


//server listens on httpsPort
httpsServer.listen(config.httpsPort,function(){
  console.log("The server is now listening on :",config.httpsPort);
});

//unified server for both http and https
var unifiedserver = function(req,res){

  // Get url and parse
  var parsedUrl = url.parse(req.url,true);

  // get path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'')

  // get query string as object
  var queryString = parsedUrl.query;

  // get HTTP method
  var method = req.method.toLowerCase();

  // get header
  var headers = req.headers;

  // get payload
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data',function(data){
    buffer += decoder.write(data);
  });
  req.on('end',function(data){
    buffer += decoder.end();

    //choose the handler
    var chosenhandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;

    //data to sent to handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryString' : queryString,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer),
    }

    chosenhandler(data,function(statusCode,payload){
      // use handler status code or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      //use the payload from handler or send empty object
      payload = typeof(payload) == 'object' ? payload : {};

      var payloadString = JSON.stringify(payload);
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });


  });

};



// request router
var router = {
  'sample': handlers.sample,
  'ping' : handlers.ping,
  'hello': handlers.hello,
  'users' : handlers.users
}

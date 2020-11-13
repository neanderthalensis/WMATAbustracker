const http = require('http');
const fs = require('fs')
const request = require('request');
const { Client } = require('pg');


var port = process.env.PORT || 5000;

let handleRequest = (req, res) => {

	fs.readFile("index.html", function(err, data){
   	if(err){
      response.writeHead(404);
      response.write("Not Found!");
   }
   else{
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
   }
   response.end();
});

};

http.createServer(handleRequest).listen(port);
const http = require('http'); 
const request = require('request');

	console.log("hola")

var port = process.env.PORT || 5000; 
http.createServer(function(req,res){ // creates a server
    res.writeHead(200,{'Content-type':'text/plain'}); //Specifies that the respones "hello" is a text
    res.end("hello"); 
    console.log("hihihih")
}).listen(port); // attaches this server to the port no.
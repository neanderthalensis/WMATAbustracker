const http = require('http');
const fs = require('fs')
const request = require('request');
const { Client } = require('pg');


var port = process.env.PORT || 5000; 
http.createServer(function(req,res){ // creates a server
	res.writeHead(200,{'Content-type':'text/html'}); //Specifies that the respones "hello" is a text
	fs.readFile('./index.html', null, function (err, data) {
    if (err) {
        res.writeHead(404);
        res.write('The page is nowhere to be found.');
    } else {
        res.write(data);
    }
    res.end(); 
}).listen(port); 


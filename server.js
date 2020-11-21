// Require express and create an instance of it
var express = require('express');
var app = express();

var port = process.env.PORT || 5000;

// on the request to root (localhost:3000/)
app.get(port, function (req, res) {
    res.send('<b>My</b> first express http server');
});


// On localhost:3000/welcome
app.get('/welcome', function (req, res) {
    res.send('<b>Hello</b> welcome to my http server made with express');
});

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});



/*const http = require('http');
const fs = require('fs')
const request = require('request');
const { Client } = require('pg');


var port = process.env.PORT || 5000;

var handleRequest = (req, res) => {
	var url = req.url
	if(url.includes("index.css")){
		fs.readFile("index.css", function(err, data){
		if(err){}
		else{
			res.writeHead(200, {'Content-Type': 'text/css'});
			res.write(data);
		}
		res.end();
		});
	}
	else if(url.includes("showit.js")){
		fs.readFile("showit.js", function(err, data){
		if(err){}
		else{
			res.writeHead(200, {'Content-Type': 'text/javascript'});
			res.write(data);
		}
		res.end();
		});
	}
	else{
		fs.readFile("index.html", function(err, data){
   		if(err){
			res.writeHead(404);
			res.write("Not Found!");
    	}
    	else{
			res.writeHead(200, {'Content-Type': 'text/html'});
		  	res.write(data);
    	}
    	res.end();
    });
	}
};

http.createServer(handleRequest).listen(port);
*/
const http = require('http');
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
			res.writeHead(200, {'Content-Type': 'text/html'});
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
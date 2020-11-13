const http = require('http');
const fs = require('fs')
const request = require('request');
const { Client } = require('pg');


var port = process.env.PORT || 5000;


let handleRequest = (req, res) => {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./index.html', null, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.write('Whoops! File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });
};
 
http.createServer(handleRequest).listen(port);
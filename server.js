const http = require('http'); //loads the library to enable it to act as a server
var port = process.env.PORT || 5000; //specifies the port no to whatever heroku gives or 5000 on local host
http.createServer(function(req,res){ // creates a server
    res.writeHead(200,{'Content-type':'text/plain'}); //Specifies that the respones "hello" is a text
    res.end("hello"); //shows the text "hello" on th eweb page
}).listen(port); // attaches this server to the port no.
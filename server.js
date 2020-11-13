const http = require('http'); 
const request = require('request');
const { Client } = require('pg');

function getBus(bus, key){
	var imp1 = 'https://api.wmata.com/Bus.svc/json/jBusPositions?RouteID='+bus+'&api_key='+key
	return new Promise(function(resolve, reject){
		request.get(//does the request
		imp1, {json: true}, (err, res, body) =>{
			if (err) {reject(err);}
			else {resolve(body)};
})});
}

(async () => {

const client = await new Client({ //connects to the database
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
});

var port = process.env.PORT || 5000; 
http.createServer(function(req,res){ // creates a server
	client.connect();

	var bla = await getBus('C4', 'b259cbc5f9a34a0da7192b3679918b79')
	var qimp =  "INSERT INTO bus(ts, json) VALUES($1, $2) RETURNING *"
	var qvals = [new Date(), bla]
	client.query(qimp, qvals)

	console.log("I did it!")


	res.writeHead(200,{'Content-type':'text/plain'}); //Specifies that the respones "hello" is a text
	res.end("hello"); 

}).listen(port); // attaches this server to the port no.
})()

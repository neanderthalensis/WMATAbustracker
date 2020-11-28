const http = require('http'); 
const request = require('request');
const { Client } = require('pg');

function getBus(bus, key){ // does the request
	var imp1 = 'https://api.wmata.com/Bus.svc/json/jBusPositions?RouteID='+bus+'&api_key='+key
	return new Promise(function(resolve, reject){
		request.get(//does the request
		imp1, {json: true}, (err, res, body) =>{
			if (err) {reject(err);}
			else {resolve(body)};
})});
}

var update = async function(){
	const client = await new Client({ //connects to the database
  		connectionString: process.env.DATABASE_URL,
  		ssl: {rejectUnauthorized: false}
	});

	client.connect();
	var bla = await getBus('C4', process.env.API_KEY)
	var qimp =  "INSERT INTO bus(ts, json) VALUES($1, $2) RETURNING *"
	var qvals = [new Date(), bla]
	await client.query(qimp, qvals) // inserts new info into the database
	var qimp2 = "DELETE FROM bus WHERE ts < $1"
	var qvals2 = [new Date(new Date()-86400000)]
	await client.query(qimp2, qvals2) // removes old stuff
	client.end()
	console.log("I did it!") // spams the logs

}

setInterval(update, 30000) // repeats every 30 seconds...
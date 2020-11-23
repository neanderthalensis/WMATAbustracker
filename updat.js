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

	client.connect();
	for(i=0;i<118;i++){
		var bla = await getBus('C4', process.env.API_KEY)
		var qimp =  "INSERT INTO bus(ts, json) VALUES($1, $2) RETURNING *"
		var qvals = [new Date(), bla]
		client.query(qimp, qvals)
		var qimp2 = "DELETE FROM bus WHERE ts < $1"
		var qvals2 = [new Date(new Date()-86400000)]
		client.query(qimp2, qvals2)
		console.log("I did it!")
		await new Promise(resolve => setTimeout(resolve, 30000));
	}
})()


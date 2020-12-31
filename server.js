// Require express and create an instance of it
const express = require('express');
const app = express();
const path = require('path')
const Client = require("pg").Pool;
const request = require('request');
const cors = require('cors');


const client = new Client({ //connects to the database
	connectionString: process.env.DATABASE_URL,
	ssl: {rejectUnauthorized: false}
});


const port = process.env.PORT || 5000;
const key = process.env.API_KEY || 'b259cbc5f9a34a0da7192b3679918b79';


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, () => console.log(`Dat port is ${port}!`));


app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/route/:r", (req, res) => { // just passes it along
  const r = req.params.r
  var imp1 = 'https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=' + r + '&api_key='+key
  request(imp1).pipe(res)
});

app.get("/api/routes", (req, res) => { // just passes it along
  var imp1 = 'https://api.wmata.com/Bus.svc/json/jRoutes?api_key='+key
  request.get(imp1, {json:true},(err, res) => {
    if (err){request('https://api.wmata.com/Bus.svc/json/jRoutes?Date=2020-12-30&api_key='+key).pipe(res)}
    else{.pipe(res)}
  })
  
});


app.get("/api/bus/:r", async (req, res) => { // gets stuff from database
  const r = req.params.r
  var imp1= "SELECT ts AS ts, elem->'RouteID' AS routeid, elem->'Deviation' AS deviation, elem->'Lat' AS lat, elem->'Lon' AS lon, elem->'DirectionNum' AS directionnum, elem->'TripID' AS tripid FROM bus, json_array_elements(jsonb::json -> 'BusPositions') elem WHERE elem ->>'RouteID'=$1;"
  var hey = await client.query(imp1, [r])
  res.status(200).json(hey.rows)
});


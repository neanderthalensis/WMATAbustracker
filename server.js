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
const key = process.env.API_KEY;


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
  request(imp1).pipe(res)
});


app.get("/api/bus/:r&:f&:t&:th&:thh", async (req, res) => { // gets stuff from database

  console.log(r)
  const r = req.params.r.replaceAll("%", "/")
  const f = req.params.f
  const t = new Date(new Date()-req.params.t)
  const th = req.params.th
  const thh = req.params.thh
  var imp1=`SELECT 
  ts AS ts, 
  elem->'RouteID' AS routeid,
  elem->'Deviation' AS deviation,
  elem->'Lat' AS lat,
  elem->'Lon' AS lon,
  elem->'DirectionNum' AS directionnum,
  elem->'TripID' AS tripid 
FROM (
  SELECT * 
  FROM (
    SELECT 
      ts AS ts,
      jsonb AS jsonb, 
      ROW_NUMBER() OVER (ORDER BY ts) AS row 
    FROM bus
    ) 
  t WHERE t.row % $2 = 0 AND ts >= $3 AND $4 <= EXTRACT(hour FROM ts) AND $5 >= EXTRACT(hour FROM ts)
) bla,
json_array_elements(jsonb::json -> 'BusPositions') elem
WHERE elem ->>'RouteID'=$1;`
  var hey = await client.query(imp1, [r, f, t, th, thh])
  res.status(200).json(hey.rows)
});


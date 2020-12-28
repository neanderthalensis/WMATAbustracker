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
  imp1 = 'https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=' + r + '&api_key='+key
  request(imp1).pipe(res)
});

app.get("/api/routes", (req, res) => { // just passes it along
  imp1 = 'https://api.wmata.com/Bus.svc/json/jRoutes?api_key='+key
  request(imp1).pipe(res)
});


app.get("/api/bus/:r", (req, res) => { // gets stuf from database
  const r = req.params.r
  client.query("SELECT ts,json_array_elements(json->'BusPositions')->'Deviation' AS Deviation, json_array_elements(json->'BusPositions')->'Lat' AS Lat, json_array_elements(json->'BusPositions')->'Lon' AS Lon, json_array_elements(json->'BusPositions')->'RouteID' AS RouteID, json_array_elements(json->'BusPositions')->'DirectionNum' AS DirectionNum, json_array_elements(json->'BusPositions')->'TripID' AS TripID FROM bus;",
    (error, results) => {
      console.log("hi")
      res.status(200).json(
        results.rows.filter((d) => {return d.routeid == r})
        );
    }
  );
});


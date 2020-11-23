// Require express and create an instance of it
const express = require('express');
const app = express();
const path = require('path')
const Client = require("pg").Pool;
const request = require('request');


const client = new Client({ //connects to the database
	connectionString: process.env.DATABASE_URL,
	ssl: {rejectUnauthorized: false}
});


const port = process.env.PORT || 5000;
const key = process.env.API_KEY

app.listen(port, () => console.log(`Listening on port ${port}!`));


app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/route", (req, res) => {
  const { line } = req.params;
  imp1 = 'https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=C4&api_key='+key
  request.get(imp1, {json:true}, (err, res, body) => {
      if (err) {reject(err)}
      else {body};
  }
    )
});

app.get("/api/bus", (req, res) => {
  const { line } = req.params;
  client.query("SELECT ts,json_array_elements(json->'BusPositions')->'Deviation' AS deviation, json_array_elements(json->'BusPositions')->'Lat' AS lat, json_array_elements(json->'BusPositions')->'Lon' AS lon, json_array_elements(json->'BusPositions')->'RouteID' AS route, json_array_elements(json->'BusPositions')->'DirectionNum' AS direction FROM bus;",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
});


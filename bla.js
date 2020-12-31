const Client = require("pg").Pool;

const client = new Client({ //connects to the database
	connectionString: "postgres://uoodtgxbxgmvpu:5857096a85fc0c91ba5f9ed4467e5900a32d21d97ee6252cd960b17befbc9b56@ec2-3-216-89-250.compute-1.amazonaws.com:5432/d7qg8ndmk02ad6",
	ssl: {rejectUnauthorized: false}
});

hola = async () => {
const r = "C4"
var imp1= "SELECT elem->'RouteID' AS routeid, elem->'Deviation' AS deviation, elem->'Lat' AS lat, elem->'Lon' AS lon, elem->'DirectionNum' AS directionnum, elem->'TripID' AS tripid FROM bus, json_array_elements(jsonb::json -> 'BusPositions') elem WHERE elem ->>'RouteID'=$1;"
var hi =  client.query(imp1, [r])
console.log(hi.rows)
console.log("dadsdfgsdfg")
}
hola()

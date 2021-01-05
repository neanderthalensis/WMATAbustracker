`SELECT 
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
	t WHERE t.row % $2 = 0
) bla,
json_array_elements(jsonb::json -> 'BusPositions') elem
WHERE elem ->>'RouteID'=$1;`

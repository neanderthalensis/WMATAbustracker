SELECT 
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
	t WHERE t.row % 1 = 0 AND ts >= '2021-01-03T04:17:28.083Z' AND 0 <= EXTRACT(hour FROM ts) AND 24 >= EXTRACT(hour FROM ts)
) bla,
json_array_elements(jsonb::json -> 'BusPositions') elem
WHERE elem ->>'RouteID'='C4';

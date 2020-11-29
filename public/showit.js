

function RoutePos(busdata, dir){ //determines position of the bus and assigns value
	d3.json('https://wmatabustracker.herokuapp.com/api/route', function(routedata){
		console.log(busdata)
		var filbus = busdata.filter((d) => {return d.directionnum == dir})
		var filroute;
		if (dir == 0){filroute = routedata.Direction0.Shape} //bad 
		else{filroute = routedata.Direction1.Shape}
		for (i=0; i<filroute.length; i++) {
			if(i == 0){
				filroute[i].tot = 0
			}
			else{
				filroute[i].tot = filroute[i-1].tot + (Math.abs(filroute[i].Lat - filroute[i-1].Lat) + Math.abs(filroute[i].Lon - filroute[i-1].Lon))
			}
		}
		filroute.forEach((ele, i, arr) => {
			if(i == 0){
				ele.tot = 0
			}
			else{
				ele.tot = arr[i-1].tot + (Math.abs(ele.Lat - arr[i-1].Lat) + Math.abs(ele.Lon - arr[i-1].Lon))
			}
		})
		filbus.forEach((ele, i, arr) => {
			filroute.forEach((elo, n, aro) => {
				if (n < (aro.length-1)){ //fit it on the route
				if ((ele.lat >= elo.Lat & ele.lon <= elo.Lon & ele.lat <= aro[n+1].Lat & ele.lon >= aro[n+1].Lon) || (ele.lat <= elo.Lat & ele.lon <= elo.Lon & ele.lat >= aro[n+1].Lat & ele.lon >= aro[n+1].Lon) || (ele.lat <= elo.Lat & ele.lon >= elo.Lon & ele.lat >= aro[n+1].Lat & ele.lon <= aro[n+1].Lon) || (ele.lat >= elo.Lat & ele.lon >= elo.Lon & ele.lat <= aro[n+1].Lat & ele.lon <= aro[n+1].Lon)){
					if(((elo.Lat-aro[n+1].Lat)/(elo.Lon-aro[n+1].Lon)).toFixed(0) == ((elo.Lat-ele.lat)/(elo.Lon-ele.lon)).toFixed(0)){
						ele.tot = (elo.tot + (Math.sqrt((Math.abs(elo.Lat - ele.lat)^2)+(Math.abs(elo.Lon - ele.lon)^2))))/(aro[aro.length].tot)
					}
				}

			}

			})
		})

		console.log(filroute)
    	console.log(filbus)
	});
};

// (Math.sqrt((Math.abs(elo.Lat - ele.lat)^2)+(Math.abs(elo.Lon - ele.lon)^2)))
d3.json('https://wmatabustracker.herokuapp.com/api/bus', function(data) {

    RoutePos(data, 1)
});

function LocLoc(lata, lona, latb, lonb){ // figures out which chunk some position is in
		if (lata > latb){newver = 1}
		else if (lata < latb){newver = -1}
		else {newver = 0};

		if (lona > lonb){newhor = 1}
		else if (lona < lonb){newhor = -1}
		else {newhor = 0};
		return {
			newhor: newhor,
			newver: newver
		}

}

function RoutePos(busdata, dir){ //determines position of the bus and assigns value
	d3.json('https://wmatabustracker.herokuapp.com/api/route', function(routedata){
		var filbus = busdata.filter((d) => {return d.direction == dir})
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
				if (n == 0){
					var bla = LocLoc(ele.Lat, ele.Lon, elo.Lat, elo.Lon);
					var ver = bla.newver;
					var hor = bla.newhor;
				}
				else if (n == (aro.length)){}
				else{
					var where = LocLoc(ele.Lat, ele.Lon, aro[n+1].Lat, arp[n+1].Lon)
					if (ver != where.newver && hor != where.newhor){
						ele.tot = (elo.tot + ((Math.sqrt((Math.abs(elo.Lat - ele.Lat)^2)+(Math.abs(elo.Lon - ele.Lon)^2))/Math.sqrt((Math.abs(elo.Lat - aro[n+1].Lat)^2)+(Math.abs(elo.Lon - aro[n+1].Lon)^2)))*Math.abs(aro[n+1].tot - elo.tot)))/(aro[aro.length].tot)*100 
					}
					ver = where.newver;
					hor = where.newhor;

				}
			})
		})

		console.log(filroute)
    	console.log(filbus)
	});
};


d3.json('https://wmatabustracker.herokuapp.com/api/bus', function(data) {

	console.log(data)

    //RoutePos(data, 1)
});
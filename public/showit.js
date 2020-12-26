function WhichTop(filbus){
	var max = Math.max(Math.abs(d3.min(filbus, function(d) { return d.deviation; })), Math.abs(d3.max(filbus, function(d) { return d.deviation; })))
	return{
		max: max,
		min: max*-1
	}
}


function Distance(lat1, lon1, lat2, lon2, unit) { // frim https://www.geodatasource.com/developers/javascript
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function IniPlot(filbus, upavgs, downavgs, justnow){
	var margin = {top: 10, right: 30, bottom: 30, left: 60},
    	width = 0.9*screen.width - margin.left - margin.right,
    	height = 300 - margin.top - margin.bottom;
    var svg = d3.select("#plothere" + filbus[0].directionnum)
  		.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		.append("g")
		.attr("id", "p"+filbus[0].directionnum)
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xs = d3.scaleLinear()
    	.domain([0, 100])
    	.range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height*0.5 + ")")
        .call(d3.axisTop(xs));
    var ys = d3.scaleLinear()
        .domain([WhichTop(filbus).min, WhichTop(filbus).max])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(ys));
    var aline = d3.line()
    	.x( (d) => {return xs(d.where);})
    	.y( (d) => {return ys(d.mean);});

   svg.append('g')
       .selectAll("dot")
       .data(justnow)
       .enter()
       .append("circle")
       .attr("cx", function (d) { return xs(d.totless)} )
       .attr("cy", function (d) { return ys(d.deviation)})
       .attr("r", 5)
       .style("fill", "#green");
    svg.append("path")
        .attr("d", aline(upavgs))
        .style("fill", "none")
        .style("stroke", "red");
    svg.append("path")
        .attr("d", aline(downavgs))
        .style("fill", "none")
        .style("stroke", "blue");
}
function Text(filbus){
	var here = d3.select("body")
		.data(filbus)
		.enter()
		.append("text");

}

function PrepData(busdata, dir, r){ //determines position of the bus and assigns value
	d3.json('https://wmatabustracker.herokuapp.com/api/route/'+r, function(routedata){
		var filbus = busdata.filter((d) => {return d.directionnum == dir})
		var filroute;
		var filstops;
		if (dir == 0){
			filroute = routedata.Direction0.Shape
			filstops = routedata.Direction0.Stops
		} //bad 
		else{
			filroute = routedata.Direction1.Shape
			filstops = routedata.Direction1.Stops
		}
		for (i=0; i<filroute.length; i++) {
			if(i == 0){
				filroute[i].tot = 0
			}
			else{
				filroute[i].tot = filroute[i-1].tot + Distance(filroute[i].Lat, filroute[i].Lon, filroute[i-1].Lat, filroute[i-1].Lon, "K")
			}
		}
		filroute.forEach((ele, i, arr) => {
			ele.Latup = (ele.Lat+(4*10**-4)).toFixed(4)
			ele.Latdown = (ele.Lat-(4*10**-4)).toFixed(4)
			ele.Lonup = (ele.Lon+(4*10**-4)).toFixed(4)
			ele.Londown = (ele.Lon-(4*10**-4)).toFixed(4)

			if(i == 0){
				ele.tot = 0
			}
			else{
				//ele.tot = arr[i-1].tot + (Math.abs(ele.Lat - arr[i-1].Lat) + Math.abs(ele.Lon - arr[i-1].Lon))
				ele.tot = arr[i-1].tot + Distance(ele.Lat, ele.Lon, arr[i-1].Lat, arr[i-1].Lon, "K")
			}
		})

		console.log(filroute)
		filstops.forEach((ele, i, arr) => {
			filroute.forEach((elo, n, aro) => {
			if (n+1 < filroute.length) {
			if ((ele.Lat >= filroute[n].Latdown & ele.Lon <= filroute[n].Lonup & ele.Lat <= filroute[n+1].Latup & ele.Lon >= filroute[n+1].Londown) || (ele.Lat <= filroute[n].Latup & ele.Lon <= filroute[n].Lonup & ele.Lat >= filroute[n+1].Latdown & ele.Lon >= filroute[n+1].Londown) || (ele.Lat <= filroute[n].Latup & ele.Lon >= filroute[n].Londown & ele.Lat >= filroute[n+1].Latdown & ele.Lon <= filroute[n+1].Lonup) || (ele.Lat >= filroute[n].Latdown & ele.Lon >= filroute[n].Londown & ele.Lat <= filroute[n+1].Latup & ele.Lon <= filroute[n+1].Lonup)){
				ele.tot = elo.tot + Distance(ele.Lat, ele.Lon, ele.Lat, ele.Lon, "K")
			}}})		
		})

		var trips = [... new Set(filbus.map((d)=>{return d.tripid}))]

		var stations = filstops.filter((d) => {return d.Name.toUpperCase().includes("STATION") || d.Name.toUpperCase().includes("TRANSIT CENTER") || d.Name.toUpperCase().includes("TRANSIT CTR")}) 
		trips.forEach((olo, o) => {
			var workthis = filbus.filter((d)=> {return d.tripid == olo})
			workthis.sort((a, b)=>{return new Date(a.ts).getTime()-new Date(b.ts).getTime()})
			workthis.forEach((ele, i, arr) =>{
				var n = 0
				stations.forEach((p, t)=>{
					if(ele.lat < p.Lat + (3*10**-3) && ele.lat > p.Lat + (3*10**-3) && ele.lon < p.Lon + (3*10**-3) && ele.lon > p.Lon - (3*10**-3)){
						stat = t
					}
					else{stat = -1}
				})
				if(stat != -1) {
					ele.tot = stations[stat].tot
				}
				else { 
					while(n<filroute.length-1){
						if ((ele.lat >= filroute[n].Latdown & ele.lon <= filroute[n].Lonup & ele.lat <= filroute[n+1].Latup & ele.lon >= filroute[n+1].Londown) || (ele.lat <= filroute[n].Latup & ele.lon <= filroute[n].Lonup & ele.lat >= filroute[n+1].Latdown & ele.lon >= filroute[n+1].Londown) || (ele.lat <= filroute[n].Latup & ele.lon >= filroute[n].Londown & ele.lat >= filroute[n+1].Latdown & ele.lon <= filroute[n+1].Lonup) || (ele.lat >= filroute[n].Latdown & ele.lon >= filroute[n].Londown & ele.lat <= filroute[n+1].Latup & ele.lon <= filroute[n+1].Lonup)){
							//ele.tot = (filroute[n].tot + Math.sqrt((Math.pow(Math.abs(filroute[n].Lat - ele.lat), 2))+(Math.pow(Math.abs(filroute[n].Lon - ele.lon), 2))))*100/filroute[filroute.length-1].tot
							ele.tot = filroute[n].tot + Distance(ele.lat, ele.lon, filroute[n].Lat, filroute[n].Lon, "K")
							ele.totless = ((ele.tot/filroute[filroute.length-1].tot)*100).toFixed(0)
							place = n
						}
					n += 1
				 }}
			})

		})


		filbus = filbus.filter((d)=>{return d.tot > 0})
		var upavgs = [];
		var downavgs = [];
		for(i=1;i<=100; i++){
  			var temp = filbus.filter((d) => {return d.totless == i && 0 <= d.deviation;})
			var tripavgs = [];
  				trips.forEach((ele) => {
  					tripavgs.push((d3.mean(temp.filter((d) => {return d.tripid == ele}).map((d) => {return d.deviation}))))
  				})
  			var entry = {mean: d3.mean(tripavgs), where: i}
  			if(entry.mean != undefined){upavgs.push(entry)}
  			
  			temp = filbus.filter((d) => {return d.totless == i && d.deviation <= 0;})
			var tripavgs = [];
  				trips.forEach((ele) => {
  					tripavgs.push((d3.mean(temp.filter((d) => {return d.tripid == ele}).map((d) => {return d.deviation}))))
  				})
  			var entry = {mean: d3.mean(tripavgs), where: i}
  			if (entry.mean != undefined){downavgs.push(entry)}

 		}
 		 var justnow = filbus.filter((d) => {return d.ts == (d3.max(filbus.map((d) => {return d.ts})))})
		IniPlot(filbus, upavgs, downavgs, justnow)
	})

};

function RunStuff(line, data) {
		dat = data.filter((d) => {return d.routeid == line})

		PrepData(dat, 0, line)
		PrepData(dat, 1, line)
	}
function ShowIt{
d3.json('https://wmatabustracker.herokuapp.com/api/bus', RunStuff.bind(this, document.querySelector('#selection').value));
}
function WhichTop(upavgs, downavgs){
	var max = Math.max(Math.abs(d3.min(downavgs, function(d) {return d.mean})), Math.abs(d3.max(upavgs, function(d) { return d.mean; })))
	if(!(max > 15)){max = 15}
	return{
		max: max,
		min: -1*max
	}
}

function toggle(a, b){
	document.getElementById("sub").style["display"]=a
	document.getElementById("loading").style.display=b
}


function Distance(lat1, lon1, lat2, lon2, unit) { // from https://www.geodatasource.com/developers/javascript
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

function ReLatLon(filroute, kmpos){
	var tlat;
	var tlon;
	for(i=0; i < filroute.length; i++){
		if (i == filroute.length-1 || kmpos == 0){
				tlat = filroute[i].Lat.toFixed(3)
				tlon = filroute[i].Lon.toFixed(3)
				break
			}
		else if (kmpos < filroute[i].tot && i > 0){
				tlat = (filroute[i].Lat + (Math.abs(filroute[i-1].Lat - filroute[i].Lat)*((kmpos-filroute[i].tot)/(filroute[i].tot-filroute[i-1].tot)))).toFixed(3)
				tlon = (filroute[i].Lon + (Math.abs(filroute[i-1].Lon - filroute[i].Lon)*((kmpos-filroute[i].tot)/(filroute[i].tot-filroute[i-1].tot)))).toFixed(3)
				break
			}
		}
	return{
		tlat: tlat,
		tlon: tlon
	}
}

function SubPlot(filbus, upavgs, downavgs, justnow, filstops, stations, filroute, niceheading){
	if (filbus.length > 0){
	var margin = {top: 10, right: 30, bottom: 30, left: 30},
    	width = 0.8*screen.width - margin.left - margin.right,
    	height = 330 - margin.top - margin.bottom-30;
    var hover = function(){
		var pos = d3.mouse(this)[0]-margin.left
		var tiptop = document.getElementById("p" + filbus[0].directionnum).getBoundingClientRect().top + 'px'
		if (0<pos && pos < width){
			svg.select("#hoverline")
				.attr("x1", pos)
				.attr("x2", pos)
				.style("stroke-opacity", "1");
			var perpos = xs.invert(pos).toFixed(0)
			var kmpos = ((xs.invert(pos).toFixed(0)/100)*filroute[filroute.length-1].tot).toFixed(1)
			var coo = ReLatLon(filroute, kmpos)
			var distimp = "; Km along route: "
			if (document.querySelector('#interactive').checked){
				kmpos = kmpos*0.6213712
				distimp = "; Miles along route: "
			}
				d3.select("#disp"+filbus[0].directionnum).selectAll("text")
					.text(niceheading + "; % along route: " + perpos + distimp + kmpos + "; Lat: " + coo.tlat + "; Lon: " + coo.tlon)
			}

		else {dehover}
	}
	var onhover = function(){
		var pos = d3.mouse(this)[0]-margin.left
		var tiptop = document.getElementById("p" + filbus[0].directionnum).getBoundingClientRect().top + 'px'
		svg.append("line")
			.attr("id", "hoverline")
        	.attr("x1", pos)
        	.attr("y1", 0)
        	.attr("x2", pos)
        	.attr("y2", height)
        	.style("stroke", "black")
        	.style("stroke-opacity", "0")
        	.style("stroke-width", 1);

	}
	var dehover = function(){
		svg.selectAll("#hoverline").remove()
		d3.select("#disp"+filbus[0].directionnum).selectAll("text").text(niceheading)
	}
	var map = function(){
			var pos = d3.mouse(this)[0]-margin.left
			var kmpos = ((xs.invert(pos).toFixed(0)/100)*filroute[filroute.length-1].tot).toFixed(1)
			var coo = ReLatLon(filroute, kmpos)
			if (document.getElementById("mapping").value == "osm" ){
				window.open("https://www.openstreetmap.org/#map=16/"+ coo.tlat +"/"+ coo.tlon, '_blank')
			}
			else if (document.getElementById("mapping").value == "google" ){
				window.open("https://www.google.com/maps/@"+ coo.tlat +","+ coo.tlon +",16z", '_blank')
			}
			else if (document.getElementById("mapping").value == "bing" ){
				window.open("https://www.bing.com/maps?cp="+ coo.tlat +"~"+ coo.tlon + "&lvl=16", '_blank')
			}
	}
    var svg = d3.select("#p" + filbus[0].directionnum)
    var xs = d3.scaleLinear()
    	.domain([0, 100])
    	.range([ 0, width ]);
    var ys = d3.scaleLinear()
        .domain([WhichTop(upavgs, downavgs).min, WhichTop(upavgs, downavgs).max])
        .range([ height, 0 ])
    svg.selectAll(".statlabel").remove()
    svg.selectAll(".xmajor").remove()
    if(document.getElementById("stops").checked){
    	svg.selectAll(".xaxis")
    		.call(d3.axisTop(xs).tickValues(filstops.map((d)=>{return d.totless})))
    		.selectAll("text")
    		.remove();
    	svg.append("g")
        	.attr("class", "xmajor")
        	.attr("transform", "translate(0," + height + ")")
    		.call(d3.axisTop(xs).tickValues(stations.map((d)=>{return d.totless})).tickSizeInner(height))
    		.selectAll("text")
    		.remove();
        svg.selectAll(".xmajor").selectAll("path").remove()
        stations.forEach((ele) => {
        	svg.append("text")
        	  	.attr("class", "statlabel")
        	   	.data(stations)
        		.attr("x", xs(ele.totless))             
        		.attr("y", -10)
        		.attr("transform", "rotate(90) " + "translate(" + -xs(ele.totless) + ","+ -xs(ele.totless) +")")  
        		.style("font-size", "8px") 
        		.text(ele.Name);
        })
    }
    else{
    	svg.selectAll(".xaxis")
    		.call(d3.axisTop(xs).tickValues([50, 100]));
    }
    if((document.getElementById("grid").checked)){
    	svg.append("g")
    		.attr("class", "xgrid")
    		.lower()
    		.call(d3.axisTop(xs).tickSizeInner(-height).tickFormat('').ticks(10))
    		.selectAll(".tick").selectAll("line").style("stroke", "#dddddd")
    	svg.selectAll(".xgrid").selectAll("path").remove()

    	svg.append("g")
    		.attr("class", "ygrid")
    		.lower()
    		.call(d3.axisLeft(ys).tickSizeInner(-width).tickFormat(''))
    		.selectAll(".tick").selectAll("line").style("stroke", "#dddddd")
    }
    else{
    	svg.selectAll(".xgrid").remove()
    	svg.selectAll(".ygrid").remove()
    }
    svg.selectAll(".yaxis")
        .call(d3.axisLeft(ys));
    var aline = d3.line()
    	.x((d) => {return xs(d.where);})
    	.y((d) => {return ys(d.mean);});
   svg.selectAll(".pts")
       .remove()
   if(document.getElementById("enroute").checked){
		svg.append("g")
   	   		.selectAll("dot")
       		.data(justnow)
       		.enter()
       		.append("circle")
       		.attr("cx", function (d) { return xs(d.totless)} )
       		.attr("cy", function (d) { return ys(d.deviation)})
       		.attr("r", 5)
       		.attr("class", "pts")
    }
    svg.selectAll(".upline")
        .attr("d", aline(upavgs))
        .style("stroke-width", "2px")
        .style("fill", "none")
        .style("stroke", "red");
    svg.selectAll(".downline")
        .attr("d", aline(downavgs))
        .style("stroke-width", "2px")
        .style("fill", "none")
        .style("stroke", "blue");
   	d3.select("#disp"+filbus[0].directionnum).selectAll("text").text(niceheading)
    if (document.getElementById("interactive").checked){
   		d3.select("#plothere" + filbus[0].directionnum).select("svg").on("mousemove", hover)
    	d3.select("#plothere" + filbus[0].directionnum).select("svg").on("mouseenter", onhover)
    	d3.select("#plothere" + filbus[0].directionnum).select("svg").on("mouseleave", dehover)
    	d3.select("#plothere" + filbus[0].directionnum).select("svg").on("click", map)
	}

}}
function Text(filbus){
	var here = d3.select("body")
		.data(filbus)
		.enter()
		.append("text");

}

async function PrepData(busdata, dir, r){ //determines position of the bus and assigns value
	var filbus;
	var upavgs = [];
	var downavgs = [];
	var justnow;
	var filstops;
	var stations;
	var filroute;
	var niceheading;

	await d3.json('https://wmatabustracker.herokuapp.com/api/route/'+r).then((routedata) => {
		filbus = busdata.filter((d) => {return d.directionnum == dir})
		if (dir == 0){
			niceheading = routedata.Direction0.DirectionText + " - " + routedata.Direction0.TripHeadsign 
			filroute = routedata.Direction0.Shape
			filstops = routedata.Direction0.Stops
		} //bad 
		else{
			niceheading = routedata.Direction1.DirectionText + " - " + routedata.Direction1.TripHeadsign 
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
				ele.tot = arr[i-1].tot + Distance(ele.Lat, ele.Lon, arr[i-1].Lat, arr[i-1].Lon, "K")
			}
		})

		filstops.forEach((ele, i, arr) => {
			filroute.forEach((elo, n, aro) => {
			if (n+1 < filroute.length) { 
			if ((ele.Lat >= filroute[n].Latdown & ele.Lon <= filroute[n].Lonup & ele.Lat <= filroute[n+1].Latup & ele.Lon >= filroute[n+1].Londown) || (ele.Lat <= filroute[n].Latup & ele.Lon <= filroute[n].Lonup & ele.Lat >= filroute[n+1].Latdown & ele.Lon >= filroute[n+1].Londown) || (ele.Lat <= filroute[n].Latup & ele.Lon >= filroute[n].Londown & ele.Lat >= filroute[n+1].Latdown & ele.Lon <= filroute[n+1].Lonup) || (ele.Lat >= filroute[n].Latdown & ele.Lon >= filroute[n].Londown & ele.Lat <= filroute[n+1].Latup & ele.Lon <= filroute[n+1].Lonup)){
				ele.tot = elo.tot + Distance(ele.Lat, ele.Lon, ele.Lat, ele.Lon, "K")
				if(i == 0){ele.totless = 0}
				else if (i == arr.length-1){ele.totless = 100}
				else{ele.totless = ((ele.tot/filroute[filroute.length-1].tot)*100).toFixed(0)}
			}}})		
		})

		var trips = [... new Set(filbus.map((d)=>{return d.tripid}))]

		stations = filstops.filter((d) => {return d.Name.toUpperCase().includes("BAY") || d.Name.toUpperCase().includes("TRANSIT CENTER") || d.Name.toUpperCase().includes("TRANSIT CTR")}) 
		trips.forEach((olo, o) => {
			var workthis = filbus.filter((d)=> {return d.tripid == olo})
			workthis.sort((a, b)=>{return new Date(a.ts).getTime()-new Date(b.ts).getTime()})
			workthis.forEach((ele, i, arr) =>{
				var n = 0
				var stat = -1;
				stations.forEach((p, t)=>{
					if(ele.lat < p.Lat + (3*10**-3) && ele.lat > p.Lat + (3*10**-3) && ele.lon < p.Lon + (3*10**-3) && ele.lon > p.Lon - (3*10**-3)){
						stat = t
					}
				})
				if(stat != -1) {
					ele.tot = stations[stat].tot
				}
				else { 
					while(n<filroute.length-1){
						if ((ele.lat >= filroute[n].Latdown & ele.lon <= filroute[n].Lonup & ele.lat <= filroute[n+1].Latup & ele.lon >= filroute[n+1].Londown) || (ele.lat <= filroute[n].Latup & ele.lon <= filroute[n].Lonup & ele.lat >= filroute[n+1].Latdown & ele.lon >= filroute[n+1].Londown) || (ele.lat <= filroute[n].Latup & ele.lon >= filroute[n].Londown & ele.lat >= filroute[n+1].Latdown & ele.lon <= filroute[n+1].Lonup) || (ele.lat >= filroute[n].Latdown & ele.lon >= filroute[n].Londown & ele.lat <= filroute[n+1].Latup & ele.lon <= filroute[n+1].Lonup)){
							var binsize = document.querySelector('#binsize').value/1000
							ele.tot = filroute[n].tot + Distance(ele.lat, ele.lon, filroute[n].Lat, filroute[n].Lon, "K")
							ele.totless = (Math.floor(ele.tot/binsize)*100)/Math.floor(filroute[filroute.length-1].tot/binsize)
							place = n
						}
					n += 1
				 }}
			})

		})



		//filbus = filbus.filter((d)=>{return d.tot > 0})

		var bins = [... new Set(filbus.map((d)=>{return d.totless}))].sort((a,b) => {return a-b})
		for(i=1;i<=bins.length; i++){
  			var temp = filbus.filter((d) => {return d.totless == bins[i] && 0 <= d.deviation;})
			var tripavgs = [];
  				trips.forEach((ele) => {
  					tripavgs.push((d3.mean(temp.filter((d) => {return d.tripid == ele}).map((d) => {return d.deviation}))))
  				})
  			var entry = {mean: d3.mean(tripavgs), where: bins[i]}
  			if(entry.mean != undefined){upavgs.push(entry)}
  			
  			temp = filbus.filter((d) => {return d.totless == bins[i] && d.deviation <= 0;})
			var tripavgs = [];
  				trips.forEach((ele) => {
  					tripavgs.push((d3.mean(temp.filter((d) => {return d.tripid == ele}).map((d) => {return d.deviation}))))
  				})
  			var entry = {mean: d3.mean(tripavgs), where: bins[i]}
  			if (entry.mean != undefined){downavgs.push(entry)}

 		}
 		 justnow = filbus.filter((d) => {return d.ts == (d3.max(filbus.map((d) => {return d.ts})))})
	})
	return{
	 	filbus: filbus,
	 	upavgs: upavgs, 
	 	downavgs: downavgs,
	 	justnow: justnow,
	 	filstops: filstops,
	 	stations: stations,
	 	filroute: filroute,
	 	niceheading: niceheading
	}
};






async function ShowIt(){

	toggle("none", "inline")
	var checker = await d3.json('https://wmatabustracker.herokuapp.com/api/routes')
	var line = document.querySelector('#selection').value.toUpperCase()
	var fail = false
	if (!(checker.Routes.map((d) => {return d.RouteID}).includes(line))){
		line = null
		document.getElementById("message").innerHTML = "Invalid input for line"
		fail = true
	}
	var freq = document.querySelector('#frequency').value
	var tframe = document.querySelector('#timeframe').value
	var tstart = document.querySelector('#start').value
	var tend = document.querySelector('#end').value
	var bin = document.querySelector('#binsize').value
	if (tstart/1 != tstart || tend/1 != tend || tstart < 0 || tstart > 24 || tend < 0 || tend > 24 ){
		tstart = null
		tend = null
		document.getElementById("message").innerHTML = "Invalid input for time range"
		fail = true
	}
	if (bin <= 0){
		document.getElementById("message").innerHTML = "Invalid input for bin size"
		fail = true
	}
	if (!(fail)){
		var data = await d3.json('https://wmatabustracker.herokuapp.com/api/bus/'+line+'&'+freq+'&'+tframe+'&'+tstart+'&'+tend)
		if (data.length == 0){
			document.getElementById("message").innerHTML = "No data found for this line."
			fail = true
		}
	}

	if (fail){document.getElementById("message").style.display = "block"}
	else{
		document.getElementById("message").style.display = "none"
		var dat = await Promise.all([
			PrepData(data, 0, line),
			PrepData(data, 1, line)
		])
		await Promise.all([
			SubPlot(dat[0].filbus, dat[0].upavgs, dat[0].downavgs, dat[0].justnow, dat[0].filstops, dat[0].stations, dat[0].filroute, dat[0].niceheading),
			SubPlot(dat[1].filbus, dat[1].upavgs, dat[1].downavgs, dat[1].justnow, dat[1].filstops, dat[1].stations, dat[1].filroute, dat[1].niceheading)
		])
	}	
	toggle("inline", "none")

}

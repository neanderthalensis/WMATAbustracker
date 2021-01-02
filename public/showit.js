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

function SubPlot(filbus, upavgs, downavgs, justnow, filstops, stations, filroute){
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
			let perpos = xs.invert(pos).toFixed(0)
			let kmpos = ((xs.invert(pos).toFixed(0)/100)*filroute[filroute.length-1].tot).toFixed(1)
			var tlat;
			var tlon;
			for(i=0; i < filroute.length; i++){
				if (kmpos < filroute[i].tot && i < filroute.length-1){
					tlat = filroute[i].Lat + (Math.abs(filroute[i].Lat - filroute[i+1].Lat)*((kmpos-filroute[i])/(filroute[i+1].tot-filroute[i].tot)))
					tlon = filroute[i].Lon + (Math.abs(filroute[i].Lon - filroute[i+1].Lon)*((kmpos-filroute[i])/(filroute[i+1].tot-filroute[i].tot)))
					console.log("hi")
					break
				}
				else if (i == filroute.length-1){
					tlat = filroute[filroute.length-1].Lat
					tlon = filroute[filroute.length-1].Lon
					break
				}
			}
			d3.select("#disp"+filbus[0].directionnum).selectAll("text")
				.text("% along route: " + perpos + "; Km along route: " + kmpos + "; Lat: " + tlat + "; Lon: " + tlon)
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
    if (document.getElementById("interactive").checked){
   		d3.select("#plothere" + filbus[0].directionnum).select("svg").on("mousemove", hover)
    	d3.select("#plothere" + filbus[0].directionnum).select("svg").on("mouseenter", onhover)
    	d3.select("#plothere" + filbus[0].directionnum).select("svg").on("mouseleave", dehover)
	}
}
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
	await d3.json('https://wmatabustracker.herokuapp.com/api/route/'+r).then((routedata) => {
		filbus = busdata.filter((d) => {return d.directionnum == dir})
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
 		 justnow = filbus.filter((d) => {return d.ts == (d3.max(filbus.map((d) => {return d.ts})))})
	})

	return{
	 	filbus: filbus,
	 	upavgs: upavgs, 
	 	downavgs: downavgs,
	 	justnow: justnow,
	 	filstops: filstops,
	 	stations: stations,
	 	filroute: filroute
	}
};






async function ShowIt(){

	toggle("none", "inline")

	var line = document.querySelector('#selection').value.toUpperCase()
	var data = await d3.json('https://wmatabustracker.herokuapp.com/api/bus/'+line)
	if (data.length == 0){
		console.log("nothing could be found")
	}
	else{
		var dat = await Promise.all([
			PrepData(data, 0, line),
			PrepData(data, 1, line)
		])
		console.log(dat)
		await Promise.all([
			SubPlot(dat[0].filbus, dat[0].upavgs, dat[0].downavgs, dat[0].justnow, dat[0].filstops, dat[0].stations, dat[0].filroute),
			SubPlot(dat[1].filbus, dat[1].upavgs, dat[1].downavgs, dat[1].justnow, dat[1].filstops, dat[1].stations, dat[1].filroute)
		])
	}	
	toggle("inline", "none")

}

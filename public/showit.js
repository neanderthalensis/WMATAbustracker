function Plot(filbus){
	var margin = {top: 10, right: 30, bottom: 30, left: 60},
    	width = 460 - margin.left - margin.right,
    	height = 400 - margin.top - margin.bottom;
    var svg = d3.select("#plothere")
  		.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleLinear()
    	.domain([0, 100])
    	.range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    var y = d3.scaleLinear()
      .domain([d3.min(filbus, function(d) { return d.deviation; }), d3.max(filbus, function(d) { return d.deviation; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
 	svg.append('g')
	  .selectAll("dot")
      .data(filbus)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.tot)} )
      .attr("cy", function (d) { return y(d.deviation)})
      .attr("r", 1.5)
      .style("fill", "#69b3a2");
    svg.append('g')
   	  .selectAll("lines")
      .data(filbus)
      .enter()
      .append("path");
    d3.select("path")
      .attr("d", 
      	d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
        )
      .style("fill", "#69b3a2");

}
function Text(filbus){
	var here = d3.select("body")
		.data(filbus)
		.enter()
		.append("text");

}

function PrepData(busdata, dir){ //determines position of the bus and assigns value
	d3.json('https://wmatabustracker.herokuapp.com/api/route', function(routedata){
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
//					if(((elo.Lat-aro[n+1].Lat)/(elo.Lon-aro[n+1].Lon)).toFixed(0) == ((elo.Lat-ele.lat)/(elo.Lon-ele.lon)).toFixed(0)){
						ele.check = "a"
						ele.tot = (elo.tot + Math.sqrt((Math.pow(Math.abs(elo.Lat - ele.lat), 2))+(Math.pow(Math.abs(elo.Lon - ele.lon), 2))))*100/aro[aro.length-1].tot
//					}
				}

			}

			})
		})
		filbus = filbus.filter((d)=>{return d.tot > 0})

		var count = 0
		filbus.forEach((ele) =>{
			if(ele.check == "a"){count = count + 1}
		})
		console.log(count)
		console.log(filbus)
		console.log(filbus.filter((d) => {return d.deviation < -25 & d.tot > 1}))
		Plot(filbus)
	})

};

function RunStuff(data) {
		PrepData(data, 0)
		PrepData(data, 1)
	}

d3.json('https://wmatabustracker.herokuapp.com/api/bus', RunStuff);
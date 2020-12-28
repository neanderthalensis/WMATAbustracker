function IniPlot(dir){
	var margin = {top: 10, right: 30, bottom: 30, left: 30},
    	width = 0.8*screen.width - margin.left - margin.right,
    	height = 300 - margin.top - margin.bottom;
    var svg = d3.select("#plothere" + dir)
  		.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		.append("g")
		.attr("id", "p"+dir)
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xs = d3.scaleLinear()
    	.domain([0, 100])
    	.range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height*0.5 + ")")
        .call(d3.axisTop(xs).tickValues([50, 100]));
    var ys = d3.scaleLinear()
        .domain([-30, 30])
        .range([ height, 0 ]);
    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(ys));
    svg.append("path")
    	.attr("class", "upline");
    svg.append("path")
    	.attr("class", "downline");
    svg.append("g")
        .attr("class", "circles")
}


$(document).ready( () => {
	var sel = document.getElementById('selection')
	var list = document.createElement('Datalist')
		list.setAttribute("id", "buses")
		list.setAttribute("width", "100px")
	d3.json('https://wmatabustracker.herokuapp.com/api/routes', function(lines){
	lines.Routes.forEach((ele) => {
		var option = document.createElement('option')
		option.value = ele.RouteID;
		option.textContent=ele.Name
		list.appendChild(option)
	})
	})
	sel.setAttribute('list', 'buses')
	sel.appendChild(list)
	IniPlot(0)
	IniPlot(1)


	})
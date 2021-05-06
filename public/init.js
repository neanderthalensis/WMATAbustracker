function IniPlot(dir){
	var margin = {top: 10, right:30, bottom: 30, left: 30},
    	width = 0.8*screen.width - margin.left - margin.right,
    	height = 330 - margin.top - margin.bottom-30;
    var svg = d3.select("#plothere" + dir)
  		.append("svg")
    	// .attr("width", width + margin.left + margin.right)
    	// .attr("height", height + margin.top + margin.bottom)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + 0.8*screen.width +" 300")
  		.append("g")
		.attr("id", "p"+dir)
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xs = d3.scaleLinear()
    	.domain([0, 100])
    	.range([ 0, width ]);
    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height*0.5 + ")")
        .call(d3.axisTop(xs).tickValues([50, 100]));
    var ys = d3.scaleLinear()
        .domain([-15, 15])
        .range([ height, 0 ]);
    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(ys));
    svg.append("path")
    	.attr("class", "upline");
    svg.append("path")
    	.attr("class", "downline");
    d3.select("#plothere" + dir).selectAll("svg")
        .append("g")
        .attr("id", "disp"+dir)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .append("text")
        .attr("x", 20)             
        .attr("y", height+15)
        .text();
}

function Legend(){
    var margin = {top: 10, right: 30, bottom: 0, left: 30},
        width = 0.8*screen.width - margin.left - margin.right,
        height = 30 - margin.top - margin.bottom;
    if (screen.width > 600){
    var left = (width/2)-220
    var svg = d3.select("#legend")
        .append("svg")
        .attr("viewBox", "0 0 " + 0.8*screen.width +" 30")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("circle")
        .attr("cx",left)
        .attr("cy",10)
        .attr("r", 5)
        .style("fill", "black");
    svg.append("line")
        .attr("x1", left+150)
        .attr("y1", 10)
        .attr("x2", left+160)
        .attr("y2", 10)
        .style("stroke", "red")
        .style("stroke-width", 2);
    svg.append("line")
        .attr("x1", left+300)
        .attr("y1", 10)
        .attr("x2", left+310)
        .attr("y2", 10)
        .style("stroke", "blue")
        .style("stroke-width", 2);
    svg.append("text")
        .attr("x", left+10)             
        .attr("y", 15)
        .attr("text-anchor", "left")  
        .style("font-size", "16px") 
        .text("Bus Enroute");
    svg.append("text")
        .attr("x", left+165)             
        .attr("y", 15)
        .attr("text-anchor", "left")  
        .style("font-size", "16px") 
        .text("Mean Delay");
    svg.append("text")
        .attr("x", left+315)             
        .attr("y", 15)
        .attr("text-anchor", "right")  
        .style("font-size", "16px") 
        .text("Mean Early Arrival");
    }
    else{
    var left = (width/2)-60
    var svg = d3.select("#legend")
        .append("svg")
        .attr("viewBox", "0 0 " + 0.8*screen.width +" 70")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("circle")
        .attr("cx",left)
        .attr("cy",10)
        .attr("r", 5)
        .style("fill", "black");
    svg.append("line")
        .attr("x1", left-5)
        .attr("y1", 30)
        .attr("x2", left+5)
        .attr("y2", 30)
        .style("stroke", "red")
        .style("stroke-width", 2);
    svg.append("line")
        .attr("x1", left-5)
        .attr("y1", 50)
        .attr("x2", left+5)
        .attr("y2", 50)
        .style("stroke", "blue")
        .style("stroke-width", 2);
    svg.append("text")
        .attr("x", left+15)             
        .attr("y", 15)
        .attr("text-anchor", "left")  
        .style("font-size", "16px") 
        .text("Bus Enroute");
    svg.append("text")
        .attr("x", left+15)             
        .attr("y", 35)
        .attr("text-anchor", "left")  
        .style("font-size", "16px") 
        .text("Mean Delay");
    svg.append("text")
        .attr("x", left+15)             
        .attr("y", 55)
        .attr("text-anchor", "right")  
        .style("font-size", "16px") 
        .text("Mean Early Arrival");
    }
}

window.addEventListener('load', function () {
    document.querySelector('#binsize').value = 300
    document.querySelector('#enroute').checked = true
    document.querySelector('#interactive').checked = true
    document.querySelector('#frequency').value = 2
    document.querySelector('#start').value = 0
    document.querySelector('#end').value = 24


	var sel = document.getElementById('selection')
	var list = document.createElement('Datalist')
		list.setAttribute("id", "buses")
		list.setAttribute("width", "100px")
	d3.json('https://wmatabustracker.herokuapp.com/api/routes').then((lines) => {
        lines.features.forEach((ele) => {
		  var option = document.createElement('option')
		  option.value = ele.LOCID;
		  option.textContent= ele.LOCID + " - " + ele.FULLNAME
		  list.appendChild(option)
	})
	})
	sel.setAttribute('list', 'buses')
	sel.appendChild(list)
    Legend()
	IniPlot(0)
	IniPlot(1)
	})
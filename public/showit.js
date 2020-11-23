

var request = new XMLHttpRequest()

request.open('GET', 'https://wmatabustracker.herokuapp.com/api/bus', true)
request.onload = function(){
	d3.json{this.response, function(err, data){
		console.log(data)
	}

	}
}
request.send()


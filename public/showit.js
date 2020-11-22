

var request = new XMLHttpRequest()

request.open('GET', 'https://wmatabustracker.herokuapp.com/api/bus', true)
request.onload = function(){
    var data = JSON.parse(this.response)
    console.log(data)
    data.forEach((busloc) => {
		console.log(busloc.ts)
	})
}
request.send()




var request = new XMLHttpRequest()

request.open('GET', 'https://wmatabustracker.herokuapp.com/api/bus', true)




window.onload = function(){

   var data = JSON.parse(this.response)
   data.forEach((buspos) => {
		console.log(buspos.ts)
})

}

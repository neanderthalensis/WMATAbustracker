d3.json('https://wmatabustracker.herokuapp.com/api/routes', function(lines){
$(document).ready( () => {
	var sel = document.getElementById('selection')
	var list = document.createElement('Datalist')
		list.setAttribute("id", "buses")
	lines.forEach((ele) => {
		var option = document.createElement('option')
		option.value = ele.RouteID;
		option.textContent=ele.Name
		list.appendChild(option)
	})

	sel.setAttribute('list', 'buses')
	sel.appendChild(list)

	}
)})
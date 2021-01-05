function Options() {
	if (!(document.getElementById("submenu").style.display =="block")){
		document.getElementById("submenu").style.display = 'block'
		document.getElementById("opt").style["background-color"] = '#666666'
	}
	else{
		document.getElementById("submenu").style.display = 'none'
		document.getElementById("opt").style["background-color"] = 'black'
	}
}
function About() {
}
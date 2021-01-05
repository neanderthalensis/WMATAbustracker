function Options() {
	if (!(document.getElementById("submenu").style.display =="flex")){
		document.getElementById("submenu").style.display = 'flex'
		document.getElementById("opt").style["background-color"] = '#666666'
	}
	else{
		document.getElementById("submenu").style.display = 'none'
		document.getElementById("opt").style["background-color"] = 'black'
	}
}
function About() {
	window.open("./about.html","_self")
}

function GoBack() {
	window.open("./index.html","_self")
}

const key = process.env.API_KEY



d3.json('https://wmatabustracker.herokuapp.com/api/bus', function(data) {
    console.log(data);
    d3.select("body")
        .selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(function(d) {
            return d.lat*2 + ", " + d.lon;
        });
});
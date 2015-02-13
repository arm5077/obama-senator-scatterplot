var margin = {top: 20, right: 20, bottom: 20, left: 40},
	width = window.innerWidth - margin.right * 2 - margin.left * 2,
	height = window.innerHeight - margin.top * 2 - margin.bottom * 2;
	
var x = d3.scale.linear()
	.range([0, width]);

var y = d3.scale.linear()
	.range([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");
	
var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(e, data){
	if(e) console.log(e);
	
	data.forEach(function(datum){
		datum.dem_vote = +datum.dem_vote * 100;
		datum.rep_vote = +datum.rep_vote * 100;
		datum.obama_vote = +datum.obama_vote * 100;
	});
	
	x.domain(d3.extent(data, function(d) { return d.obama_vote; }));
	y.domain(d3.extent(data, function(d) { return d.dem_vote; }));
	
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Percent of vote, Obama");
	
	svg.append("g")
		.attr("class", "y axis")
	.call(yAxis)
	.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Percent of vote, Democratic senator")
	
		svg.selectAll(".dot")
			.data(data)
		.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 3.5)
			.attr("cx", function(d) { return x(d.obama_vote); })
			.attr("cy", function(d) { return y(d.dem_vote); })
			
	console.log(data);
	
})
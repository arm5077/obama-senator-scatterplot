
if( window.innerWidth > 700) {
	var text = [];
	var currentYear = 2000;
	
	var margin = {top: 20, right: 10, bottom: 20, left: 60},
		width = document.getElementById("container").offsetWidth - margin.right * 2 - margin.left,
		height = document.getElementById("container").offsetHeight - margin.top * 2 - margin.bottom * 2;
		
	var x = d3.scale.linear()
		.range([0, width]);
	
	var y = d3.scale.linear()
		.range([height, 0]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(d3.format("%"));
		
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format("%"));
		
	var svg = d3.select("#container").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	d3.csv("data.csv", function(e, data){
		if(e) console.log(e);
		
		data.forEach(function(datum){
			datum.dem_vote = +datum.dem_vote;
			datum.rep_vote = +datum.rep_vote;
			datum.dem_prez_vote = +datum.dem_prez_vote;
			datum.rep_prez_vote = +datum.rep_prez_vote;
		});
		
		x.domain(d3.extent(data, function(d) { return d.dem_prez_vote; }));
		y.domain(d3.extent(data, function(d) { return d.dem_vote; }));
		
		
		horizontalLines = svg.selectAll("line.horizontal")
			.data(y.ticks(30)).enter()
		.append("line")
			.attr({
				"class": "horizontal",
				"x1": 0,
				"x2": width,
				"y1": function(d){ return y(d); },
				"y2": function(d){ return y(d);},
				"fill": "none",
				"stroke": "#eee",
				"stroke-width": "1px"
			});
		
		verticalLines = svg.selectAll("line.vertical")
			.data(x.ticks(160)).enter()
		.append("line")
			.attr({
				"class": "vertical",
				"y1": 0,
				"y2": height,
				"x1": function(d){ console.log("y"); return x(d); },
				"x2": function(d){ return x(d);},
				"fill": "none",
				"stroke": "#eee",
				"stroke-width": "1px"
			});
		
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("Percent of vote, Democratic presidential candidate");
		
		svg.append("g")
			.attr("class", "y axis")
		.call(yAxis)
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Percent of vote, Democratic senatorial candidate")
		
		
		dots = svg.selectAll(".dot")
			.data(data)
		.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 5)
			.attr("cx", function(d) { return x(d.dem_prez_vote); })
			.attr("cy", function(d) { return y(d.dem_vote); })
			.attr("fill", function(d) {
				if( d.dem_vote > d.rep_vote ){
					if( d.dem_prez_vote > .5 ) return "#145786";
					else return "#76B6E3"; 
				}
				else {
					if( d.dem_prez_vote > .50 ) return "#EA7F83"; 
					else return "#EC2026";
				}
			})
			.style("opacity", function(d){
				if( d.year == 2008 ) return 1
				else return 0;
			})
			.on("mousemove", function(d){
				console.log(d3.mouse(this)[0] + 175);
				if( d3.mouse(this)[1] + 175 > height )
					var popup = d3.select(".popup.embed");
				else 
					var popup = d3.select(".popup.float");
				
				
				popup.html("<h3>" + d.state + ": " + d.year + "</h3><div class = 'table-div'><table><tr><td>" + d.dem_prez + "</td><td>" + Math.floor(d.dem_prez_vote * 100) + "%</td></tr><tr><td>" + d.rep_prez + "</td><td>" + Math.floor(d.rep_prez_vote * 100) + "%</td></tr></table></div> <div class = 'table-div'><table><tr><td>Dem. senate</td><td>" + Math.floor(d.dem_vote * 100) + "%</td></tr><tr><td>Rep. senate</td><td>" + Math.floor(d.rep_vote * 100) + "%</td></tr></table></div>")
					.classed("visible", true);
				
				d3.select(".popup.float")
					.style("top", (d3.event.clientY + 30) + "px")
					.style("left", (d3.event.clientX - popup.node().clientWidth / 2) + "px");
			})
			.on("mouseout", function(d){
				d3.selectAll(".popup")
					.classed("visible", false);
			});
		console.log(data);
		
		d3.selectAll(".next")
			.on("click", function(){
				if( currentYear != 2012 ) currentYear += 4;
				changeYear();
			});
		
		d3.selectAll(".previous")
			.on("click", function(){
				if( currentYear != 2000 ) currentYear -= 4;
				changeYear();
			});
		
		d3.selectAll(".seeAll")
			.on("click", function(){
				dots.style("opacity", 1);
			});
		
		changeYear();
	});
}

function changeYear(){
	d3.selectAll(".year")
		.style("display", function(){
			if( parseInt(d3.select(this).attr("id")) == currentYear) return "block";
			else if (window.clientWidth <= 700) return "block";
			else return "none";
		});
		
	dots.style("opacity", function(d){
		if( d.year == currentYear) return 1;
			else return .1;
	});
	
}
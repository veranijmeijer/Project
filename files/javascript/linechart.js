// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function create_title(sort, country="") {
  // this function adds the title above the svg
  if (sort == "map") {
    d3.select("#map").append("h6").attr("class", "title_map").text("Density of 'bijstand' benefits (per 1000 residents) in The Netherlands - 2017");
  } else if (sort == "pie") {
    d3.select("#piechart").append("h6").attr("class", "title_pie").text("The distribution of benefits - 2017");
  } else {
    d3.select("#linechart").append("h6").attr("class", "title_line").text("Number of benefits in The Netherlands");
  }
}

function add_svg(sort) {
  // this function adds the svg, but does not fill it yet
  var svg, margin, width, height;

  if (sort == "map") {
    margin = {top: 0, right: 0, bottom: 0, left: 0};
    width = 800;
    height = 800;
    svg = d3.select("#map")
             .append("svg")
             .attr("viewBox", "0 0 800 800")
             .attr("preserveAspectRatio", "xMidYMid meet")
             // .attr("fill", "grey")
             // .attr("width", width)
             // .attr("height", height)
             .classed("svg", true);
    // svg.append("rect")
    //    .attr("width", "100%")
    //    .attr("height", "100%")
    //    .attr("fill", "lightgrey");
  } else if (sort == "pie") {
    width = 800;
    height = 600;
    svg = d3.select("#piechart")
            .append("svg")
            .attr("viewBox", "0 0 800 600")
            .attr("preserveAspectRatio", "xMidYMid meet")
            // .attr("width", width)
            // .attr("height", height)
            .classed("svg", true);
  } else {
    margin = {top: 30, right: 10, bottom: 150, left: 70};
    width = 800;
    height = 600;
    svg = d3.select("#linechart")
            .append("svg")
            .attr("viewBox", "0 0 800 600")
            .attr("preserveAspectRatio", "xMidYMid meet")
            // .attr("width", width)
            // .attr("height", height)
            .classed("svg", true);
  }



  return [svg, width, height, margin];

}

function create_linechart(svg, width, height, margin, response, svg_pie, svg_map, width_map, height_map) {
  // this function adds the barchart to the svg made before

  var security = response[0];
  var xScale, yScale;

  var maximum_y = 0;
  var keys = [];
  var range_keys = [margin.left];

  for (var key in security) {
    keys.push(key);
    // 20 is het aantal keys
    range_keys.push(range_keys[range_keys.length - 1] + (width - margin.left) / 20);
    if (security[key].total > maximum_y) {
      maximum_y = security[key].total
    }
  }
  range_keys.splice(range_keys.length - 1, 1);

  // define x and y scale
  xScale = d3.scaleOrdinal()
                 .domain(keys)
                 .range(range_keys);

  yScale = d3.scaleLinear()
                 .domain([0, maximum_y])
                 .range([height - margin.bottom, margin.top]);

   // add y-axis
   svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(70, 0)")
      .call(d3.axisLeft(yScale));

   // add label y-axis
   svg.append("text")
      .attr("transform", "translate(25, 220) rotate(-90)")
      .attr("class", "y-axis-text")
      .text("Number of benefits (x1000)");

  // add x-axis
  svg.append("g")
     .attr("class", "x-axis")
     .attr("transform", "translate(0, 450)")
     .attr("tickSize", "0")
     .call(d3.axisBottom(xScale))

  svg.append("text")
     .attr("x", width - margin.right - 80)
     .attr("y", height - margin.bottom / 1.5)
     // .attr("text-anchor", "end")
     .text("Year");

   var data = []
   for (var key in security) {
     data.push([+key, security[key].total]);
     // console.log(key);
     // console.log(security[key]);
   }

   // console.log(data);

   var format = d3.format(",");

   var tip = d3.tip()
               .attr('class', 'd3-tip')
               .offset([-10, 0])
               .html(function(d) {
                   return "<strong>Year: </strong><span class='details'>" + d[0] + "<br><strong>Number of benefits: </strong><span class='details'>" + format(d[1]) +"</span>";
               });

   svg.call(tip);

   // add line
   var lineFunction = d3.line()
                        .x(function(d) {
                            return xScale(d[0]);
                        })
                        .y(function(d) {
                            return yScale(d[1]);
                        });

   svg.append("path")
      .attr("d", lineFunction(data))
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("fill", "none");

  // add dots
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
     .attr("class", "dots_line")
     .attr("r", 3.5)
     .attr("cx", function(d) {
       return xScale(d[0]);
     })
     .attr("cy", function(d) {
       return yScale(d[1]);
     })
     .style("fill", "green")
     .style("opacity", 0.8)
     .on('mouseover',function(d) {
       // on mouseover: show tooltip and change color
       tip.show(d);

       d3.select(this)
         .attr("r", 5)
         .style("opacity", 1);
     })
     .on('mouseout', function(d) {
       // on mouseout: hide tooltip and change color to its original
       tip.hide(d);

       d3.select(this)
         .attr("r", 3.5)
         .style("opacity", 0.8);
     })
     .on('click', function(d) {
       var year = d[0];
       // console.log(year);
       var sort = d3.select(".title_map").text().substr(0,7);
       console.log(sort);
       if (sort == "Number ") {
         sort = "Number";
       }
       svg_pie = update_pie(svg_pie, response, year);
       svg_map = update_map_year(svg_map, width_map, height_map, response, year, sort);
       change_title("pie", year);
       change_title("map", year, sort);
       update_slider(year);
     });

  return [svg, xScale, yScale];
}

function change_title(sort, year, sort_map="") {
  // this function changes the title when the barchart has to be updated
  if (sort == "pie") {
    d3.selectAll(".title_pie").each(function(d, i) {
      d3.select(this).text("The distribution of benefits - " + year);
    });
  } else {
    if (year >= 2015) {
      d3.selectAll(".title_map").each(function(d, i) {
        console.log(sort_map);
        d3.select(this).text(sort_map + " of 'bijstand' benefits (per 1000 residents) in The Netherlands - " + year);
      })
    }
  }
}

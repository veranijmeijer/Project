// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function create_linechart(svg, width, height, margin, response, svg_pie, svg_map, width_map, height_map) {
  // this function adds the linechart to the already existing svg

  var security = response[0];
  var xScale, yScale;

  var maximum_y = 0;
  var keys = [];
  var range_keys = [margin.left];
  var nr_of_keys = 20;

  // create list of data
  for (var key in security) {
    keys.push(key);
    range_keys.push(range_keys[range_keys.length - 1] + (width - margin.left) / nr_of_keys);
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
      .attr("transform", "translate(15, 250) rotate(-90)")
      .attr("class", "y-axis-text")
      .text("Aantal uitkeringen (x1000)");

  // add x-axis
  svg.append("g")
     .attr("class", "x-axis")
     .attr("transform", "translate(0, 540)")
     .attr("tickSize", "0")
     .call(d3.axisBottom(xScale))

  svg.append("text")
     .attr("class", "x-axis-text")
     .attr("x", width - margin.right - 80)
     .attr("y", 585)
     .text("Jaartal");

   var data = []
   for (var key in security) {
     data.push([+key, security[key].total]);
   }

   var format = d3.format(",");

   // create tooltip
   var tip = d3.tip()
               .attr('class', 'd3-tip')
               .offset([-10, 0])
               .html(function(d) {
                   return "<strong>Jaartal: </strong><span class='details'>" + d[0] + "</span><br><strong>Aantal uitkeringen: </strong><span class='details'>" + format(d[1]) +"</span>";
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

  // add line
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
       // on click: update pie and map
       var year = d[0];
       var sort = d3.select(".title_map").text().substr(0,9);
       if (sort != "Dichtheid") {
         sort = "Totale aantal";
       }
       svg_pie = update_pie(svg_pie, response, year);
       svg_map = update_map(svg_map, width_map, height_map, response, year, sort);
       change_title("pie", year);
       change_title("map", year, sort);
     });

  return [svg, xScale, yScale];
}

function update_line(svg, response, sort_line, color, margin) {
  // when the pie chart is clicked: adds/removes the line
  var line = "line_" + sort_line;
  var circle = "circle_" + sort_line;

  // checks if line already exists
  if (svg.selectAll("#" + line).empty() == true) {
    var security = response[0];
    var xScale, yScale;

    var maximum_y = 0;
    var keys = [];
    var range_keys = [margin.left];
    var nr_of_keys = 20;
    var width = 800;
    var height = 600;

    // creates list of data
    for (var key in security) {
      keys.push(key);
      range_keys.push(range_keys[range_keys.length - 1] + (width - margin.left) / nr_of_keys);
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

     var data = []
     // adds correct data to datalist
     for (var key in security) {
       var info;
       if (sort_line == "WAO") {
         info = security[key].WAO;
       } else if (sort_line == "Wajong") {
         info = security[key].Wajong;
       } else if (sort_line == "WAZ") {
         info = security[key].WAZ;
       } else if (sort_line == "IVA") {
         info = security[key].IVA;
       } else if (sort_line == "WGA") {
         info = security[key].WGA;
       } else if (sort_line == "Werkloosheidsuitkering") {
         info = security[key].Werkloosheidsuitkering;
       } else if (sort_line == "IOW") {
         info = security[key].IOW;
       } else if (sort_line == "Bijstand") {
         info = security[key].Bijstand;
       } else if (sort_line == "IOAW") {
         info = security[key].IOAW;
       } else if (sort_line == "IOAZ") {
         info = security[key].IOAZ;
       } else if (sort_line == "AOW") {
         info = security[key].AOW;
       } else if (sort_line == "ANW") {
         info = security[key].ANW;
       } else if (sort_line == "AKW") {
         info = security[key].AKW;
       }
       data.push([+key, info]);
     }

     var format = d3.format(",");

     var tip = d3.tip()
                 .attr('class', 'd3-tip')
                 .offset([-10, 0])
                 .html(function(d) {
                     return "<strong>Jaartal: </strong><span class='details'>" + d[0] + "<br><strong>Aantal uitkeringen: </strong><span class='details'>" + format(d[1]) +"</span>";
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
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("id", line);

    // add dots
    svg.selectAll(circle)
      .data(data)
      .enter().append("circle")
       .attr("class", circle)
       .attr("r", 3.5)
       .attr("cx", function(d) {
         return xScale(d[0]);
       })
       .attr("cy", function(d) {
         return yScale(d[1]);
       })
       .style("fill", color)
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
       });
  } else {
    // if line was already there, removes it
    svg.selectAll("#" + line).remove();
    svg.selectAll("." + circle).remove();
  }

  return svg;
}

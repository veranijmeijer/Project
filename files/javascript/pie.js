// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function create_pie(svg, margin, width, height, response, svg_line, margin_line, svg_legend_pie, year=2017) {
  var format = d3.format(",");
  var security = response[0];
  var colors = {"WAO":'#e6194b', "Wajong":'#3cb44b', "WAZ":'#ffe119', "IVA":'#4363d8', "WGA":'#f58231', "Werkloosheidsuitkering":'#911eb4', "IOW":'#46f0f0', "Bijstand":'#f032e6', "IOAW":'#bcf60c', "IOAZ":'#800000', "AOW":'#008080', "ANW":'#e6beff', "AKW":'#9a6324'}

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                  return "<strong>" + d.data.name + ": </strong><span class='details'>" + format(d.data.number) + "</span>";
              });

  svg.call(tip);

  var details = []
  for (var key in security) {
    if (key == year) {
      for (var uitkering in security[key]) {
        if (uitkering != "total") {
          details.push({"name":uitkering, "number":security[key][uitkering]});
        }
      }
    }
  }

  // source: https://www.youtube.com/watch?v=P8KNr0pDqio
  var data = d3.pie()
               .sort(null)
               .value(function(d) {
                 return d.number;
               })(details);

  var segments = d3.arc()
                   .innerRadius(0)
                   .outerRadius(250);

  var sections = svg.append("g")
                    .attr("class", "sec")
                   .attr("transform", "translate(300, 300)")
                    .selectAll("path")
                    .data(data);

  sections.enter()
          .append("path")
          .attr("d", segments)
          .attr("class", "pie")
          .attr("fill", function(d) {
            return colors[d.data.name];
          })
          .attr("id", function(d) {
            return d.data.name;
          })
          .on('mouseover',function(d) {
            // on mouseover: show tooltip and change color
            tip.show(d);

            d3.select(this)
              .style("opacity", 0.8)
              .style("stroke","white")
              .style("stroke-width",3);
          })
          .on('mouseout', function(d) {
            // on mouseout: hide tooltip and change color to its original
            tip.hide(d);

            d3.select(this)
              .style("opacity", 1)
              .style("stroke","white")
              .style("stroke-width",0.1);
          })
          .on('click', function(d) {
            sort_line = this.id;
            var color = colors[sort_line];
            svg_line = update_line(svg_line, response, sort_line, color, margin_line);
          });
  svg_legend_pie.selectAll(".rect_pie")
                .on('mouseover', function(d) {
                  d3.select(this)
                    .style("opacity", 0.8);
                })
                .on('mouseout', function(d) {
                  d3.select(this)
                    .style("opacity", 1);
                })
                .on('click', function(d) {
                  sort_line = this.id;
                  var color = colors[sort_line];
                  update_line(svg_line, response, sort_line, color, margin_line);
                });

}

function update_pie(svg, response, year) {
  var previous_year = d3.selectAll(".title_pie").text().substr(-4,);


  if (year != previous_year) {
    var security = response[0];
    var colors = {"WAO":'#e6194b', "Wajong":'#3cb44b', "WAZ":'#ffe119', "IVA":'#4363d8', "WGA":'#f58231', "Werkloosheidsuitkering":'#911eb4', "IOW":'#46f0f0', "Bijstand":'#f032e6', "IOAW":'#bcf60c', "IOAZ":'#800000', "AOW":'#008080', "ANW":'#e6beff', "AKW":'#9a6324'}

    var details = []
    for (var key in security) {
      if (key == year) {
        for (var uitkering in security[key]) {
          if (uitkering != "total") {
            details.push({"name":uitkering, "number":security[key][uitkering]});
          }
        }
      }
    }

    var data = d3.pie()
                 .sort(null)
                 .value(function(d) {
                   return d.number;
                 })(details);

    var segments = d3.arc()
                     .innerRadius(0)
                     .outerRadius(250);

    var sections = svg.selectAll(".sec")
                      .selectAll("path")
                      .data(data);


    svg.selectAll(".pie")
       .transition()
       .duration(1000)
       .attr("d", segments)
       .attr("fill", function(d) {
         return colors[d.data.name];
       });
  }
  return svg;
}

function update_line(svg, response, sort_line, color, margin) {
  var line = "line_" + sort_line;
  var circle = "circle_" + sort_line;
  console.log(svg);

  console.log(svg.selectAll("#" + line).empty());
  if (svg.selectAll("#" + line).empty() == true) {
    console.log("toeveoegen");
    var security = response[0];
    var xScale, yScale;

    var maximum_y = 0;
    var keys = [];
    var range_keys = [margin.left];

    for (var key in security) {
      keys.push(key);
      // 20 is het aantal keys
      range_keys.push(range_keys[range_keys.length - 1] + (800 - margin.left) / 20);
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
                   .range([600 - margin.bottom, margin.top]);

     var data = []
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
    svg.selectAll("#" + line).remove();
    svg.selectAll("." + circle).remove();
  }

  return svg;
}

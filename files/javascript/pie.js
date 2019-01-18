// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function create_pie(svg, margin, width, height, response, year=2017) {
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

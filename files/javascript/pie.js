// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function create_pie(svg, margin, width, height, response, year=2017) {
  var format = d3.format(",");
  var security = response[0];
  // values = ["WAO","Wajong","WAZ","IVA","WGA","Werkloosheidsuitkering","IOW","Bijstand","IOAW","IOAZ","AOW","ANW","AKW"];
  var colors = {"WAO":'#e6194b', "Wajong":'#3cb44b', "WAZ":'#ffe119', "IVA":'#4363d8', "WGA":'#f58231', "Werkloosheidsuitkering":'#911eb4', "IOW":'#46f0f0', "Bijstand":'#f032e6', "IOAW":'#bcf60c', "IOAZ":'#800000', "AOW":'#008080', "ANW":'#e6beff', "AKW":'#9a6324'}

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                  return "<strong>" + d.properties.statnaam + "</strong><span class='details'>" + format(d.bijstand) + "</span>";
              });

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

  console.log(details);

  // source: https://www.youtube.com/watch?v=P8KNr0pDqio
  var data = d3.pie()
               .sort(null)
               .value(function(d) {
                 return d.number;
               })(details);

  console.log(data);

  var segments = d3.arc()
                   .innerRadius(0)
                   .outerRadius(200)
                   // .padAngle(.05)
                   .padRadius(50);

  console.log(segments);

  var sections = svg.append("g")
                   .attr("transform", "translate(275, 250)")
                    .selectAll("path")
                    .data(data);

  sections.enter()
          .append("path")
          .attr("d", segments)
          .attr("fill", function(d) {
            return colors[d.data.name];
          });
}

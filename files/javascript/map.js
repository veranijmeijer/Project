// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

// source map: https://cartomap.github.io/nl/wgs84/gemeente_2017.geojson

function add_legend(svg) {
  // define size of svg
  var w = 200;
  var h = 220;
  //
  // // create svg
  // var svg = d3.select("body")
  //             .append("svg")
  //             .attr("width", w)
  //             .attr("height", h)
  //             .attr("class", "svg");

  var values = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  var colors = ['rgb(247,252,245)','rgb(229,245,224)','rgb(199,233,192)','rgb(161,217,155)','rgb(116,196,118)','rgb(65,171,93)','rgb(35,139,69)','rgb(0,109,44)','rgb(0,68,27)'];

  // add background legend
  svg.append("rect")
     .attr("x", 650)
     .attr("y", 0)
     .attr("width", 150)
     .attr("height", 220)
     .attr("class", "legend");

  // add title legend
  svg.append("text")
     .attr("x", 725)
     .attr("y", 18)
     .attr("class", "titles")
     .style("text-anchor", "middle")
     .text("Legend");

  // add rectangles for legend
  svg.selectAll("rect_leg")
     .data(colors)
     .enter().append("rect")
     .attr("x", 655)
     .attr("y", function(d, i) {
       return 20 + i * 22;
     })
     .attr("width", 20)
     .attr("height", 20)
     .style("fill", function(d) {
       return d;
     });

  // add text for legend
  svg.selectAll("leg_text")
     .data(values)
     .enter().append("text")
     .attr("x", 680)
     .attr("y", function(d, i) {
       return 37 + i * 22;
     })
     .attr("class", "leg_text")
     .text(function(d) {
       return d;
     });

}

function create_map(svg, margin, width, height, response, year=2017) {
  var format = d3.format(",");
  // set tooltips, source: http://bl.ocks.org/Caged/6476579
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                  return "<strong>Gemeente: </strong><span class='details'>" + d.properties.statnaam + "<br></span>" + "<strong>Bijstandsdichtheid: </strong><span class='details'>" + format(d.bijstand) +"</span>";
              });

// source colorscheme: http://colorbrewer2.org/?type=sequential&scheme=Greens&n=9
  var color = d3.scaleLinear()
      .domain([0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100])
      .range(['rgb(247,252,245)','rgb(229,245,224)','rgb(199,233,192)','rgb(161,217,155)','rgb(116,196,118)','rgb(65,171,93)','rgb(35,139,69)','rgb(0,109,44)','rgb(0,68,27)']);
  // path = d3.geoPath();

  var projection = d3.geoMercator()
                     .scale(8900)
                     .translate([-width / 1.55, height * 12.4]);

  var path = d3.geoPath().projection(projection);


  svg.call(tip);

  var bijstand = response[1];
  var country = response[2];

  var bijstandByIndex = {};

  for (var key in bijstand) {
    bijstandByIndex[key] = bijstand[key].Bijstandsdichtheid;
  }

  // connects data to world map
  country.features.forEach(function(d) {
    if (bijstandByIndex[d.properties.statcode]) {
      d.bijstand = bijstandByIndex[d.properties.statcode];
    } else {
      bijstandByIndex[d.properties.statcode] = 0;
      d.bijstand = 0;
    }
  });

  // appends countries to svg
  svg.append("g")
     .attr("class", "countries")
     .selectAll("path")
      .data(country.features)
    .enter().append("path")
      .attr("d", path)
      // fill country with the correct color
      .style("fill", function(d) { return color(bijstandByIndex[d.properties.statcode]); })
      .style("stroke", "white")
      .style("stroke-width", 1.5)
      .style("opacity", 0.8)
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d) {
          // on mouseover: show tooltip and change color
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
      })
      .on('mouseout', function(d) {
        // on mouseout: hide tooltip and change color to its original
        tip.hide(d);

        d3.select(this)
          .style("opacity", 0.8)
          .style("stroke","white")
          .style("stroke-width",0.3);
      });
  //     // .on('click', function(d) {
  //     //   // on mouseclick: update barchart for clicked country
  //     //   var country = d.properties.name;
  //     //   change_title("bar", country);
  //     //   svg_bar = update_barchart(svg_bar, margin_bar, width, height, country, response, xScale_bar, yScale_bar);
  //     // });

  svg.append("path")
     .datum(topojson.mesh(country.features, function(a, b) { return a.id !== b.id; }))
     .attr("class", "names")
     .attr("d", path);

  return 0;
}
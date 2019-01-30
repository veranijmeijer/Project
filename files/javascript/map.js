// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function create_map(svg, margin, width, height, response) {
  var year = 2017;
  var format = d3.format(",");
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                  return "<strong>Gemeente: </strong><span class='details'>" + d.properties.statnaam + "<br></span>" + "<strong>Dichtheid: </strong><span class='details'>" + format(d.bijstand) +"</span>";
              });

  var color = d3.scaleLinear()
                .domain([100, 87.5, 75, 62.5, 50, 37.5, 25, 12.5, 0])
                .range(['#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850']);

  var projection = d3.geoMercator()
                     .scale(8900)
                     .translate([-width / 1.55, height * 12.4]);

  var path = d3.geoPath().projection(projection);


  svg.call(tip);

  var bijstand = response[year - 2014];
  var country = response[year - 2011];

  var bijstandByIndex = {};

  for (var key in bijstand) {
    bijstandByIndex[key] = bijstand[key].Bijstandsdichtheid;
  }

  // connects data to map
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

  svg.append("path")
     .datum(topojson.mesh(country.features, function(a, b) { return a.id !== b.id; }))
     .attr("class", "names")
     .attr("d", path);

  return 0;
}

function add_warning() {
  d3.select("#map").append("p")
                   .attr("class", "warning")
                   .style("visibility", "hidden");
}

function show_warning(year, previous_year) {
  d3.selectAll(".warning")
    .text("There is no data available for " + year + ". The map of " + previous_year + " is still being shown.")
    .style("visibility", "visible");
}

function hide_warning() {
    d3.selectAll(".warning")
      .style("visibility", "hidden");
}

function update_map(svg, width, height, response, year, sort) {
  hide_warning();
  var previous_year = d3.selectAll(".title_map").text().substr(-4,);
  if (year < 2015) {
    show_warning(year, previous_year);
    return svg;
  } else {


    var projection = d3.geoMercator()
                       .scale(8900)
                       .translate([-width / 1.55, height * 12.4]);

    var path = d3.geoPath().projection(projection);

    var bijstand = response[year - 2014];
    // has te be changed because the gemeentes changed
    var country = response[year - 2011];

    var bijstandByIndex = {};
    var color;
    for (var key in bijstand) {
      if (sort == "Dichtheid") {
        color = d3.scaleLinear()
                  .domain([100, 87.5, 75, 62.5, 50, 37.5, 25, 12.5, 0])
                  .range(['#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850']);

        bijstandByIndex[key] = bijstand[key].Bijstandsdichtheid;
      } else {
        color = d3.scaleLinear()
                  .domain([50000, 43750, 37500, 31250, 25000, 18750, 12500, 6250, 0])
                  .range(['#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850']);
        bijstandByIndex[key] = bijstand[key].Bijstandsontvangers;
      }
    }

    // connects data to map
    country.features.forEach(function(d) {
      if (bijstandByIndex[d.properties.statcode]) {
        d.bijstand = bijstandByIndex[d.properties.statcode];
      } else {
        bijstandByIndex[d.properties.statcode] = 0;
        d.bijstand = 0;
      }
    });

    var format = d3.format(",");

    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Gemeente: </strong><span class='details'>" + d.properties.statnaam + "<br></span>" + "<strong>" + sort + ": </strong><span class='details'>" + format(d.bijstand) +"</span>";
                });

    svg.call(tip);

    svg.selectAll(".countries")
       .remove();

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
  }


  return svg;
}

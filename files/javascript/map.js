// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

// source map: https://cartomap.github.io/nl/wgs84/gemeente_2017.geojson

function add_legend(svg, sort) {
  // define size of svg
  var w, h, values, colors;
  console.log(sort);
  if (sort == "map") {
    w = 150;
    h = 220;
    values = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
    colors = {0: '#1a9850', 12.5: '#66bd63', 25: '#a6d96a', 37.5: '#d9ef8b', 50: '#ffffbf', 62.5: '#fee08b', 75: '#fdae61', 87.5: '#f46d43', 100: '#d73027'};
  } else {
    sort = "pie"
    w = 200;
    h = 310;
    // source: https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
    values = ["WAO","Wajong","WAZ","IVA","WGA","Werkloosheidsuitkering","IOW","Bijstand","IOAW","IOAZ","AOW","ANW","AKW"];
    colors = {"WAO":'#e6194b', "Wajong":'#3cb44b', "WAZ":'#ffe119', "IVA":'#4363d8', "WGA":'#f58231', "Werkloosheidsuitkering":'#911eb4', "IOW":'#46f0f0', "Bijstand":'#f032e6', "IOAW":'#bcf60c', "IOAZ":'#800000', "AOW":'#008080', "ANW":'#e6beff', "AKW":'#9a6324'}
  }

  // add background legend
  svg.append("rect")
     .attr("x", 800 - w)
     .attr("y", 0)
     .attr("width", w)
     .attr("height", h)
     .attr("class", "legend");

  // add title legend
  svg.append("text")
     .attr("x", 800 - w + w / 2)
     .attr("y", 18)
     .attr("class", "titles")
     .style("text-anchor", "middle")
     .text("Legenda");

  // add rectangles for legend
  svg.selectAll("rect_leg")
     .data(values)
     .enter().append("rect")
     .attr("class", "rect_" + sort)
     .attr("id", function(d) {
       return d;
     })
     .attr("x", 800 - w + 5)
     .attr("y", function(d, i) {
       return 20 + i * 22;
     })
     .attr("width", 20)
     .attr("height", 20)
     .style("fill", function(d) {
       return colors[d];
     });


  // add text for legend
  svg.selectAll("leg_text")
     .data(values)
     .enter().append("text")
     .attr("x", 800 - w + 30)
     .attr("y", function(d, i) {
       return 37 + i * 22;
     })
     .attr("class", "leg_text")
     .text(function(d) {
       return d;
     });
  return svg;
}

function create_map(svg, margin, width, height, response, year=2017) {
  var format = d3.format(",");
  // set tooltips, source: http://bl.ocks.org/Caged/6476579
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                  return "<strong>Gemeente: </strong><span class='details'>" + d.properties.statnaam + "<br></span>" + "<strong>Density: </strong><span class='details'>" + format(d.bijstand) +"</span>";
              });

// source colorscheme: http://colorbrewer2.org/?type=sequential&scheme=Greens&n=9
  var color = d3.scaleLinear()
                .domain([100, 87.5, 75, 62.5, 50, 37.5, 25, 12.5, 0])
                .range(['#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63','#1a9850']);
  // path = d3.geoPath();

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

function update_map_year(svg, width, height, response, year, sort) {
  // if (sort == "Density") {
  //   sort = "Bijstandsdichtheid";
  // } else {
  //   sort = "Bijstandsontvangers"
  // }
  console.log(sort, "ja");
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
      // console.log(d);
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


    // svg.selectAll(".countries")
    //    .selectAll("path")
    //    .data(country.features)
    //    .attr("d", path)
    //    // fill country with the correct color
    //    .style("fill", function(d) {
    //      return color(bijstandByIndex[d.properties.statcode]);
    //    });
  }


  return svg;
}

// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function create_title(sort, country="") {
  // this function adds the title above the svg
  if (sort == "map") {
    d3.select("body").append("h4").attr("class", "title_map").text("Map of 'Bijstandsuitkeringen' in The Netherlands");
  } else {
    d3.select("body").append("h4").attr("class", "title_bar").text("Barchart social security The Netherlands");
  }
}

function add_svg(sort) {
  // this function adds the svg, but does not fill it yet
  var margin, width, height;

  if (sort == "map") {
    margin = {top: 0, right: 0, bottom: 0, left: 0};
    width = 800;
    height = 800;
  } else {
    margin = {top: 30, right: 10, bottom: 150, left: 50};
    width = 600;
    height = 500;
  }



  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .classed("svg", true);

  return [svg, width, height, margin];

}

function create_barchart(svg, width, height, margin, response) {
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
      .attr("transform", "translate(50, 0)")
      .call(d3.axisLeft(yScale));

   // add label y-axis
   // svg.append("text")
   //    .attr("transform", "translate(15, 100) rotate(-90)")
   //    .attr("class", "y-axis-text")
   //    .text("Index");

  // add x-axis
  svg.append("g")
     .attr("class", "x-axis")
     .attr("transform", "translate(0, 350)")
     .attr("tickSize", "0")
     .call(d3.axisBottom(xScale))

   // .selectAll("text")
   //   .attr("y", 55)
   //   .attr("x", -5)
   //   .attr("transform", "rotate(-90)")
   //   .style("text-anchor", "end");


  // security.forEach(function(element) {
  //   if (element.Country == country) {
  //
  //     var datasets = [];
  //
  //     var range_keys = [margin.left];
  //     var max_value = 0;
  //
  //     // creates list of values for barchart
  //     for (var key in element) {
  //       if (key != "Rank" && key != "Country" && key != "Quality of Life Index") {
  //         var dataset = [];
  //         dataset.push(key, +element[key]);
  //         if (+element[key] > max_value) {
  //           max_value = +element[key];
  //         }
  //         datasets.push(dataset);
  //         keys.push(key);
  //         range_keys.push(range_keys[range_keys.length - 1] + 112.5);
  //       }
  //     }
  //
  //     // calculates max value for y scale
  //     max_value = Math.ceil(max_value / 10) * 10;
  //
  //     // define x and y scale
  //     xScale = d3.scaleOrdinal()
  //                    .domain(keys)
  //                    .range(range_keys);
  //
  //     yScale = d3.scaleLinear()
  //                    .domain([0, max_value])
  //                    .range([height - margin.bottom, margin.top]);
  //
  //      // add y-axis
  //      svg.append("g")
  //         .attr("class", "y-axis")
  //         .attr("transform", "translate(50, 0)")
  //         .call(d3.axisLeft(yScale));
  //
  //      // add label y-axis
  //      svg.append("text")
  //         .attr("transform", "translate(15, 100) rotate(-90)")
  //         .attr("class", "y-axis-text")
  //         .text("Index");
  //
  //    // add x-axis
  //    svg.append("g")
  //       .attr("class", "x-axis")
  //       .attr("transform", "translate(0, 450)")
  //       .attr("tickSize", "0")
  //       .call(d3.axisBottom(xScale))
  //     .selectAll("text")
  //       .attr("y", 55)
  //       .attr("x", -5)
  //       .attr("transform", "rotate(-90)")
  //       .style("text-anchor", "end");
  //
  //     var padding = 5;
  //
  //     // add bars
  //     svg.selectAll("rect")
  //        .data(datasets)
  //        .enter()
  //        .append("rect")
  //        .attr("class", "bars")
  //        .attr("x", function(d) {
  //          return xScale(d[0]) + padding / 2;
  //        })
  //        .attr("y", function(d) {
  //          return yScale(d[1]);
  //        })
  //        .attr("width", (width - margin.left) / datasets.length - padding)
  //        .attr("height", function(d) {
  //          return yScale(0) - yScale(d[1]);
  //        })
  //        .style("fill", "rgb(0,88,36)")
  //        .on('mouseover',function(d){
  //          // on mouseover: show tip and change color
  //          tip.show(d);
  //
  //          d3.select(this)
  //            .style("fill", 'rgb(102,194,164)');
  //      })
  //      .on('mouseout', function(d){
  //        // on mouseout: hide tip and change color back
  //        tip.hide(d);
  //        d3.select(this)
  //          .style("fill", 'rgb(0,88,36)');
  //      });
  //   }
  // });
  return [svg, xScale, yScale];
}

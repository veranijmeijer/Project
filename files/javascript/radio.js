// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function add_radio(svg, width, height, response, svg_legend) {
  d3.selectAll(".sizeSelect").on("click", function(d,i) {  // <-- 1
      // console.log(this.value);

      sort = this.value;
      console.log(sort);
      update_map_sort(svg, width, height, response, sort);
      if (sort == "dichtheid") {
        sort = "Bijstandsdichtheid";
      } else {
        sort = "Bijstandsontvangers"
      }
      var year = d3.selectAll(".title_map").text().substr(-4,);
      change_title("map", year, sort);
      console.log("joe");
      update_legend(svg_legend, sort);

      // Determine how to size the slices.
      // if (this.value === "size") {  // <-- 2
      //   root.sum(function (d) { return d.size; });  // <-- 3
      // } else {  // <-- 2
      //   root.count();  // <-- 4
      // }
      // root.sort(function(a, b) { return b.value - a.value; });  // <-- 5
      //
      // partition(root);  // <-- 6
      //
      // slice.selectAll("path").transition().duration(750).attrTween("d", arcTweenPath);  // <-- 7
      // slice.selectAll("text").transition().duration(750).attrTween("transform", arcTweenText);  // <-- 8

  });
}

function update_legend(svg, sort) {
  var colors = ['rgb(247,252,245)','rgb(229,245,224)','rgb(199,233,192)','rgb(161,217,155)','rgb(116,196,118)','rgb(65,171,93)','rgb(35,139,69)','rgb(0,109,44)','rgb(0,68,27)'];
  var values;
  if (sort == "dichtheid") {
    values = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  } else {
    values = [0, 50, 100, 150, 200, 250, 300, 350, 400];
  }

  // w=150
  // // add rectangles for legend
  // svg.selectAll("rect_leg")
  //    .data(colors)
  //    .enter().append("rect")
  //    .attr("x", 800 - 150 + 5)
  //    .attr("y", function(d, i) {
  //      return 20 + i * 22;
  //    })
  //    .attr("width", 20)
  //    .attr("height", 20)
  //    .style("fill", function(d) {
  //      return d;
  //    });

  // add text for legend
  svg.selectAll("leg_text")
     .data(values)
     .select("text")
     .attr("x", 800 - 150 + 30)
     .attr("y", function(d, i) {
       return 37 + i * 22;
     })
     .attr("class", "leg_text")
     .text(function(d) {
       return d;
     });
}

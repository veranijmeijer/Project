// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function add_radio(svg, width, height, response, svg_legend) {
  d3.selectAll(".sizeSelect").on("click", function(d,i) {
      var year = d3.selectAll(".title_map").text().substr(-4,);
      sort = this.value;
      update_map(svg, width, height, response, year, sort);

      change_title("map", year, sort);
      update_legend(svg_legend, sort);
  });
}

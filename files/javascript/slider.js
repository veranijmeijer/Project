// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function add_slider(svg_pie, response, svg_map, width, height) {
  // Time, source: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
    var dataTime = d3.range(0, 20).map(function(d) {
      return new Date(1998 + d, 10, 3);
    });

    var sliderTime = d3
      .sliderBottom()
      .min(d3.min(dataTime))
      .max(d3.max(dataTime))
      .step(1000 * 60 * 60 * 24 * 365)
      .width(450)
      // .attr("font-size", 8)
      .tickFormat(d3.timeFormat('%Y'))
      .tickValues(dataTime)
      // .attr("class", "slider-ticks")
      .default(new Date(2017, 10, 3))
      .on('onchange', val => {
        var year = d3.timeFormat('%Y')(val);
        update_pie(svg_pie, response, year);
        var sort = d3.select(".title_map").text().substr(0,7);
        if (sort == "Number ") {
          sort = "Number";
        }
        update_map_year(svg_map, width, height, response, year, sort);
        change_title("pie", year);
        change_title("map", year, sort);
      });

    var gTime = d3
      .select('div#slider-time')
      .append('svg')
      .attr('width', 700)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(20,20)');

    gTime.call(sliderTime);

    // d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
}

function update_slider(year) {
  // verander de slider wanneer in de linechart ergens op wordt geklikt
  // d3.select('div#slider-time')
  //   .default(new Date(year, 10, 3));
}

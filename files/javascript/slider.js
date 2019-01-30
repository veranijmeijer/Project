// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function add_slider(svg_pie, response, svg_map, width, height) {
    var dataTime = d3.range(0, 20).map(function(d) {
      return new Date(1998 + d, 10, 3);
    });

    var sliderTime = d3
      .sliderBottom()
      .min(d3.min(dataTime))
      .max(d3.max(dataTime))
      .step(1000 * 60 * 60 * 24 * 365)
      .width(650)
      .tickFormat(d3.timeFormat('%Y'))
      .tickValues(dataTime)
      .default(new Date(2017, 10, 3))
      .on('onchange', val => {
        var year = d3.timeFormat('%Y')(val);
        update_pie(svg_pie, response, year);
        var sort = d3.select(".title_map").text().substr(0,9);
        update_map(svg_map, width, height, response, year, sort);
        change_title("pie", year);
        change_title("map", year, sort);
      });

    var gTime = d3
      .select('div#slider-time')
      .append('svg')
      .attr("viewBox", "0 0 700 100")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("svg", true)
      .append('g')
      .attr('transform', 'translate(20,20)');

    gTime.call(sliderTime);
}

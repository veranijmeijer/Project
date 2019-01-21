// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

window.onload = function() {
  var social = "data/json/social_security.json";
  var gemeente_2015 = "data/json/gemeente_2015.json";
  var gemeente_2016 = "data/json/gemeente_2016.json";
  var gemeente_2017 = "data/json/gemeente_2017.json";
  var country_2015 = "data/json/map_2015.json";
  var country_2016 = "data/json/map_2016.json";
  var country_2017 = "data/json/map_2017.json";

  var requests = [d3.json(social), d3.json(gemeente_2015), d3.json(gemeente_2016), d3.json(gemeente_2017), d3.json(country_2015), d3.json(country_2016), d3.json(country_2017)];

  Promise.all(requests).then(function(response) {

    create_title("line");
    var linechart = add_svg("linechart");
    var svg_line = linechart[0];
    var width_line = linechart[1];
    var height_line = linechart[2];
    var margin_line = linechart[3];

    create_title("pie");
    var pie = add_svg("pie");
    var svg_pie = pie[0];
    var width_pie = pie[1];
    var height_pie = pie[2];
    var margin_pie = pie[3];
    add_legend(svg_pie);

    create_title("map");
    add_warning();
    var map = add_svg("map");
    var svg_map = map[0];
    var width_map = map[1];
    var height_map = map[2];
    var margin_map = map[3];
    add_legend(svg_map, "map");

    add_slider(svg_pie, response, svg_map, width_map, height_map);
    add_radio(svg_map, width_map, height_map, response);
    create_pie(svg_pie, width_pie, height_pie, margin_pie, response);
    create_map(svg_map, margin_map, width_map, height_map, response);
    create_linechart(svg_line, width_line, height_line, margin_line, response, svg_pie, svg_map, width_map, height_map);

  }).catch(function(e){
      throw(e);
  });
};

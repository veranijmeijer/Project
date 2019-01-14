// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

window.onload = function() {
  var social = "data/json/social_security.json";
  var gemeente_2017 = "data/json/gemeente_2017.json";
  var country = "data/json/map.json"

  var requests = [d3.json(social), d3.json(gemeente_2017), d3.json(country)];

  Promise.all(requests).then(function(response) {
    create_title("bar");

    var barchart = add_svg("barchart");
    var svg_bar = barchart[0];
    var width_bar = barchart[1];
    var height_bar = barchart[2];
    var margin_bar = barchart[3];

    create_barchart(svg_bar, width_bar, height_bar, margin_bar, response);

    create_title("map");
    var map = add_svg("map");
    var svg_map = map[0];
    var width_map = map[1];
    var height_map = map[2];
    var margin_map = map[3];
    add_legend(svg_map);

    create_map(svg_map, margin_map, width_map, height_map, response);

  }).catch(function(e){
      throw(e);
  });
};

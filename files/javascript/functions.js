// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function create_title(sort, country="") {
  // this function adds the title above the svg, selects correct container
  if (sort == "map") {
    d3.select("#map").append("h6").attr("class", "title_map")
      .text("Dichtheid van bijstandsuitkeringen (per 1000 inwoners) in Nederland - 2017");
  } else if (sort == "pie") {
    d3.select("#pie").append("h6").attr("class", "title_pie")
      .text("De verdeling van uitkeringen - 2017");
  } else {
    d3.select("#linechart").append("h6").attr("class", "title_line")
      .text("Aantal uitkeringen in Nederland");
  }
}

function add_svg(sort) {
  // this function adds the svg, but does not fill it yet
  var svg, margin, width, height;

  if (sort == "map") {
    margin = {top: 0, right: 0, bottom: 0, left: 0};
    width = 600;
    height = 600;
  } else if (sort == "legend") {
    width = 500
    height = 750
  } else {
    margin = {top: 30, right: 10, bottom: 60, left: 70};
    width = 800;
    height = 600;
  }

  // creates svg
  svg = d3.select("#" + sort)
           .append("svg")
           .attr("viewBox", "0 0 " + width + " " + height)
           .attr("preserveAspectRatio", "xMidYMid meet")
           .classed("svg", true);

  return [svg, width, height, margin];
}

function add_legend(svg, sort) {
  var w_svg, y, w, h, values, colors;
  var w_rect = 20;
  var h_rect = 20;

  if (sort == "map") {
    y = 0;
    w_svg = 150;
    w = 150;
    h = 220;
    values = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
    colors = {0: '#1a9850', 12.5: '#66bd63', 25: '#a6d96a', 37.5: '#d9ef8b', 50: '#ffffbf', 62.5: '#fee08b', 75: '#fdae61', 87.5: '#f46d43', 100: '#d73027'};
  } else {
    sort = "pie"
    w = 200;
    h = 310;
    w_svg = 800
    y = 540 - h;
    values = ["WAO","Wajong","WAZ","IVA","WGA","Werkloosheidsuitkering","IOW","Bijstand","IOAW","IOAZ","AOW","ANW","AKW"];
    colors = {"WAO":'#e6194b', "Wajong":'#3cb44b', "WAZ":'#ffe119', "IVA":'#4363d8', "WGA":'#f58231', "Werkloosheidsuitkering":'#911eb4', "IOW":'#46f0f0', "Bijstand":'#f032e6', "IOAW":'#bcf60c', "IOAZ":'#800000', "AOW":'#008080', "ANW":'#e6beff', "AKW":'#9a6324'}
  }

  // add background legend
  svg.append("rect")
     .attr("x", w_svg - w)
     .attr("y", y)
     .attr("width", w)
     .attr("height", h)
     .attr("class", "legend");

  // add title legend
  svg.append("text")
     .attr("x", w_svg - w + w / 2)
     .attr("y", y + 18)
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
     .attr("x", w_svg - w + 5)
     .attr("y", function(d, i) {
       return y + 20 + i * 22;
     })
     .attr("width", w_rect)
     .attr("height", h_rect)
     .style("fill", function(d) {
       return colors[d];
     });


  // add text for legend
  svg.selectAll("leg_text")
     .data(values)
     .enter().append("text")
     .attr("x", w_svg - w + 30)
     .attr("y", function(d, i) {
       return y + 37 + i * 22;
     })
     .attr("class", "leg_text")
     .text(function(d) {
       return d;
     });

  return svg;
}

function change_title(sort, year, sort_map="") {
  // this function changes the title when the piechart of map is updated
  if (sort == "pie") {
    d3.selectAll(".title_pie").each(function(d, i) {
      d3.select(this).text("De verdeling van uitkeringen - " + year);
    });
  } else {
    if (year >= 2015) {
      d3.selectAll(".title_map").each(function(d, i) {
        if (sort_map == "Dichtheid"){
          d3.select(this)
            .text("Dichtheid van bijstandsuitkeringen (per 1000 inwoners) in Nederland - " + year);
        } else {
          d3.select(this)
            .text("Totale aantal bijstandsuitkeringen in Nederland - " + year);
        }

      })
    }
  }
}

function update_legend(svg, sort) {
  // this function updates the legend once a different kind of map is chosen
  var values;
  if (sort == "Dichtheid") {
    values = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  } else {
    values = ["0", "6,250", "12,500", "18,750", "25,000", "31,250", "37,500", "43,750", "50,000"];
  }

  // update text for legend
  svg.selectAll(".leg_text")
     .data(values)
     .text(function(d) {
       return d;
     });
}

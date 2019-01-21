// Name: Vera Nijmeijer
// Student ID: 10753567
// Assignment minor Programmeren UvA

function add_radio(svg, width, height, response) {
  d3.selectAll(".sizeSelect").on("click", function(d,i) {  // <-- 1
      // console.log(this.value);

      sort = this.value;
      console.log(sort);
      update_map_sort(svg, width, height, response, sort);


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

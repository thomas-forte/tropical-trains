(function(){
  // Steps
  // 1 - convert csv into two arrays of nodes and vertexs
  //    a - load csv (idea: user drag&drop)
  //    b - split list by ',' delimiter
  //    c - search for nodes (O(n) time)
  //    d - search for edges (already have: use names as index for speed???)
  //    e - ensure data is compatiable with D3 (can D3 do this???)
  // 2 - set up D3 to display on screen
  //    a - set display size
  //    b - set default values found in demo
  //    c - set the data to D3 object
  // 3 - Main objective complete now make it look pretty
  //    a - position and scale graph to screen
  //    b - add color
  //    c - make sure its easy to understand
  // 4 - Bonus objectives (if time permits)
  // 5 - Pretty up and segment code to look good because I should have been doing it the whole time

  var vertexs = [];
  var count = 0;

  var edges = d3.csv.parse("source,target,distance\nhawaii,mawii,4\ncoffee,lattee,10", function(row) {
    row.distance = +row.distance;

    if (!vertexs[row.source]){
      vertexs.push({
        name: row.source,
        index: count
      });
      row.source = count;
      count++;
    }

    if (!vertexs[row.target]){
      vertexs.push({
        name: row.target,
        index: count
      });
      row.target = count;
      count++;
    }

    return row;
  });

  var width = 960,
      height = 600;

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .size([width, height])
      .nodes(vertexs)
      .links(edges)
      .linkDistance(30)
      .charge(-80)
      .start();

  var link = svg.selectAll(".link")
      .data(edges)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(vertexs)
      .enter().append("circle")
      .attr("class", "node init")
      .attr("r", 10);

  force.on("tick", function() {
      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
  });
})();

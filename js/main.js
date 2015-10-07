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

  var graph = {
    nodes: [
      { index: 0, name: "111" },
      { index: 1, name: "222" },
      { index: 2, name: "333" },
      { index: 3, name: "444" },
      { index: 4, name: "555" },
      { index: 5, name: "666" }],
    edges: [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 0, target: 3 },
      { source: 0, target: 4 },
      { source: 0, target: 5 }]
  };

  var width = 960,
      height = 500;

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .size([width, height])
      .nodes(graph.nodes)
      .links(graph.edges)
      .linkDistance(30)
      .charge(-60)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.edges)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
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

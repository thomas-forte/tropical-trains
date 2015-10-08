(function(){
  // Steps
  // 1 - convert csv into two arrays of nodes and vertexs
  //    a - load csv (idea: user drag&drop)
  //    b - DONE split list by ',' delimiter
  //    c - DONE search for nodes (O(n) time)
  //    d - DONE search for edges (already have: use names as index for speed???)
  //    e - DONE ensure data is compatiable with D3 (can D3 do this???)
  // 2 - DONE set up D3 to display on screen
  //    a - DONE set display size
  //    b - DONE default values found in demo
  //    c - DONE the data to D3 object
  // 3 - Main objective complete now make it look pretty
  //    a - position and scale graph to screen
  //    b - add color
  //    c - make sure its easy to understand
  // 4 - Bonus objectives (if time permits)
  // 5 - Pretty up and segment code to look good because I should have been doing it the whole time

  var dataStream = "source,target,distance\n" + "Frolia,Hailea,9\nHailea,Hanalei,5\nHanalei,Maeulia,6\nHauauai,Lainea,8\nKaleola,Maeulia,7\nLainea,Hailea,5\nLakua,Hauauai,3\nMaeulia,Hailea,12\nPaukaa,Hauauai,6\nPoipu,Paukaa,9\nHailea,Waimea,4\nWaimea,Lakua,9\nLakua,Poipu,7\nWaimea,Kaleola,4\nMaeulia,Paukaa,14\nHailea,Lainea,8";
  var vertexs = [];
  var count = 0;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var forceCharge = -5000;
  var nodeRadius = 10;
  var linkDistanceScalar = 1;

  var isInList = function(list, x) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === x) {
        return i;
      }
    }
    return -1;
  }

  var getIndexOfVert = function(list, vertName){
    if (isInList(vertexs, vertName) < 0){
      vertexs.push({
        name: vertName,
        index: count
      });
      return count++;
    } else {
      return isInList(vertexs, vertName);
    }
  }

  var edges = d3.csv.parse(dataStream, function(row) {
    row.distance = +row.distance;
    row.source = getIndexOfVert(vertexs, row.source);
    row.target = getIndexOfVert(vertexs, row.target);
    return row;
  });

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .size([width, height])
      .nodes(vertexs)
      .links(edges)
      .linkDistance(function(d){ return d.distance * linkDistanceScalar;})
      .charge(forceCharge)
      .on("tick", tick)
      .start();

    // make arrow
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 16)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // make path with arrow tip
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("marker-end", "url(#end)");

    // make the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")

    // draw circles on nodes
    node.append("circle")
        .attr("r", 10);

    // draw text on nodes
    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

    function tick() {
        path.attr("d", function(d) {
            return "M" +
                d.source.x + "," +
                d.source.y + "A0,0 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });

        node
            .attr("transform", function(d) {
      	    return "translate(" + d.x + "," + d.y + ")"; });
    }
})();

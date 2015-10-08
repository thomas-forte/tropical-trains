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
      .start();

  var link = svg.selectAll(".link")
      .data(edges)
      .enter().append("line")
      .attr("class", "link")

  var node = svg.selectAll(".node")
      .data(vertexs)
      .enter().append("circle")
      .attr("class", "node init")
      .attr("r", nodeRadius);

  var text = svg.selectAll(".text")
      .data(vertexs)
      .enter().append("text")
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('class', 'text init')
      .text(function(d) { return d.name; });

  force.on("tick", function() {
      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      text.attr("x", function(d) { return d.x + 15; })
          .attr("y", function(d) { return d.y + 4; });
  });
})();

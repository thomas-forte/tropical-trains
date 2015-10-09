(function(){

  var dataStream = "source,target,distance\n" + "Frolia,Hailea,9\nHailea,Hanalei,5\nHanalei,Maeulia,6\nHauauai,Lainea,8\nKaleola,Maeulia,7\nLainea,Hailea,5\nLakua,Hauauai,3\nMaeulia,Hailea,12\nPaukaa,Hauauai,6\nPoipu,Paukaa,9\nHailea,Waimea,4\nWaimea,Lakua,9\nLakua,Poipu,7\nWaimea,Kaleola,4\nMaeulia,Paukaa,14\nHailea,Lainea,8";
  var vertexs = [];
  var count = 0;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var forceCharge = -5000;
  var nodeRadius = 10;
  var linkDistanceScalar = 1;
  var start = null;
  var end = null;

  var thereAreUndiscoveredNodes = function (array) {
    for (var i = 0; i < array.length; i ++) {
      if (!array[i].discovered) {
        return i;
      }
    }
    return -1;
  };

  var indexOfLowCostUndiscovered  = function (array) {
    for (var i = array.length - 1 ; i >= 0; i-- ){
      if (!array[i].discovered){
        return i;
      }
    }
    return -1;
  };

  // borrowed function from the internet
  function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  };

  var shortestPath = function (nodes, edges, s, e) {
    // set all nodes cost to infinity
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].cost = 99999;
      nodes[i].discovered = false;
    }

    // set the starting node cost to 0
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].name === s) {
        nodes[i].cost = 0;
      }
    }

    // sort array by cost
    nodes.sort(function(a,b){ return b.cost - a.cost});

    while (thereAreUndiscoveredNodes(nodes) != -1) {
      var tmp = nodes[indexOfLowCostUndiscovered(nodes)];
      tmp.discovered = true;
      //found the path
      if (tmp.name === e && tmp.cost != 99999) {
        var path = [];
        path.push(e);
        tmp = nodes[functiontofindIndexByKeyValue(nodes,"name", tmp.prev)];
        while (tmp.name != s) {
          path.push(tmp.name);
          tmp = nodes[functiontofindIndexByKeyValue(nodes,"name", tmp.prev)];
        }
        path.push(tmp.name);
        return path;
      }

      // search for paths
      for (var i = 0; i < edges.length; i++){
        if (edges[i].source.name === tmp.name) {
          if (edges[i].distance + tmp.cost < nodes[functiontofindIndexByKeyValue(nodes,"name",edges[i].target.name)].cost){
            nodes[functiontofindIndexByKeyValue(nodes,"name",edges[i].target.name)].cost = edges[i].distance + tmp.cost;
            nodes[functiontofindIndexByKeyValue(nodes,"name",edges[i].target.name)].prev = tmp.name;
          }
        }
      }
      // resort
      nodes.sort(function(a,b){ return b.cost - a.cost});
    }
    return ["No path found!"];
  };

  var isInList = function(list, x) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === x) {
        return i;
      }
    }
    return -1;
  };

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
  };

  var printResults = function (array) {
    var str = "";
    while (array.length > 1) {
      str += array.pop() + " -> ";
    }
    str += array.pop();
    return str
  }

  var onNodeClick = function (d) {
    if (start === null) {
      d3.select(this).classed("start", true);
      start = this;
      d.start = true;
    } else {
      if (d.start) {
        d3.select(this).classed("start", false);
        d3.select(".end").classed("end",false);
        d.start = false;
        start = null;
        end = null;
      } else {
        d3.select(".end").classed("end", false);
        d3.select(this).classed("end", true);
        end = this;
        result = shortestPath(force.nodes(), force.links(), start.__data__.name, end.__data__.name);
        d3.select("text").text(printResults(result));
      }
    }
  };

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

    var result = svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (height / 7) * 6 )
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text(" ");

    // make path with arrow tip
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("marker-end", "url(#end)");

    // make the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .on("click", onNodeClick);

    // make text
    var text = svg.selectAll(".text")
      .data(force.nodes())
      .enter().append("text")
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('class', 'text')
      .text(function(d) { return d.name; });

    function tick() {
        path.attr("d", function(d) {
            return "M" +
                d.source.x + "," +
                d.source.y + "A0,0 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });

        node.attr("transform", function(d) {
      	    return "translate(" + d.x + "," + d.y + ")"; });

        text.attr("x", function(d) { return d.x + 12; })
            .attr("y", function(d) { return d.y + 5; });
    }
})();

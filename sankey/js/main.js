UI.init();
var filteredData = data;

var width = window.innerWidth,
    height = window.innerHeight;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " tuples"; },
    color = d3.scale.category20();



var svg = d3.select("#chart").append("svg")
  // .attr( "preserveAspectRatio", "xMinYMid meet" )
  .attr("width", width )
  .attr("height", height );

// var rootGraphic = svg
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




function filterData() {
    filteredData = {
        "nodes" : [],
        "links" : []
    }

    $selectedGates = document.querySelectorAll("#ulGates .selected");
    var arrSelectedGates = [];

    for ( liGate of $selectedGates ) {
        arrSelectedGates.push( liGate.innerHTML );
    }

    addedGateIds = [];

    for ( nodeID in data.nodes ) {
        var node = data.nodes[nodeID];

        if ( arrSelectedGates.indexOf(node.name) > -1 ) {
            filteredData.nodes.push( {
                "node" : node.node,
                "name" : node.name
            } );
            addedGateIds.push(node.node);
        }
    }


    for ( linkID in data.links ) {
        var link = data.links[linkID];

        if ( addedGateIds.indexOf(link.source) > -1 && addedGateIds.indexOf(link.target) > -1 ) {
            filteredData.links.push({
                "target" : link.target,
                "source" : link.source,
                "value" : link.value
            });
        }
    }

    console.log(filteredData);
}

function createChart() {
    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();

    sankey
      .nodes(filteredData.nodes)
      .links(filteredData.links)
      .layout(32);



    var $container = document.querySelector("#node-and-link-container");
    if ( $container ) {
        $container.remove();
    }

    var allgraphics = svg.append("g").attr("id", "node-and-link-container" );

    var link = allgraphics.append("g").attr("id", "link-container")
      .selectAll(".link")
      .data(filteredData.links)
    .enter().append("path")
      .attr("class", function(d) { return (d.causesCycle ? "cycleLink" : "link") })
      .attr("d", path)
      .sort(function(a, b) { return b.dy - a.dy; })
      ;

    link.filter( function(d) { return !d.causesCycle} )
    .style("stroke-width", function(d) { return Math.max(1, d.dy); })

    link.append("title")
      .text(function(d) { return d.source.name + " -> " + d.target.name + "\n" + format(d.value); });

    var node = allgraphics.append("g").attr("id", "node-container")
      .selectAll(".node")
      .data(filteredData.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

    node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", path);
    }
};

filterData();
createChart();

var filteredData = data;
var nodes, edges, network;

var entranceName = "entrance0";

UI.init();
filterData();
init();

function init() {
    nodes = new vis.DataSet( filteredData.nodes );
    edges = new vis.DataSet( filteredData.links );

    var container = document.getElementById('mynetwork');
    container.style.height = window.innerHeight + "px";

    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes : {
            shape : "box",
            scaling : {
                label : {
                    enabled: true
                }
            }
        },
        edges : {
            "smooth": {
                "type": "curvedCW",
                "forceDirection": "none"
            },
            chosen : {
                edge : function(values, id, selected, hovering) {
                    if ( edges.get(id).from == network.getSelectedNodes()[0] ) {
                        values.color = "red";
                    } else {
                        values.color = "green";
                    }
                }
            }
        },
        physics: {
            enabled: false
        },
        // layout : {
        //     hierarchical : {
        //         enabled : true,
        //         direction : "LR",
        //         sortMethod : "hubsize"
        //     }
        // }

    };
    network = new vis.Network(container, data, options);
}

function filterData() {
    filteredData = {
        "nodes" : [],
        "links" : []
    }

    var entranceId;

    for ( nodeID in data.nodes ) {
        var node = data.nodes[nodeID];
        var value = 1;

        if ( node.name == entranceName ) {
            value = 2;
            entranceId = node.node;
        }
        filteredData.nodes.push( {
            "id" : node.node,
            "label" : node.name,
            "x" : node.x * 10,
            "y" : ( 200 - node.y ) * 10,
            "value" : value,
        } );
    }

    // La suma de todos los que empiezan por entrance 1
    var sumValue = 0;
    for ( link of data.entrances[entranceName] ) {
        if ( link.source == entranceId ) {
            sumValue += link.value;
        }
    }

    for ( linkID in data.entrances[entranceName] ) {
        var link = data.entrances[entranceName][linkID];
        var title = ( (link.value / sumValue) * 100 + "" ).substr(0,4) + "%";
        title += " / " + link.value;

        filteredData.links.push({
            from : link.source,
            to : link.target,
            arrows : 'to',
            width : map(link.value, 1, sumValue, 1, 20),
            // title : ( (link.value / sumValue) * 100 + "" ).substr(0,4) + "%",
            title : title
        });
    }

    for ( var node of filteredData.nodes ) {
        var hasLink = false;

        for ( var link of filteredData.links ) {
            if ( link.from == node.id || link.to == node.id ) {
                hasLink = true;
                break;
            }
        }

        $li = document.querySelector("#ulGates li[data-id='" + node.id + "']");
        $li.classList.add("selected");
        $li.classList.remove("disabled");

        if ( !hasLink ) {
            node.hidden = true;

            $li.classList.remove("selected");
            $li.classList.add("disabled");
        }
    }
}

function drop_handler(e) {
    e.preventDefault();

    var files = e.dataTransfer.files;
    var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            Data.parseCSV(e.target.result);
        };
      })(files[0]);

    reader.readAsText( files[0] );
}
function dragover_handler(e) {
    e.preventDefault();
}

function map (n, in_min, in_max, out_min, out_max) {
   return (n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var filteredData = data;
var nodes, edges, network;

UI.init();
// filterData();
// init();

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

function filterData( name ) {
    filteredData = {
        "nodes" : [],
        "links" : []
    }

    var entranceId;

    for ( nodeID in data.nodes ) {
        var node = data.nodes[nodeID];
        var value = 1;

        filteredData.nodes.push( {
            "id" : node.node,
            "label" : node.name,
            "x" : node.x * 10,
            "y" : ( 200 - node.y ) * 10,
            "value" : value,
        } );
    }

    var maxLinkValue = 0;
    for ( link of filteredData.links ) {
        if ( link.value > maxLinkValue ) {
            maxLinkValue = link.value;
        }
    }

    for ( linkID in Data.csvLinks[name] ) {
        var link = Data.csvLinks[name][linkID];
        var title = link.value;

        filteredData.links.push({
            from : link.source,
            to : link.target,
            arrows : 'to',
            width : map(link.value, 1, maxLinkValue, 1, 20),
            title : title
        });
    }
}

function drop_handler(e) {
    e.preventDefault();

    var files = e.dataTransfer.files;

    for ( f of files ) {
        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(e) {
                Data.parseCSV(e.target.result, theFile.name);
                UI.addCSV(theFile.name);
                // filterData();
                // init();
            };
        })(f);

        reader.readAsText( f );
    }

}
function dragover_handler(e) {
    e.preventDefault();
}

function map (n, in_min, in_max, out_min, out_max) {
   return (n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var filteredData = data;
var nodes, edges, network;

UI.init();
filterData();
init();

function init() {
    var jNodes = []
    for ( node of filteredData.nodes ) {
        jNodes.push({
            id : node.node,
            label : node.name,
            // chosen : {
            //     label : function(ctx, values, id) {
            //         console.log(ctx);
            //     }
            // }
        });
    }
    nodes = new vis.DataSet( jNodes );

    // relativo a la vista
    var maxLinkValue = 0;
    var sumValue = 0;

    for ( link of filteredData.links ) {
        if ( link.value > maxLinkValue ) {
            maxLinkValue = link.value;
        }
        sumValue += link.value;
    }

    //absoluto
    // var maxLinkValue = 0;
    // var sumValue = 0;
    //
    // for ( link of data.links ) {
    //     if ( link.value > maxLinkValue ) {
    //         maxLinkValue = link.value;
    //     }
    //     sumValue += link.value;
    // }

    var jLinks = [];
    for ( link of filteredData.links ) {
        jLinks.push({
            from : link.source,
            to : link.target,
            arrows : 'to',
            width : map(link.value, 1, maxLinkValue, 1, 10),
            title : ( (link.value / sumValue) * 100 + "" ).substr(0,4) + "%",
            //    chosen : {
            //    edge : function(values, id, selected, hovering) {
            //        console.log("hola");
            //        values.color =  "red";
            //    }
            //    }
        });
    }
    edges = new vis.DataSet( jLinks );

    // create a network
    var container = document.getElementById('mynetwork');
    container.style.height = window.innerHeight + "px";

    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes : {
            shape : "box"
        },
        edges : {
            "smooth": {
                "type": "curvedCW",
                "forceDirection": "none"
            },
            chosen : {
                label : function(values, id, selected, hovering) {
                    console.log("asd");
                }
            }
        },
        physics: {
            enabled: false
        }
    };
    network = new vis.Network(container, data, options);
}

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

    // console.log(filteredData);
}

function map (n, in_min, in_max, out_min, out_max) {
   return (n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

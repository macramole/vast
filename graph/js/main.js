var width = window.screen.availWidth * 0.98;
var height = window.screen.availHeight * 0.89;

var isDragging = false;

var force;
var links;
var nodes;

var maxLinkValue = 0;
var scaleLineWidth;

function addTriangle(svg) {
    svg
        .append("marker")
            .attr("id", "triangle")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 0)
            .attr("refY", 5)
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", 4)
            .attr("markerHeight", 3)
            .attr("orient", "auto")
        .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
    ;
    //
    // <marker id="triangle"
    //   viewBox= refX="0" refY="5"
    //   markerUnits="strokeWidth"
    //   markerWidth="4" markerHeight="3"
    //   orient="auto">
    //   <path d="M 0 0 L 10 5 L 0 10 z" />
    // </marker>
}

function init() {
    d3.select("body svg").remove();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
    ;

    addTriangle(svg);

    // d3.forceCenter([width/2, height/2]);

    force = d3.layout.force()
        .distance(200)
        .charge(1000)
        .size([width, height])
        .nodes(data.nodes)
        .links(data.links)
        .gravity(0)
        .chargeDistance(0)
        .start()
    ;

    for ( link of data.links ) {
        if ( link.value > maxLinkValue ) {
            maxLinkValue = link.value;
        }
    }

    scaleLineWidth = d3.scale.linear().domain([1,maxLinkValue]).range([1,30]);

    links = svg.selectAll(".link")
        .data( data.links )
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke-width", function( oLinkData ) {
            // if ( oLinkData.source.id == nodeData.id || oLinkData.target.id == nodeData.id ) {
                // return Math.pow(oLinkData.value,2.5);
                return scaleLineWidth(oLinkData.value);
            // }
            // return 1;
        })
        .attr("data-source", function(d) { return d.source.name })
        .attr("data-target", function(d) { return d.target.name })
        .attr("stroke-linecap", "round")
    ;

    var nodeDrag = force.drag().on("dragstart", function(d) {
        d.fixed = true;
        isDragging = true;
        // unhighlightAll();
    }).on("dragend", function(d) {
        isDragging = false;
    });

    nodes = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(nodeDrag);

    nodes
        .append("circle")
        .attr("r", function(d) {
            // return Math.pow(d.cantRelaciones + 5,1.3);
            return 10;
        });

    nodes
        .append("text")
        .attr("y", 25)
        .text( function(d) { return d.name  })
    ;

    // nodes
    //     .append("text")
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .text("hola")
    // ;
        // .style("fill", function(d) {
        //     return "gray";
        // })
        // .on("mouseover", function(d) {
        //     if ( isDragging ) {
        //         return;
        //     }
        //     showInfo(d);
        //
        //     if ( selectedNode == null ) {
        //         highlightRelations(d);
        //     }
        // })
        // .on("mouseleave", function(d) {
        //     if ( isDragging ) {
        //         return;
        //     }
        //     if ( selectedNode == null ) {
        //         unhighlightAll();
        //     } else {
        //         showInfo(selectedNode)
        //     }
        // })
        // .on("dblclick", function(d) {
        //     //d3.event.stopPropagation();
        //     /*if ( isDragging ) {
        //         return;
        //     }*/
        //     // console.log(d);
        //     selectNode(d);
        // })


    force.on("tick", tick());

    // gruposSeleccionados.forEach( function(grupoSeleccionado) {
    //     var index = grupos.indexOf(grupoSeleccionado);
    //
    //     force[index] = d3.layout.force()
    //         //.gravity(.05)
    //         .distance(200)
    //         //.linkDistance(200)
    //         .charge(1000)
    //         .size([realWidth/(gruposCheckeados.length+3), grupoHeight])
    //         .nodes(dataD3network.nodes[categoria][grupoSeleccionado])
    //         .links(dataD3network.links[categoria][grupoSeleccionado])
    //         .gravity(0)
    //         .chargeDistance(0)
    //         .start();
    //
    //     force[index].grupo = grupoSeleccionado;
    //
    //     link[index] = svg.selectAll(".link.i" + index)
    //         .data(dataD3network.links[categoria][grupoSeleccionado])
    //         .enter().append("line")
    //         // .attr("x1", function(d) { return d.source.x; })
    //         // .attr("y1", function(d) { return d.source.y; })
    //         // .attr("x2", function(d) { return d.target.x; })
    //         // .attr("y2", function(d) { return d.target.y; })
    //         .attr("class", "link i" + index)
    //         .style("stroke-width", function( oLinkData ) {
    //             // if ( oLinkData.source.id == nodeData.id || oLinkData.target.id == nodeData.id ) {
    //                 return Math.pow(oLinkData.strength,2.5);
    //             // }
    //             // return 1;
    //         })
    //         .attr("stroke-linecap", "round");
    //
    //     link[index].grupo = grupoSeleccionado;
    //     /*var dragNode = d3.behavior.drag().on("drag", function(d, i) {
    //         d.x += d3.event.dx;
    //         d.y += d3.event.dy;
    //
    //         //d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
    //     });*/
    //
    //     var nodeDrag = force[index].drag().on("dragstart", function(d) {
    //         d.fixed = true;
    //         isDragging = true;
    //         unhighlightAll();
    //         // console.log("drag");
    //     }).on("dragend", function(d) {
    //         isDragging = false;
    //         // console.log("nodrag");
    //     });
    //
    //     node[index] = svg.selectAll(".node." + categoria + ".i" + index)
    //         .data(dataD3network.nodes[categoria][grupoSeleccionado])
    //         .enter().append("circle")
    //         // .attr("cx", function(d) { return d.x + (width/4)*index; })
    //         // .attr("cy", function(d) { return d.y; })
    //         .attr("class", "node " + categoria + " i" + index)
    //         .attr("data-grupo", grupoSeleccionado)
    //         .attr("r", function(d) { return Math.pow(d.cantRelaciones + 5,1.3); })
    //         .style("fill", coloresGrupos(index))
    //         .on("mouseover", function(d) {
    //             if ( isDragging ) {
    //                 return;
    //             }
    //             showInfo(d);
    //
    //             if ( selectedNode == null ) {
    //                 highlightRelations(d);
    //             }
    //         })
    //         .on("mouseleave", function(d) {
    //             if ( isDragging ) {
    //                 return;
    //             }
    //             if ( selectedNode == null ) {
    //                 unhighlightAll();
    //             } else {
    //                 showInfo(selectedNode)
    //             }
    //         })
    //         .on("dblclick", function(d) {
    //             //d3.event.stopPropagation();
    //             /*if ( isDragging ) {
    //                 return;
    //             }*/
    //             // console.log(d);
    //             selectNode(d);
    //         })
    //         .call(nodeDrag);
    //
    //     force[index].on("tick", tick(index));
    //
    //     $("li[data-index=" + index + "] > .cantidad").text("(" + force[index].nodes().length + ")");
    // });
}

function tick(index) {
    return function(e) {
        var realWidth = width;
        var xOffset = 0;

        if ( force.nodes() ) {
          nodes
            // .attr("cx", function(d) { return d.x + xOffset; })
            // .attr("cy", function(d) { return d.y; });
            .style("transform", function(d) { return "translate(" + d.x + "px," + d.y + "px)" } );
        }

        links.attr("x1", function(d) { return d.source.x + xOffset })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x + xOffset })
        .attr("y2", function(d) { return d.target.y; });


        //node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    };
}

// function initUI() {
//
//     var $botones = $("#botones");
//     encabezados.forEach( function( categoria, index ) {
//         var $li = $("<li></li>");
//         var $button = $("<button type='button' class='btnDupla'></button>");
//         $button
//             .text(duplas[index])
//             .attr("data-index", index)
//             .click( function() {
//                 var $this = $(this);
//
//                 var gruposSeleccionados = [];
//                 // console.log($("#grupos :checked + span"));
//
//                 d3.selectAll("#grupos :checked + span")[0].forEach(function (grupoSeleccionado) {
//                     grupoSeleccionado = $(grupoSeleccionado);
//                     gruposSeleccionados.push(grupoSeleccionado.text());
//                 });
//
//                 init( encabezados[ $this.attr("data-index") ], gruposSeleccionados );
//
//                 $("#botones li button").removeClass("active");
//                 $this.addClass("active");
//             });
//
//         $li.append($button);
//         $botones.append($li);
//     });
//
//     $("body").click(function() {
//         selectNode(null);
//     });
//
//     $("#comousar h4 a").click(function() {
//         $("#comousar").remove();
//     });
//
//     for ( grupo in dataD3network.nodes[encabezados[0]] ) {
//         grupos.push(grupo);
//     }
//
//     // grupos.forEach( function( grupo, index ) {
//     ordenGrupos.forEach( function(index, ordenIndex) {
//         var grupo = grupos[index];
//         var $li = $("<li></li>").css("background-color", coloresGrupos(index)).attr("data-index", index);
//         var $input = $("<input type='checkbox' />")
//         var $span = $("<span></span>").text(grupo);
//         var $div = $("<div class='cantidad'></div>");
//
//         if ( ordenIndex <= 1 ) {
//             $input.attr("checked", true);
//         }
//
//         $li.append($input).append($span).append($div);
//         $("#grupos").append($li);
//
//         $input.change(function() {
//             $(".btnDupla.active").click();
//             if ( !$(this).is(":checked") ) {
//                 $(this).siblings(".cantidad").text("");
//             }
//         });
//     });
// };

/*d3.json("d3network.json", function(error, json) {
    if (error) throw error;

    dataD3network = json;
*/
// $(function(){
// 	// initUI();
//     // $("#botones li button").first().click();
// });
init();

// d3.selection.prototype.dblTap = function(callback) {
//   var last = 0;
//   return this.each(function() {
//     d3.select(this).on("touchstart", function(e) {
//         if ((d3.event.timeStamp - last) < 500) {
//           //Touched element
//           console.log(this);
//           return callback(e);
//         }
//         last = d3.event.timeStamp;
//     });
//   });
// }

/*});*/

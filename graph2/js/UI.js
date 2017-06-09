var UI = {
    WIDTH : 20,
    SELECTED_FIRST : [
        "entrance0",
        "entrance1",
        "entrance2",
        "entrance3",
        "entrance4",
        "camping0",
        "camping1",
        "camping2",
        "camping3",
        "camping4",
        "camping5",
        "camping6",
        "camping7",
        "camping8"
    ],

    init : function() {
        UI.WIDTH = window.innerWidth * 0.2;

        $ui = document.querySelector("#UI");
        $ui.style.width = UI.WIDTH + "px";
        $ui.style.height = window.innerHeight + "px";

        UI.initGates();
        UI.initButtons();
    },

    initGates : function() {
        var nodesToAdd = [];
        var nodesIds = [];

        for ( node of data.nodes ) {
            nodesToAdd.push(node.name);
            nodesIds.push(node.node);
        }

        nodesToAdd.sort();

        for (  i in nodesToAdd ) {
            nodeName = nodesToAdd[i];

            $li = document.createElement("li");
            $li.innerHTML = nodeName;
            $li.setAttribute("data-id", nodesIds[i]);

            if ( UI.SELECTED_FIRST.indexOf(nodeName) > -1 ) {
                $li.classList.add("selected");

            }

            $li.addEventListener("click", function() {
                this.classList.toggle("selected");

                filterData();
                init();
            });

            document.querySelector("#ulGates").appendChild($li);
        }
    },

    initButtons : function() {
        // $btnFilter = document.querySelector("#btnFilter");
        // $btnFilter.addEventListener("click", function() {
        //
        // });
    }
}

var UI = {
    WIDTH : 20,

    init : function() {
        // UI.WIDTH = window.innerWidth * 0.2;
        UI.WIDTH = 200;

        $ui = document.querySelector("#UI");
        $ui.style.width = UI.WIDTH + "px";
        // $ui.style.height = window.innerHeight + "px";

        // UI.initGates();
        // UI.initEntrances();
        UI.initButtons();
        UI.initCSVSelector();
    },

    initCSVSelector : function() {
        $selCSV = document.querySelector("#selCSV");
        $selCSV.addEventListener("change", function() {
            csvName = this.options[this.selectedIndex].value;
            filterData(csvName);
            init();
        });
        $selCSV.style.height = window.innerHeight * 0.8 + "px";
    },

    addCSV : function(name) {
        $selCSV = document.querySelector("#selCSV");
        $newOption = document.createElement("option");
        $newOption.innerHTML = $newOption.value = name;

        $selCSV.appendChild($newOption);

        document.querySelector("#csvSelector").classList.remove("hide");
        document.querySelector("#instrucciones").classList.add("hide");

    },

    initGates : function() {
        data.nodes.sort(function(a,b) {
            if ( a.name < b.name ) {
                return -1;
            }
            return 1;
        });

        for ( node of data.nodes ) {
            nodeName = node.name;

            $li = document.createElement("li");
            $li.innerHTML = nodeName;
            $li.setAttribute("data-id", node.node);
            $li.classList.add("selected");

            $li.addEventListener("click", function() {
                if ( this.classList.contains("disabled") ) {
                    return;
                }

                this.classList.toggle("selected");

                var nodeId = this.getAttribute("data-id");

                nodes.update({
                     id : nodeId,
                     hidden : !this.classList.contains("selected")
                 });
                 edgesToToggle = edges.get({
                    filter : function(d) {
                        return d.from == nodeId || d.to == nodeId;
                    }
                 });
                 console.log(edgesToToggle);
                 for ( edge of edgesToToggle ) {
                     edge.hidden = !this.classList.contains("selected");
                 }
                 edges.update(edgesToToggle);
            });

            document.querySelector("#ulGates").appendChild($li);
        }
    },

    initButtons : function() {
        $btnClear = document.querySelector("#btnClear");
        $btnClear.addEventListener("click", function() {
            Data.clear();
            $selCSV = document.querySelector("#selCSV");
            $selCSV.innerHTML = "";
            network.destroy();
        });
    },

    initEntrances : function() {
        $selEntrances = document.querySelector("#selEntrances");

        var arrEntrances = [];

        for ( var entrance in data.entrances ) {
            arrEntrances.push(entrance);
        }

        arrEntrances.sort();

        for ( var entrance of arrEntrances ) {
            $option = document.createElement("option");
            $option.innerHTML = $option.value = entrance;

            $selEntrances.appendChild($option);
        }

        $selEntrances.addEventListener("change", function() {
            entranceName = this.options[this.selectedIndex].value;
            filterData();
            init();
        });
    },

    setDisabledGates : function( disabledGateNames ) {
        for ( var $li of document.querySelectorAll("#ulGates li") ) {
            $li.classList.remove("disabled");

            if ( disabledGateNames.indexOf($li.innerHTML) > -1 ) {
                $li.classList.add("disabled");
            }
        }

    }
}

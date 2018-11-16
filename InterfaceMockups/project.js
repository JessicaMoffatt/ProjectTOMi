$(document).ready(function (){
    loadList();
});


function loadList(){
        $.getJSON("projects.json", function (data) {
        $.each( data, function( key, val ) {
            let node = document.createElement("li");
            let button = document.createElement("button");
            let info = document.createTextNode(val);
            button.appendChild(info);
            node.appendChild(button);
            document.getElementById("projects").appendChild(node);
        });
    });
}


function hideMenu(){
    document.getElementById("visibleMenu").classList.add("hidden");
    document.getElementById("hiddenMenu").classList.remove("hidden");
    document.getElementById("infoPane").classList.add("middleBig");
    document.getElementById("infoPane").classList.remove("middle");
}

function showMenu(){
    document.getElementById("visibleMenu").classList.remove("hidden");
    document.getElementById("hiddenMenu").classList.add("hidden");
    document.getElementById("infoPane").classList.remove("middleBig");
    document.getElementById("infoPane").classList.add("middle");
}
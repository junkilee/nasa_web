function on_check(name, value){
    alert(name + " " + value);
}

var buttons = {"start":"GO_TO_START", "left":"PLAY_BACKWARD", "rwnd":"STEP_BACKWARD", "right":"PLAY_FORWARD", "ffwd":"STEP_FORWARD", "pause":"PAUSE", "end": "GO_TO_END"};

function make_buttons()
{
    var path = "https://raw.githubusercontent.com/swhart115/affordance_templates/refactor/rviz_affordance_template_panel/resources/"
    
    var s = "";
    for(b in buttons){
        s += "<img src=\"" + path + b + ".png\" width=\"50px\" onclick=\"button('" + buttons[b] + "')\" />\n";

    }
    document.getElementById("controls").innerHTML = s;
}

function populate_affordances(id, elements)
{
    document.getElementById(id).innerHTML = '';
    for(i in elements){
        var element = elements[i];
        // create the necessary elements
        var label= document.createElement("label");
        var description = document.createTextNode(element);
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";    // make the element a checkbox
        checkbox.name = element;       // give it a name we can check on the server side
        checkbox.value = element;      // make its value element
        checkbox.onclick=function() { on_check(this.name, this.checked); };

        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);// add the description to the element

        // add the label element to your div
        document.getElementById(id).appendChild(label);
    }
}

function button(s) {
    var steps = document.getElementById('steps').value;
    var eop = document.getElementById('execute').checked;
     alert(steps + " " + eop + " " + s);
}


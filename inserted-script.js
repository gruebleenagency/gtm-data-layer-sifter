function findElement(el, eventIndex) {
    // debugger;
    var eventElem;
    var targetElem;
    var searchElem;
    var dotNotation = "";
    var valuePath = "";
    var textPath = "";
    var valuePath_val = "";
    var textPath_val = "";

    eventElem = dataLayer[eventIndex]['gtm.element'];
    targetElem = eval(el);

    searchElem = eventElem;
    dotNotation = "gtm.element";

    var targetFound = false;
    while (!targetFound) {
        if (searchElem == targetElem) {
            targetFound = true;
            var tagName = targetElem.tagName.toLowerCase();
            var tagType = typeof targetElem.type != 'undefined' ? targetElem.type.toLowerCase() : "";
            if(tagName == "input"){
            	if(tagType == "checkbox" || tagType == "radio"){
            		valuePath = dotNotation + ".checked";
                    valuePath_val = targetElem.checked;
                    textPath = dotNotation + ".labels.0.innerText"
                    textPath_val = targetElem.labels[0].innerText;
                }
            	else if(tagType == "text" || tagType == "email"){
            		valuePath = textPath = dotNotation + ".value"
                    valuePath_val = textPath_val = targetElem.value;
                }
            }
            else if(tagName == "textarea"){
            	valuePath = textPath = dotNotation + ".value";
                valuePath_val = textPath_val = targetElem.value;
            }
            else if(tagName == "select"){
                valuePath = dotNotation + ".value";
                valuePath_val = targetElem.value;
            	textPath = dotNotation + ".selectedOptions.0.innerText";
                textPath_val = targetElem.selectedOptions[0].innerText;
            }
            else {
            	valuePath = textPath = dotNotation + ".innerText";
                valuePath_val = textPath_val = targetElem.innerText;
            }
            break;
        }

        if (jQuery(searchElem).find(targetElem).length > 0) {
            if (searchElem.childNodes.length == 1) {
                searchElem = searchElem.childNodes[0];
                dotNotation += ".childNodes.0";
            } else {
                for(var i=0;i<searchElem.childNodes.length;i++){
                    var child = searchElem.childNodes[i];
                    if (jQuery(child).find(targetElem).length > 0 || child == targetElem) {
                        searchElem = child;
                        dotNotation += ".childNodes." + i;
                        break;
                    }
                }
            }
        } else {
            searchElem = searchElem.parentElement;
            dotNotation += ".parentElement";
        }
    }
    // return dotNotation;
    window.postMessage({
        action: "displayResults",
        path: dotNotation,
        valuePath: valuePath,
        textPath: textPath,
        valuePath_val: " | " + valuePath_val,
        textPath_val: " | " + textPath_val,
        source: 'my-devtools-extension'
    }, '*');
}

jQuery("*").click(function() {
    // refresh dataLayer
    window.postMessage({
        action: "refreshDataLayer",
        source: 'my-devtools-extension'
    }, '*');
});
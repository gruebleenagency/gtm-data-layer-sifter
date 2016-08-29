// on load, get dataLayer, send to panel
// debugger;
var script = document.createElement('script');
script.id = 'tmpScript';
script.src = chrome.extension.getURL("inserted-script.js");
(document.body || document.head || document.documentElement).appendChild(script);

updateDataLayer();

function updateDataLayer() {
    var dataLayer = retrieveWindowVariables(["dataLayer"]).dataLayer;
    var message = { action: "updateDataLayer", content: dataLayer };
    sendObjectToDevTools(message);
}

function sendObjectToDevTools(message) {
    // The callback here can be used to execute something on receipt
    chrome.extension.sendMessage(message, function(message) {});
}

function retrieveWindowVariables(variables) {
    // debugger;
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "function flattenDataLayer(a){for(var b=[],c=0;c<a.length;c++){var d=a[c],e=d.event?d.event:'',f=d['gtm.elementClasses']?d['gtm.elementClasses']:'',g=d['gtm.elementId']?d['gtm.elementId']:'',h=d['gtm.element']?d['gtm.element'].tagName:'';b.push({event:e,'gtm.elementClasses':f,'gtm.elementId':g,tagName:h})}return JSON.stringify(b)}";
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') jQuery('body').attr('tmp_" + currVariable + "', flattenDataLayer(" + currVariable + "));\n"
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = jQuery.parseJSON(jQuery("body").attr("tmp_" + currVariable));
        jQuery("body").removeAttr("tmp_" + currVariable);
    }

    jQuery("#tmpScript").remove();

    return ret;
}

function setSelectedElement(el, eventIndex) {
    if (typeof eventIndex != 'undefined') {
        jQuery("#tmpScript2").remove();

        var dot = findElementFromDocument(el);

        var script2 = document.createElement('script');
        script2.id = 'tmpScript2';
        script2.appendChild(document.createTextNode("findElement('" + dot + "'," + eventIndex + ");"));
        (document.body || document.head || document.documentElement).appendChild(script2);
    }
    // else {
    //     var message = { action: "error", content: "Please select a dataLayer event to begin." };
    //     sendObjectToDevTools(message);
    // }
}

window.addEventListener('message', function(event) {
    // Only accept messages from the same frame
    if (event.source !== window) {
        return;
    }

    if (event.data.action == "refreshDataLayer") {
        updateDataLayer();
    } else if (event.data.action == "displayResults") {
        var message = {
            action: "displayResults",
            content: {
                path: event.data.path,
                valuePath: event.data.valuePath,
                textPath: event.data.textPath,
                valuePath_val: event.data.valuePath_val,
                textPath_val: event.data.textPath_val
            }
        };
        sendObjectToDevTools(message);
    }
});

function findElementFromDocument(el) {
    // debugger;
    var eventElem;
    var targetElem;
    var searchElem;
    var dotNotation = "";

    eventElem = document.body;
    targetElem = el;
    searchElem = eventElem;
    dotNotation = "document.body";

    var targetFound = false;
    while (!targetFound) {

        if (searchElem == targetElem) {
            targetFound = true;
            break;
        }

        if (jQuery(searchElem).find(targetElem).length > 0) {
            if (searchElem.childNodes.length == 1) {
                searchElem = searchElem.childNodes[0];
                dotNotation += ".childNodes[0]";
            } else {
                for (var i = 0; i < searchElem.childNodes.length; i++) {
                    var child = searchElem.childNodes[i];
                    if (jQuery(child).find(targetElem).length > 0 || child == targetElem) {
                        searchElem = child;
                        dotNotation += ".childNodes[" + i + "]";
                        break;
                    }
                }
            }
        } else {
            searchElem = searchElem.parentElement;
            dotNotation += ".parentElement";
        }
    }
    return dotNotation;
}

// function flattenDataLayer(dataLayer){
//     var flat = [];
//     for(var i=0;i<dataLayer.length;i++){
//         var item = dataLayer[i];
//         var event = item.event ? item.event : '';
//         var classes = item['gtm.elementClasses'] ? item['gtm.elementClasses'] : '';
//         var id = item['gtm.elementId'] ? item['gtm.elementId'] : '';
//         var tagName = item['gtm.element'] ? item['gtm.element'].tagName : '';
//         flat.push({'event':event,'gtm.elementClasses':classes,'gtm.elementId':id,'tagName':tagName});
//     }
//     return JSON.stringify(flat);
// }

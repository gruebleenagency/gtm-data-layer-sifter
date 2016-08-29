// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*
console.log("fart");
pageLoad();

function pageLoad() {
    sendObjectToInspectedPage({ action: "script", content: "jquery-3.1.0.min.js" });
    sendObjectToInspectedPage({ action: "script", content: "messageback-script.js" });
    chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
        chrome.devtools.inspectedWindow.eval("setSelectedElement($0, " + eventIndex + ");", { useContentScriptContext: true });
    });
}
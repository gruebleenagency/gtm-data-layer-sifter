// This creates and maintains the communication channel between
// the inspectedPage and the dev tools panel.
//
// In this example, messages are JSON objects
// {
//   action: ['code'|'script'|'message'], // What action to perform on the inspected page
//   content: [String|Path to script|Object], // data to be passed through
//   tabId: [Automatically added]
// }
var eventIndex;
(function createChannel() {
    //Create a port with background page for continous message communication
    var port = chrome.extension.connect({
        name: "Sample Communication" //Given a Name
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function(message) {
        if (message.action == "updateDataLayer") {
            var dataLayer = message.content;
            var eventList = $('.event-list');
            eventList.empty();
            $(dataLayer).each(function(index){
                var event = this;
                $("<a href='javascript:void(0)' class='event'><li><strong>" + this.event + "</strong> (" + (this['tagName'] ? (this['tagName'].toLowerCase()) : "") + (this['gtm.elementId'] ? ("#" + this['gtm.elementId']) : "") + (this['gtm.elementClasses'] ? ("." + this['gtm.elementClasses']).replace(/ /g, ".") : "") + ")</li></a>").appendTo(eventList);
            });
            $(".event").click(function(){
                $(".event").removeClass("selected");
                $(this).addClass("selected");
                eventIndex = $(this).index();
            });
        }
        else if (message.action == "displayResults"){
            $(".results .path").text(message.content.path);
            $(".results .valuePath").text(message.content.valuePath);
            $(".results .textPath").text(message.content.textPath);
            $(".results .valuePath_val").text(message.content.valuePath_val);
            $(".results .textPath_val").text(message.content.textPath_val);
        }
        // else if (message.action == "error"){
        //     $(".error .message").text(message.content);
        //     $(".error").show("slow");
        // }
        // port.postMessage(message);
    });

}());

// This sends an object to the background page 
// where it can be relayed to the inspected page
function sendObjectToInspectedPage(message) {
    message.tabId = chrome.devtools.inspectedWindow.tabId;
    chrome.extension.sendMessage(message);
}
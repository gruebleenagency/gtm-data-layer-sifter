// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
createSidebar();

function createSidebar() {
    chrome.devtools.panels.elements.createSidebarPane("GTM dataLayer Sifter", function(sidebar) {
        sidebar.setPage("panel.html");
    });
}
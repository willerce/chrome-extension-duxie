chrome.contextMenus.create({
    title: "读(xiě)",
    contexts: ["selection"],
    onclick: replaceWord
});

function replaceWord(info, tab) {
    chrome.tabs.sendMessage(tab.id, {text: info.selectionText});
}
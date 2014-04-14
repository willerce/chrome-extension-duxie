chrome.contextMenus.create({
    title: "读(xiě)",
    contexts: ["editable"],
    onclick: replaceWord
});

function replaceWord(info, tab) {
    chrome.tabs.sendMessage(tab.id, {info: info});
}
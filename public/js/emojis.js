function parseEmoji() {
    twemoji.parse(document.body, {
        className: "twemoji"
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const observer = new MutationObserver(parseEmoji);
    observer.observe(document.body, { childList: true, subtree: true });
});

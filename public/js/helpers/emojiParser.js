// @ts-check

window.addEventListener("DOMContentLoaded", function () {
    //@ts-ignore - Twemoji should be available because its script *should* included in the HTML file.
    twemoji.parse(document.body, {
        className: "twemoji"
    });

    const observer = new MutationObserver(function () {
        //@ts-ignore - Twemoji should be available because its script *should* included in the HTML file.
        twemoji.parse(document.body, {
            className: "twemoji"
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
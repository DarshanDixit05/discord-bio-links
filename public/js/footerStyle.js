function checkScrollable() {
    const body = document.body;
    const html = document.documentElement;
    const footer = document.getElementById("footer");

    const documentHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
    );

    const windowHeight = window.innerHeight;

    if (documentHeight > windowHeight) {
        footer.className = "scrollable";
    } else {
        footer.className = "non-scrollable";
    }
}

checkScrollable();

window.addEventListener('resize', checkScrollable);
document.addEventListener("DOMContentLoaded", function () {
    const footer = document.getElementById("footer");
    if (footer) footer.style.display = "block";

    const observer = new MutationObserver(checkScrollable);
    observer.observe(document.body, { childList: true, subtree: true });
});
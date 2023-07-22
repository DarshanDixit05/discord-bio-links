// @ts-check
function setupFooterToggle() {
    let isFooterOn = false;

    function mini() {
        isFooterOn = !isFooterOn;

        const footerToggleImage = document.getElementById("footer-toggle-img");
        const footer = document.getElementById("footer");

        if (footer && footerToggleImage && footerToggleImage instanceof HTMLImageElement) {
            if (isFooterOn) {
                footer.className = "displayed";
                footerToggleImage.src = footerToggleImage.src.replace("hamburger", "close");
            } else {
                footer.className = "";
                footerToggleImage.src = footerToggleImage.src.replace("close", "hamburger");
            }
        }
    }

    const footerToggle = document.getElementById("toggle-footer");
    if (footerToggle) footerToggle.addEventListener("click", mini);
}

window.addEventListener("DOMContentLoaded", setupFooterToggle);
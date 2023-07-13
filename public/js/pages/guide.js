// @ts-check
import { renderMarkdown } from "../helpers/renderMarkdown.js";

window.addEventListener("DOMContentLoaded", function () {
    const main = document.getElementById("main");
    if (main) renderMarkdown(main, main.innerHTML);
});
// @ts-check

const headerLevelStarts = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6
};

/**
 * Renders the given markdown text with the specified headerLevelStart (or 1 by default) within the specified element.
 * @param {HTMLElement} element 
 * @param {string} markdownText 
 * @param {keyof typeof headerLevelStarts | undefined} headerLevelStart 
 */
export function renderMarkdown(element, markdownText, headerLevelStart = 1) {
    const options = {
        tables: true,
        tasklists: true,
        simpleLineBreaks: true,
        openLinksInNewWindow: true,
        emoji: true,
        strikethrough: true,
        headerLevelStart
    };

    // @ts-ignore - Showdown should be available because its script *should* included in the HTML file.
    const converter = new showdown.Converter(options);
    // @ts-ignore
    const parsed = markdownText.replaceAll("\n\n", "\n<br>");

    // @ts-ignore - DOMPurify should be available because its script *should* included in the HTML file.
    element.innerHTML = DOMPurify.sanitize(converter.makeHtml(parsed));
}
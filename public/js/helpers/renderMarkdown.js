// @ts-check

/**
 * Workarounds to ensure proper display.
 * @param {string} text 
 * @returns {string}
 */
function prepareMarkdown(text) {
    return text
        // For markdown to make a line break a line break, it needs 2 spaces before the line break.
        .replace(/\n/g, "  \n")
        // Without specifying multiples line breaks as <br> tags, they would get removed.
        .replace(/  \n  \n/g, "<br><br>  \n  \n")
        // The following are horizontal rules workarounds; because of the previous line break workarounds,
        // markdown horizontal rules ('***', '___' or '---') had <br> tags on the same line so they weren't parsed as horizontal rules.
        .replace(/\n\*\*\*<br><br>/g, "\n***\n")
        .replace(/\n---<br><br>/g, "\n---\n")
        .replace(/\n___<br><br>/g, "\n___\n");
}

/**
 * Renders the given markdown text with the specified headerLevelStart (or 1 by default) within the specified element.
 * @param {HTMLElement} element 
 * @param {string} markdownText 
 * @param {1 | 2 | 3 | 4 | 5 | 6 | undefined} headerLevelStart 
 */
export function renderMarkdown(element, markdownText, headerLevelStart = 1) {
    const options = {
        tables: true,
        tasklists: true,
        openLinksInNewWindow: true,
        emoji: true,
        strikethrough: true,
        customizedHeaderId: true,
        headerLevelStart
    };

    // @ts-ignore - Showdown should be available because its script *should* included in the HTML file.
    const converter = new showdown.Converter(options);

    // @ts-ignore - DOMPurify should be available because its script *should* included in the HTML file.
    element.innerHTML = DOMPurify.sanitize(
        converter.makeHtml(
            prepareMarkdown(markdownText)
        ), {
        FORBID_TAGS: ['img']
    }
    );
}
//@ts-check

/**
 * @param {"live" | "preview"} type
 * @param {string} markdown
 */
export function markdownToHtml(type, markdown) {
    const options = {
        tables: true,
        tasklists: true,
        simpleLineBreaks: true,
        openLinksInNewWindow: true,
        emoji: true,
        strikethrough: true
    };

    if (type === "preview") options.headerLevelStart = 2;

    // @ts-ignore - showdown should be imported from the html file.
    const converter = new showdown.Converter(options);

    // For some reason showdown will convert several line breaks to only one line break.
    // By adding one of the line breaks as HTML tags as well, we can bypass that.

    const parsed = markdown
        // @ts-ignore
        .replaceAll("\n\n", "\n<br>");

    // @ts-ignore - DOMPurify should be imported from the html file.
    return DOMPurify.sanitize(converter.makeHtml(parsed));
}
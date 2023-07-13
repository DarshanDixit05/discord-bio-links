// @ts-check

/**
 * Reads the document's cookies and returns them into an object.
 * @returns {Object}
 */
export function parseCookies() {
    return Object.fromEntries(document.cookie.split('; ').map(x => x.split('=')));
}
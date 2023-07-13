// @ts-check

/**
 * Represents a user's biography in one language.
 * 
 * @typedef {Object} Biography
 * @property {string} text
 */

/**
 * Checks whether or not o implements the Biography interface.
 * @param {unknown} o
 * @returns {o is Biography}
 */
export function isBiography(o) {
    if (o) {
        if (typeof o === "object") {
            if ("text" in o) {
                if (typeof o.text === "string") {
                    return true;
                }
            }
        }
    }
    return false;
}

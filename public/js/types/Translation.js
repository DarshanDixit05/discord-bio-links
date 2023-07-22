// @ts-check

/**
 * Represents a translation in the cache.
 * @typedef {Object} Translation
 
 * @property {string} lang - The language in which the translation is.
 * @property {string} ns - The translation's namespace.
 * @property {string} code - The translation's code. It must be unique within its namespace. 
 * @property {string} translation - The text of the translation.
 * @property {number} ttl - The translation's date of expiry (in the cache).
 * @property {string} iCode - The translation's unique identification code. iCode is in the format `{{code}}::{{ns}}`
 */


/**
* Checks whether or not o implements the Translation interface.
* @param {unknown} o
* @returns {o is Translation}
*/
export function isTranslation(o) {
    if (o && typeof o === "object") {
        if ("code" in o && "translation" in o && "lang" in o && "ttl" in o && "ns" in o) {
            if (typeof o.code === "string" && typeof o.lang === "string" && typeof o.lang === "string" && typeof o.ttl === "number" && typeof o.ns === "string") {
                return true;
            }
        }
    }

    return false;
}
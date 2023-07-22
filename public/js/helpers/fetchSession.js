// @ts-check
import { parseCookies } from "./parseCookies.js";

/**
 * Gets the saved session, if any.
 * @returns {?string}
 */
export function fetchSession() {
    const saved = parseCookies().session;
    if (typeof saved === "string") return saved;
    return null;
}
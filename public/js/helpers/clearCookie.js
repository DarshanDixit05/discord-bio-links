/**
 * Removes the cookie with the given name.
 * @param {string} cookieName 
 */
export function clearCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
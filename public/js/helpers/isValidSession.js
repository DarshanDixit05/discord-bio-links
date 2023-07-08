/**
 * @param {object} obj
 * @returns {obj is Session}
 */
function isValidSessionFormat(obj) {
    if ("expirationTimestamp" in obj && "token" in obj && "id" in obj) {
        if (typeof obj.expirationTimestamp === "number" && typeof obj.token === "string" && typeof obj.id === "string") {
            return true;
        }
    }
    return false;
}

/**
 * 
 * @param {object} o 
 * @returns {boolean}
 */
export function isValidSession(o) {
    if (!isValidSessionFormat(o)) return false;
    return (o.expirationTimestamp > Date.now());
}
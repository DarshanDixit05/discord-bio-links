/**
 * Gets the emoji flag from a country code.
 * @param {string} code 
 * @returns {string}
 */
export function getCountryFlagFor(code) {
    return String.fromCodePoint(...Array.from(code.toUpperCase()).map(char => char.charCodeAt() + 127397));
}
export function getCountryFlagFor(code) {
    return String.fromCodePoint(...Array.from(code.toUpperCase()).map(char => char.charCodeAt() + 127397));
}
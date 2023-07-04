// @ts-check

/**
 * Whether or not the current URL has a specified parameter.
 * @param {string} param 
 * @returns {boolean}
 */
export function urlHasParam(param) {
    const indexOfInterrogationMark = window.location.href.indexOf("?");
    if (indexOfInterrogationMark === -1) return false;

    const urlParamsSearcher = new URLSearchParams(window.location.href.slice(indexOfInterrogationMark));
    return !!(urlParamsSearcher.get(param));
}
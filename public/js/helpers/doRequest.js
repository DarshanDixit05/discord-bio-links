// @ts-check
/**
 * @typedef {Object} RequestOptions
 * @property {string} url
 * @property {string} method
 * @property {object | undefined} headers
 * @property {object | undefined} body
 */

/**
 * @param {RequestOptions} param0 
 */
export function doRequest({ url, method, headers, body }) {
    if (headers) headers["Content-Type"] = "application/json";

    return new Promise((resolve, reject) => {
        fetch(url, {
            method,
            headers,
            body: JSON.stringify(body)
        })
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
}
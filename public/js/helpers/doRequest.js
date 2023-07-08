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
    console.group(`${method} request at ${url}`);
    console.log(`Headers:`);
    console.dir(headers);
    console.log(`Body:`);
    console.dir(body);

    if (headers) headers["Content-Type"] = "application/json";
    if (body) body = JSON.stringify(body);

    const req = {
        method, headers, body
    };

    return new Promise((resolve, reject) => {
        fetch(url, req)
            .then(response => {
                console.log(`Response:`);
                console.dir(response);
                console.groupEnd();
                resolve(response);
            })
            .catch(err => {
                console.log(`Error:`);
                console.dir(err);
                console.groupEnd();
                reject(err);
            });
    });
}
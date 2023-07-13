//@ts-check

const httpMethods = {
    "CONNECT": "CONNECT",
    "DELETE": "DELETE",
    "GET": "GET",
    "HEAD": "HEAD",
    "OPTIONS": "OPTIONS",
    "PATCH": "PATCH",
    "POST": "POST",
    "PUT": "PUT",
    "TRACE": "TRACE"
};

/**
 * Makes a request with the specified parameters.
 * 
 * If the request is successful (that is, its status is 200-299, both included), then promise resolves with the content of the body (or an empty object if the Content-Length header wasn't set or set to 0).
 * If the request is not successful, then the promise rejects with the raw response.
 * 
 * @param {Object} requestOptions
 * @param {string} requestOptions.url
 * @param {keyof typeof httpMethods} requestOptions.method
 * @param {Object|undefined} requestOptions.headers
 * @param {Object|undefined} requestOptions.body
 */
export function request({ url, method, headers = {}, body = undefined }) {
    if (method === "GET" || method === "HEAD") body = undefined;
    if (method !== "GET" && method !== "HEAD" && body === undefined) throw new Error(`Method ${method} requires you to explicitely set a body (even an empty object)!`);

    if (
        method !== "GET" &&
        method !== "HEAD" &&
        headers &&
        headers["Content-Type"] !== "application/json"
    ) console.warn(`[${method}] @ ${url} : The "Content-Type" header was not set to "application/json"!`);

    if (body) body = JSON.stringify(body);

    return new Promise(function (resolve, reject) {
        fetch(url, {
            method,
            headers,
            body
        })
            .then(function (response) {
                if (response.status >= 200 && response.status <= 299) {
                    const contentLength = response.headers.get('Content-Length');
                    if (contentLength === "0" || contentLength === null) return {};
                    return response.json();
                }
                throw response;
            })
            .then(function (data) { resolve(data); })
            .catch(function (err) { reject(err); });
    });
}
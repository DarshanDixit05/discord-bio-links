import { Dispatcher, request } from "undici";
import { IncomingHttpHeaders } from "undici/types/header.js";

export async function doRequest(method: Dispatcher.HttpMethod, url: string, headers: IncomingHttpHeaders, body: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
        request(url, {
            method,
            headers,
            body
        })
            .then(response => response.body.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}
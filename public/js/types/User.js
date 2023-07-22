// @ts-check

import { isBiography } from './Biography.js';

/**
 * @typedef {import('./Biography.js').Biography} Biography
 */

/**
 * Represents a user saved in the API.
 * 
 * @typedef {Object} User
 * 
 * @property {string} username
 * @property {string} displayName
 * @property {string} id
 * @property {string} avatarHash
 * @property {Record<string, Biography>} biographies
 */


/**
 * @param {unknown} o
 * @returns {o is User}
 */
export function isUser(o) {
    if (o && typeof o === "object") {
        if ("username" in o && "displayName" in o && "id" in o && "avatarHash" in o && "biographies" in o) {
            if (typeof o.username === "string" && typeof o.displayName === "string" && typeof o.id === "string" && typeof o.avatarHash === "string" && typeof o.biographies === "object" && o.biographies) {
                for (const bio of Object.values(o.biographies)) {
                    if (!isBiography(bio)) return false;
                }

                return true;
            }
        }
    }

    return false;
}
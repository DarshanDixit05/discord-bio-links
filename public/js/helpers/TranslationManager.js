// @ts-check

/**
* @typedef {import('../types/Translation.js').Translation} Translation
*/

import { isTranslation } from "../types/Translation.js";
import { request } from "./request.js";

/**
 * Promise-based translation manager with IndexedDB caching.
 */
export class TranslationManager {
    static DB_NAME = "translations";
    static DB_VER = 3;
    static STORE_NAME = "translations";

    /**
     * Returns a translation's iCode from its code and namespace.
     * @private
     * @param {string} code 
     * @param {string} ns 
     * @returns {string}
     */
    static _getICode(code, ns) {
        return `${code}::${ns}`;
    }

    /**
     * Returns the language that should be used for translations.
     * @private
     * @returns {Promise<string>}
     */
    static _getLanguage() {
        return new Promise(function (resolve, reject) {
            const saved = sessionStorage.getItem("lang");
            if (saved) return resolve(saved);

            request({
                url: "/api/language",
                method: "GET",
                body: undefined,
                headers: undefined
            })
                .then(function (lang) {
                    if (typeof lang === "string") {
                        sessionStorage.setItem("lang", lang);
                        return resolve(lang);
                    }

                    sessionStorage.setItem("lang", "us");
                    return resolve("us");
                })
                .catch(function (err) { console.error(err); });
        });
    }

    /**
     * Opens the IndexedDB database used for translation caching.
     * @private
     * @returns {Promise<IDBDatabase>}
     */
    static _openCache() {
        return new Promise(function (resolve, reject) {
            const req = window.indexedDB.open(TranslationManager.DB_NAME, TranslationManager.DB_VER);

            req.onerror = function (ev) {
                if (ev.target instanceof IDBOpenDBRequest) reject(ev.target.error);
                else reject(ev.target);
            };

            req.onupgradeneeded = function (ev) {
                if (ev.target instanceof IDBOpenDBRequest) {
                    try {
                        ev.target.result.deleteObjectStore(TranslationManager.STORE_NAME);
                    } catch (err) {
                        console.error(err);
                    }

                    ev.target.result.createObjectStore(TranslationManager.STORE_NAME, { keyPath: "iCode" });
                } else reject(ev.target);
            }

            req.onsuccess = function (ev) {
                if (ev.target instanceof IDBOpenDBRequest) resolve(ev.target.result);
                else reject(ev.target);
            };
        });
    }

    /**
     * Adds/edits a translation in the cache.
     * @private
     * @param {Translation} translation
     * @returns {Promise<true>}
     */
    static _setTranslation(translation) {
        return new Promise(function (resolve, reject) {
            TranslationManager._openCache()
                .then(function (db) {
                    const transaction = db.transaction([TranslationManager.STORE_NAME], "readwrite");
                    const store = transaction.objectStore(TranslationManager.STORE_NAME);
                    store.put(translation);

                    transaction.oncomplete = function (ev) {
                        db.close();
                        resolve(true);
                    };
                })
                .catch(function (err) { reject(err); });
        });
    }

    /**
     * Deletes the translation with the specified code within the specified namespace.
     * @private
     * @param {string} code
     * @param {string} ns
     * @returns {Promise<true>}
     */
    static _deleteTranslation(code, ns) {
        return new Promise(function (resolve, reject) {
            TranslationManager._openCache()
                .then(function (db) {
                    const transaction = db.transaction([TranslationManager.STORE_NAME], "readwrite");
                    const store = transaction.objectStore(TranslationManager.STORE_NAME);
                    const iCode = TranslationManager._getICode(code, ns);

                    try {
                        store.delete(iCode);
                    } catch (err) {
                        if (!(err instanceof DOMException)) throw err;
                        if (err.name !== "DataError") throw err;
                    }

                    transaction.oncomplete = function () {
                        db.close();
                        resolve(true);
                    };
                })
                .catch(function (err) { reject(err); });
        });
    }

    /**
     * Fetches a translation in the specified language from the cache (if possible) or from the server.
     * @private
     * @param {string} code
     * @param {string} lang
     * @param {string} ns
     * @returns {Promise<Translation | null>}
     */
    static _fetchTranslation(code, ns, lang) {
        return new Promise(function (resolve, reject) {
            TranslationManager._openCache()
                .then(function (db) {
                    const transaction = db.transaction([TranslationManager.STORE_NAME]);
                    const store = transaction.objectStore(TranslationManager.STORE_NAME);

                    const iCode = TranslationManager._getICode(code, ns);
                    const req = store.get(iCode);

                    transaction.oncomplete = function (ev) {
                        db.close();

                        if (isTranslation(req.result)) {
                            if (req.result.lang === lang && req.result.ns === ns) {
                                // Return and resolve if the translation hasn't expired yet.
                                // Otherwise, delete it from the cache and keep going (it will be fetched from the API).

                                if (req.result.ttl > Date.now()) return resolve(req.result);
                                else TranslationManager._deleteTranslation(req.result.code, req.result.ns);
                            }
                        }

                        request({
                            url: `/locales/json/${lang}/${ns}.json`,
                            method: "GET",
                            headers: undefined,
                            body: undefined
                        })
                            .then(function (translations) {
                                const translationText = translations[code];
                                if (translationText === undefined) resolve(null);

                                const translation = {
                                    code,
                                    ns,
                                    lang,
                                    iCode: TranslationManager._getICode(code, ns),
                                    translation: translationText,
                                    ttl: Date.now() + 1000 * 60 * 60 * 24 * 16
                                };

                                TranslationManager._setTranslation(translation)
                                    .then(function () { resolve(translation); });
                            });
                    }
                })
                .catch(function (err) { reject(err); });
        })
    }

    /**
     * Clears the cache of translation.
     * @returns {Promise<true>}
     */
    static clear() {
        return new Promise(function (resolve, reject) {
            TranslationManager._openCache()
                .then(function (db) {
                    const transaction = db.transaction([TranslationManager.STORE_NAME], "readwrite");
                    const store = transaction.objectStore(TranslationManager.STORE_NAME);
                    const req = store.getAllKeys();

                    transaction.oncomplete = function (ev) {
                        for (const key of req.result) {
                            const [code, ns] = key.toString().split("::");
                            TranslationManager._deleteTranslation(code, ns);
                        }

                        resolve(true);
                    }
                })
                .catch(function (err) { reject(err); });
        });
    }

    /**
     * Fetches a translation in the appropriate language from the cache (if possible) or from the server.
     * @param {string} code
     * @param {string} ns
     * @returns {Promise<Translation|null>}
     */
    static fetchTranslation(code, ns) {
        return new Promise(function (resolve, reject) {
            TranslationManager._getLanguage()
                .then(function (lang) {
                    TranslationManager._fetchTranslation(code, ns, lang)
                        .then(function (translation) {
                            if (translation === null && lang !== "en") {
                                TranslationManager._fetchTranslation(code, ns, "en")
                                    .then(function (fallbackTranslation) { resolve(fallbackTranslation); });
                            } else resolve(translation);
                        });
                })
                .catch(function (err) { reject(err) });
        });
    }
}

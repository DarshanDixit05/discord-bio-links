/**
 *  Class for managing the language the user is currently focused on.
 */
export class FocusLangManager {
    /**
     * Gets the current focus language.
     * @returns {string}
     */
    static getFocusLang() {
        return sessionStorage.getItem("flang") || "us";
    }

    /**
     * Sets the focus language.
     * @param {string} code 
     * @returns {string} - The focus language now.
     */
    static setFocusLang(code) {
        sessionStorage.setItem("flang", code);
        return code;
    }
}
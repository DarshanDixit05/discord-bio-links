import i18next from "i18next";
import { cfg } from "../config.js";
import Backend from "i18next-fs-backend";

export async function prepareI18n(i18n: i18next.i18n, namespaces: string[]): Promise<void> {
    await i18n.use(Backend).init({
        fallbackLng: 'us',
        ns: namespaces,
        backend: {
            loadPath: cfg.translationsPath
        }
    });
}
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envName = `dev`;
const envFilePath = resolve(__dirname, "..", `.${envName}.env`);

dotenv.config({ path: envFilePath });

if (process.env.SERVER_PORT === undefined || process.env.SERVER_PORT === "" || isNaN(parseInt(`${process.env.SERVER_PORT}`))) throw new Error(`Missing/Invalid SERVER_PORT in ${envFilePath}`);
if (process.env.NUMBER_OF_PROXIES === undefined || process.env.NUMBER_OF_PROXIES === "" || isNaN(parseInt(`${process.env.NUMBER_OF_PROXIES}`))) throw new Error(`Missing/Invalid NUMBER_OF_PROXIES in ${envFilePath}`);
if (process.env.CLIENT_ID === undefined || process.env.CLIENT_ID === "") throw new Error(`Missing CLIENT_ID in ${envFilePath}`);
if (process.env.CLIENT_SECRET === undefined || process.env.CLIENT_SECRET === "") throw new Error(`Missing CLIENT_SECRET in ${envFilePath}`);


export const cfg = {
    envName,
    translationsPath: resolve(__dirname, "..", "public", 'locales/{{lng}}/{{ns}}.json'),
    numberOfProxies: parseInt(`${process.env.NUMBER_OF_PROXIES}`),
    port: parseInt(`${process.env.SERVER_PORT}`),
    client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
        redirectUri: "https://localhost:3000"
    },
    directories: {
        public: resolve(__dirname, "..", "public"),
        databases: resolve(__dirname, "..", "db"),
        routes: resolve(__dirname, "server", "routes")
    },
    databasePaths: {
        sessions: resolve(__dirname, "..", "db", `${envName}.sessions.sqlite`),
        loginAttempts: resolve(__dirname, "..", "db", `${envName}.logins.sqlite`),
        users: resolve(__dirname, "..", "db", `${envName}.users.sqlite`)
    }
};
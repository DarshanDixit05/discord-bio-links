import { cfg } from "./config.js";
import { appServer } from "./server/server.js";

console.log(`Current 'cfg' object:`, cfg);

if (cfg.envName === "dev") {
    const localIP = cfg.localIp;
    if (!localIP) throw new Error("undefined localIP");
    appServer.listen(cfg.port, localIP || "localhost", function () { console.log(`Server launched and listening at ${localIP}:${cfg.port} !`) });
} else {
    appServer.listen(cfg.port, () => console.log(`Server launched and listening at port ${cfg.port} !`));
}
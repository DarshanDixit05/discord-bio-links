import { cfg } from "./config.js";
import { appServer } from "./server/server.js";

console.log(`Current 'cfg' object:`, cfg);
appServer.listen(cfg.port, () => console.log(`Server launched and listening at localhost:${cfg.port}`));
import express from "express";
import serveIndex from "serve-index";
import path from "path";
import expressBasicAuth from "express-basic-auth";
import shopFileBuilder from "./shop-file-builder.js";
import { romsDirPath, appPort, unauthorizedMessage } from "./helpers/envs.js";
import { afterStartFunction } from "./afterStartFunction.js";
import { getUsersFromEnv } from "./authUsersParser.js";
import SaveSyncManager from "./modules/ftp-client.js";
import staticIndexHTML from "./staticIndexHTML.js";


const saveSyncManager = new SaveSyncManager();
const expressApp = express();
// Serve static files and interface
const BasicAuthUsers = getUsersFromEnv();
if (BasicAuthUsers) {
  expressApp.use(
    expressBasicAuth({
      users: BasicAuthUsers,
      unauthorizedResponse: unauthorizedMessage,
      challenge: true,
    })
  );
}

expressApp.use(shopFileBuilder(saveSyncManager));

expressApp.use(express.static(path.join(romsDirPath)));
expressApp.use(
  serveIndex(romsDirPath, {
    icons: true,
    // will ignore . starting files like .hidden, .env ....
    hidden: false,
    // should ignore games folders only showing index files
    // to avoid bug not listing on tinfoilapp when have too many games +50 itens aprox.
    template: staticIndexHTML

  })
);
const server = expressApp.listen(appPort, afterStartFunction(appPort));

await saveSyncManager.start();

export default server;

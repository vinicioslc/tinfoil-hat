import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
}).parsed;

import path from "path";
import fileDirName from "./helpers.js";
const nspFullDirPath = path.resolve(
  process?.env?.ROMS_DIR_FULLPATH ??
    path.join(fileDirName(import.meta).__dirname, "/games/")
);
const jsonTemplatePath = path.resolve(
  process?.env?.JSON_TEMPLATE_PATH ??
    path.join(fileDirName(import.meta).__dirname, "../shop_template.jsonc")
);
const appPort = process?.env?.TINFOIL_HAT_PORT ?? "80"; // default listen port
export {
  nspFullDirPath,
  jsonTemplatePath, // default json template path
  appPort,
};

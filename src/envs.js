import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
}).parsed;

import path from "path";
import fileDirName from "./helpers.js";
const romsPath =
  process?.env?.ROMS_DIR_FULLPATH ??
  path.join(fileDirName(import.meta).__dirname, "/games/");
const romsDirPath = path.resolve(romsPath);
const jsonTemplatePath = path.resolve(
  process?.env?.JSON_TEMPLATE_PATH ??
    path.join(fileDirName(import.meta).__dirname, "../shop_template.jsonc")
);
const appPort = process?.env?.TINFOIL_HAT_PORT ?? "80"; // default listen port

const authUsers = process?.env?.AUTH_USERS ?? null; // default listen port
const unauthorizedMessage =
  process?.env?.UNAUTHORIZED_MSG ?? "No tricks and treats for you!!";
const welcomeMessage = process?.env?.WELCOME_MSG ?? null;

export {
  romsDirPath,
  jsonTemplatePath, // default json template path
  appPort,
  authUsers,
  unauthorizedMessage,
  welcomeMessage,
};

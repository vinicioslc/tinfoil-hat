const path = require("path");

const nspFullDirPath = path.resolve(
  process?.env?.ROMS_DIR_FULLPATH ?? path.join(__dirname, "/games/")
);
exports.nspFullDirPath = nspFullDirPath;

const jsonTemplatePath = path.resolve(
  process?.env?.JSON_TEMPLATE_PATH ??
    path.join(__dirname, "shop_template.jsonc")
);
exports.jsonTemplatePath = jsonTemplatePath; // default json template path

const appPort = process?.env?.PORT ?? "80"; // default listen port
exports.appPort = appPort;

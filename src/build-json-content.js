const fs = require("fs");
const fastGlob = require("fast-glob");
const path = require("path");
const JSON5 = require("json5");

const { nspFullDirPath, jsonTemplatePath } = require("../envs");
const FastGlob = require("fast-glob");
const console = require("../debug");

const valid_ext = [".nsp", ".nsz", ".xci", ".zip"].map((value) => "**" + value);
//  Shop template file to use
const getJsonTemplateFile = () =>
  JSON5.parse(fs.readFileSync(jsonTemplatePath));
const addRelativeStartPath = (path) => {
  return "../" + path;
};

const addFileInfoToPath = async (filePath) => {
  const status = fs.statSync(
    path.join(nspFullDirPath, filePath.replace(/^\.\.\//gim, ""))
  );
  return { url: filePath, size: status.size };
};
module.exports = async () => {
  const jsonTemplate = getJsonTemplateFile();
  files = await FastGlob(valid_ext, {
    cwd: nspFullDirPath, // use path to resolve games
    dot: false, // ignore dot starting path
    onlyFiles: true, // only list files
    braceExpansion: false,
    absolute: false, // absolute path
  });
  directories = await FastGlob(["**"], {
    cwd: nspFullDirPath, // use path to resolve games
    dot: false, // ignore dot starting path
    onlyFiles: true, // only list files
    braceExpansion: false,
    onlyDirectories: true,
    absolute: false, // absolute path
  });
  console.log("total game/save files found:", files.length);
  console.log("total directories found:", directories.length);
  return Object.assign(jsonTemplate, {
    files: await Promise.all(
      files.map(addRelativeStartPath).map(addFileInfoToPath)
    ),
    directories: directories.map(addRelativeStartPath),
  });
};

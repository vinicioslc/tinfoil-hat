// Use the file system fs promises
import { readFile, writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import JSON5 from "json5";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { nspFullDirPath, jsonTemplatePath } from "./envs.js";
import debug from "./debug.js";

// File Exist returns true
// dont use exists which is no more!
const createIfNoExists = async (fileNamePath) => {
  try {
    // try to read file
    await readFile(fileNamePath);
    debug.file("index file already exists: %o", fileNamePath);
  } catch (error) {
    // create empty file, because it wasn't found
    debug.file("created: %o", fileNamePath);
    await writeFile(fileNamePath, "");
  }
};

const addRelativeStartPath = (path) => {
  return "../" + path;
};

const addUrlEncodedFileInfo = (filePath) => {
  filePath = encodeURI(filePath);
  return filePath;
};
const addFileInfoToPath = async (filePath) => {
  const status = fs.statSync(
    path.join(nspFullDirPath, decodeURI(filePath).replace(/^\.\.\//gim, ""))
  );
  return { url: filePath, size: status.size };
}; //  Shop template file to use
const getJsonTemplateFile = () =>
  JSON5.parse(fs.readFileSync(jsonTemplatePath));

export default function fileDirName(meta) {
  const __filename = fileURLToPath(meta.url);

  const __dirname = dirname(__filename);

  return { __dirname, __filename };
}
export {
  addUrlEncodedFileInfo,
  addFileInfoToPath,
  addRelativeStartPath,
  getJsonTemplateFile,
  fileDirName,
  createIfNoExists,
};

// Use the file system fs promises
import { readFile, writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import JSON5 from "json5";
import { fileURLToPath } from "url";
import { dirname } from "path";
import urlencode from "urlencode";
import url from "url";

import { nspFullDirPath, jsonTemplatePath } from "./envs.js";
import debug from "./debug.js";

// File Exist returns true
// dont use exists which is no more!
const createIfNoExists = async (fileNamePath) => {
  try {
    // try to read file
    await readFile(fileNamePath);
  } catch (error) {
    // create empty file, because it wasn't found
    debug.file("created index file: %o", fileNamePath);
    await writeFile(fileNamePath, "");
  }
};

const addRelativeStartPath = (path) => {
  path.url = "../" + path.url;
  return path;
};

/**
 *  This function remove special characters that could affect tinfoil listings
 *
 * @param {any} value
 * @returns
 */
function stringNormalizer(value) {
  const replacer = [
    [/\[/gim, "%5B"],
    [/\]/gim, "%5D"],
    [/\(/gim, "%28"],
    [/\)/gim, "%29"],
    [/\=/gim, "%3D"],
    [/\+/gim, "%2B"],
    [/\,/gim, "%2C"],
    [/\;/gim, "%3B"],
    [/\//gim, "%2F"],
    [/\\/gim, "%5C"],
  ];

  if (!value) return value;

  for (const replace of replacer) {
    value = value.replace(replace[0], replace[1]);
  }

  return value;
}
const addUrlEncodedFileInfo = (filePath) => {
  const toReturn = stringNormalizer(url.parse(filePath.url).path);
  filePath.url = toReturn;
  return filePath;
};
const addFileInfoToPath = async (filePath) => {
  const status = fs.statSync(
    path.join(nspFullDirPath, filePath.replace(/^\.\.\//gim, ""))
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

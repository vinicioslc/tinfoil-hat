import path from "path";
import FastGlob from "fast-glob";

import debug from "./debug.js";
import { romsDirPath, welcomeMessage } from "./helpers/envs.js";
import {
  addFileInfoToPath,
  addRelativeStartPath,
  getJsonTemplateFile,
  addUrlEncodedFileInfo as encodeURL,
} from "./helpers/helpers.js";

const validExtensions = ["nsp", "nsz", "xci", "zip"].map(
  (value) => `**.${value.replace(".", "")}`
);

export default async () => {

  const jsonTemplate = getJsonTemplateFile();
  let files = await FastGlob(validExtensions, {
    cwd: romsDirPath, // use path to resolve games
    dot: false, // ignore dot starting path
    onlyFiles: true, // only list files
    braceExpansion: false,
    absolute: false, // absolute path
  });
  let directories = await FastGlob(["**"], {
    cwd: romsDirPath, // use path to resolve games
    dot: false, // ignore dot starting path
    onlyFiles: true, // only list files
    braceExpansion: false,
    onlyDirectories: true,
    absolute: false, // absolute path
  });
  debug.log("total game/save files found:", files.length);
  debug.log("total directories found:", directories.length);

  if (welcomeMessage) {
    if (!jsonTemplate.success) {
      jsonTemplate.success = welcomeMessage;
    }
  }
  files = (await Promise.all(files.map(addFileInfoToPath)))
    .map(encodeURL)
    .map(addRelativeStartPath);

  directories = directories
    .map((file) => {
      return { url: file };
    })
    .map(encodeURL)
    .map(addRelativeStartPath)
    .map((file) => {
      return file.url;
    });

  return Object.assign(jsonTemplate, {
    files,
    directories,
  });
};

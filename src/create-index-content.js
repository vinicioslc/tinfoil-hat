import path from "path";
import FastGlob from "fast-glob";

import debug from "./debug.js";
import { nspFullDirPath, welcomeMessage } from "./envs.js";
import {
  addFileInfoToPath,
  addRelativeStartPath,
  addUrlEncodedFileInfo,
  getJsonTemplateFile,
  createIfNoExists,
} from "./helpers.js";

const valid_ext = [".nsp", ".nsz", ".xci", ".zip"].map((value) => "**" + value);

export default async () => {
  // create files info to be showned by the file index package
  try {
    await createIfNoExists(path.join(nspFullDirPath, "shop.json"));
    await createIfNoExists(path.join(nspFullDirPath, "shop.tfl"));
  } catch (error) {}
  const jsonTemplate = getJsonTemplateFile();
  let files = await FastGlob(valid_ext, {
    cwd: nspFullDirPath, // use path to resolve games
    dot: false, // ignore dot starting path
    onlyFiles: true, // only list files
    braceExpansion: false,
    absolute: false, // absolute path
  });
  let directories = await FastGlob(["**"], {
    cwd: nspFullDirPath, // use path to resolve games
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
      jsonTemplate.success = welcomeMessage
    }
  }

  return Object.assign(jsonTemplate, {
    files: await Promise.all(
      files
        .map(addRelativeStartPath)
        .map(addUrlEncodedFileInfo)
        .map(addFileInfoToPath)
    ),
    directories: directories
      .map(addRelativeStartPath)
      .map(addUrlEncodedFileInfo),
  });
};

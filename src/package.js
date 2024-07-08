import fs from "fs";
import JSON5 from "json5";
import path from "path";
import { fileDirName } from "./helpers/helpers.js";

const content = JSON5.parse(
  fs.readFileSync(
    path.join(fileDirName(import.meta).__dirname, "../package.json")
  )
);

export default content;

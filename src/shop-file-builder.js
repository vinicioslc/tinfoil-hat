/**
 *  Generate a 'shop.tfl' Tinfoil index file
 *  as well as 'shop.json', same content but viewable in the browser
 *
 */

import debug from "./debug.js";
import generateIndex from "./create-index-content.js";
import SaveSyncManager from "./modules/ftp-client.js";
function formatIPAddress(ip) {
  return ip.split(":")[ip.split(":").length - 1];
}
/**
 * Description
 * @param {SaveSyncManager} saveSyncManager
 * @returns {any}
 */
export default function (saveSyncManager) {
  /**
   * @param  {import("express").Request} req
   * @param  {import("express").Response} res
   * @param  {import("express").NextFunction} next
   */
  return async (req, res, next) => {
    if (req.path === "/shop.json") {
      debug.http("IN-> %o", req.path, "IP:", req.ip);
      res.header("Content-Type", "application/json");
      res.status(200).send(await generateIndex());
      debug.http("OUT-< %o", req.path);
      return;
    } else if (req.path === "/shop.tfl") {
      /** When occurs some tinfoil listing the server will store the IP on memory */
      if (req.ip.split(":").length) {
        await saveSyncManager.addRecentDevice(formatIPAddress(req.ip));
      }
      debug.http("IN-> %o", req.path);
      res.header("Content-Type", "application/octet-stream");
      res.status(200).send(await generateIndex());
      debug.http("OUT-< %o", req.path);
      return;
    } else {
      debug.http("IN-> %o", req.path);
      next();
      debug.http("OUT-< %o", req.path);
      return;
    }
  };
}

/**
 *  Generate a 'shop.tfl' Tinfoil index file
 *  as well as 'shop.json', same content but viewable in the browser
 *
 */

import debug from "./debug.js";
import buildJsonContent from "./build-json-content.js";

/**
 * @param  {import("express").Request} req
 * @param  {import("express").Response} res
 * @param  {import("express").NextFunction} next
 */
export default async (req, res, next) => {
  if (req.path === "/shop.json") {
    debug.http("IN-> %o", req.path);
    res.header("Content-Type", "application/json");
    res.status(200).send(await buildJsonContent());
    debug.http("OUT-< %o", req.path);
    return;
  } else if (req.path === "/shop.tfl") {
    debug.http("IN-> %o", req.path);
    res.header("Content-Type", "application/octet-stream");
    res.status(200).send(await buildJsonContent());
    debug.http("OUT-< %o", req.path);
    return;
  } else {
    debug.http("IN-> %o", req.path);
    next();
    debug.http("OUT-< %o", req.path);
    return;
  }
};

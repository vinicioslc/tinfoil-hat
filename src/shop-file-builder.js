/**
 *  Generate a 'shop.tfl' Tinfoil index file
 *  as well as 'shop.json', same content but viewable in the browser
 *
 */

const debug = require("../debug");
const buildJsonContent = require("./build-json-content");

/**
 * @param  {import("express").Request} req
 * @param  {import("express").Response} res
 * @param  {import("express").NextFunction} next
 */
module.exports = async (req, res, next) => {
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

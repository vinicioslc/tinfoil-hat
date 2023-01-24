/**
 *  Generate a 'shop.tfl' Tinfoil index file
 *  as well as 'shop.json', same content but viewable in the browser
 *
 */

const console = require("../debug");
const buildJsonContent = require("./build-json-content");

/**
 * @param  {import("express").Request} req
 * @param  {import("express").Response} res
 * @param  {import("express").NextFunction} next
 */
module.exports = async (req, res, next) => {
  console.http("IN-> %o", req.path);
  if (req.path === "/shop.json") {
    res.header("Content-Type", "application/json");
    res.status(200).send(await buildJsonContent());
  } else if (req.path === "/shop.tfl") {
    res.header("Content-Type", "application/octet-stream");
    res.status(200).send(await buildJsonContent());

  }
  console.http("OUT-< %o", req.path);
  next();
};

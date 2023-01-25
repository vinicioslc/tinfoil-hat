import debug from "debug";

var log = debug("tinfoil-hat");
var http = debug("tinfoil-hat:request");
var file = debug("tinfoil-hat:file");
var error = debug("tinfoil-hat:error");

export default {
  http,
  file,
  log,
  error: console.error,
};

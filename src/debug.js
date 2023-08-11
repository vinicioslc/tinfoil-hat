import debug from "debug";

var log = debug("tinfoil-hat");
var http = debug("tinfoil-hat:request");
var file = debug("tinfoil-hat:file");
var ftp = debug("tinfoil-hat:ftp");
var error = debug("tinfoil-hat:err");

export default {
  http,
  file,
  log,
  ftp,
  error,
};

import _ from "lodash";

import { authUsers } from "./envs.js";
import debug from "./debug.js";

function parseUserString(authString) {
  return { name: authString[0].trim(), pass: authString[1].trim() };
}

export function getUsersFromEnv() {
  let parsedUsers = null;
  if (!_.isNil(authUsers?.length)) {
    if (authUsers.includes(",") && authUsers.includes(":")) {
      if (authUsers.split(",").length > 0) {
        parsedUsers = authUsers
          .split(",")
          .map((userString) => userString.split(":"))
          .map(parseUserString);
      }
    } else if (authUsers.includes(":")) {
      parsedUsers = [parseUserString(authUsers.split(":"))];
    }

    debug.log(
      "Auth Users Loaded: %O",
      parsedUsers.map((value) => value.name).join(",")
    );
    if (parsedUsers?.length) {
      // transform this [ { name: admin, pass: 123 } ] to this -> { admin: 123 }
      parsedUsers = parsedUsers.reduce(function (accumulator, user) {
        return _.merge(accumulator ?? {}, { [user.name]: user.pass });
      }, {});
    }
  }
  return parsedUsers;
}

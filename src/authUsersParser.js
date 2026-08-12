import { authUsers } from "./helpers/envs.js";
import debug from "./debug.js";

/**
 * Separa "user:pass" em { name, pass }.
 * Usa o PRIMEIRO ":" como delimitador — permite senhas contendo ":".
 * Espacos ao redor sao ignorados.
 */
function parseUserString(authString) {
  const idx = authString.indexOf(":");
  if (idx === -1) return null;
  const name = authString.slice(0, idx).trim();
  if (!name) return null; // user vazio e invalido
  return {
    name,
    pass: authString.slice(idx + 1).trim(),
  };
}

/**
 * Funcao pura: converte a string AUTH_USERS em objeto { user: pass }.
 * Formatos aceitos:
 *   "user:pass"
 *   "user:pass,user2:pass2"
 * Retorna null quando a string e vazia/invalida.
 */
export function parseAuthUsers(authString) {
  if (!authString || typeof authString !== "string") return null;
  if (!authString.includes(":")) return null;

  const entries = authString
    .split(",")
    .map((userString) => parseUserString(userString))
    .filter(Boolean);

  if (!entries.length) return null;

  return entries.reduce((acc, user) => {
    acc[user.name] = user.pass;
    return acc;
  }, {});
}

export function getUsersFromEnv() {
  const parsedUsers = parseAuthUsers(authUsers);
  if (parsedUsers) {
    debug.log(
      "Auth Users Loaded: %O",
      Object.keys(parsedUsers).join(",")
    );
  }
  return parsedUsers;
}

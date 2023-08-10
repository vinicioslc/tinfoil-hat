import path from "path";

import ipSearch from "./ip-search.js";
import { savesDirPath } from "../helpers/envs.js";
import ftp from "basic-ftp";
import debug from "../debug.js";

export default class FTPClient {
  retryTimeout = null;
  async start(config) {
    const { retry = false } = config ?? {};
    if (retry && this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout.unref();
    }
    try {
      let switchIP = process.env.NX_IPS;
      const switchPORT = process.env.NX_PORTS ?? 5000;
      if (!process.env.NX_IPS) {
        const valuesFound = await ipSearch.searchLanDevices(5000);
        console.log("DEVICES FOUND", valuesFound[0].ip);
        switchIP = valuesFound[0].ip;
      }

      const client = new ftp.Client(0);
      client.trackProgress((info) => {
        process.stdout.write(".");
      });

      console.log("CONNECTED TO", switchIP);
      await client.access({
        host: switchIP,
        port: switchPORT,
      });
      await downloadEverthing(client);
    } catch (error) {
      debug.error("Fail during ftp sync, retrying in 5 seconds...", error);
      this.retryTimeout = setTimeout(this.start({ retry: true }), 5000);
    }
  }
}
/**
 * Description
 * @param {ftp.Client} ftp
 * @returns {void}
 */
async function downloadEverthing(ftp) {
  const supportedBackups = await checkSwitchBackups(ftp);
  debug.log("SUPPORTED BACKUPS", supportedBackups);
  if (supportedBackups.length) {
    for (const backupFolder of supportedBackups) {
      const localBackupFolder = path.resolve(savesDirPath, backupFolder.local);
      debug.log('DOWNLOADING REMOTE SWITCH "', backupFolder.remote, '"');
      debug.log('TO LOCAL PATH "', localBackupFolder, '"');
      await ftp.downloadToDir(localBackupFolder, backupFolder.remote);
      debug.log("DOWNLOAD TO BACKUP FINISHED");
    }
  } else {
    console.warn("NO BACKUPS SUPPORTED");
  }
}

async function checkSwitchBackups(ftp) {
  const supportedBackups = [];
  try {
    const jksvFiles = await ftp.list("/JKSV");
    if (jksvFiles.length) {
      supportedBackups.push({ name: "JKSV", remote: "/JKSV", local: "JKSV" });
    }
  } catch (error) {
    console.warn("NOT FOUND JKSV FOLDER", "/JKSV");
  }
  try {
    const tinfoilFiles = await ftp.list("/switch/tinfoil/saves/common");
    if (tinfoilFiles.length) {
      supportedBackups.push({
        name: "TINFOIL",
        local: "Tinfoil",
        remote: "/switch/tinfoil/saves/common",
      });
    }
  } catch (error) {
    console.warn("NOT FOUND TINFOIL FOLDER", "/switch/tinfoil/saves/common");
  }
  return supportedBackups;
}

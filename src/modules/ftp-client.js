import path from "path";

import ipSearch from "./ip-search.js";
import { savesDirPath } from "../helpers/envs.js";
import ftp from "basic-ftp";
import debug from "../debug.js";

export default class SaveSyncManager {
  retryTimeout = null;
  checkInterval = null;
  DEVICES_IP_LIST = [];
  constructor() {
    this.intervalMS = 5000;
    if (process?.env?.SAVE_SYNC_INTERVAL) {
      this.intervalMS = process.env.SAVE_SYNC_INTERVAL;
    }
    if (process?.env?.NX_IPS && process.env.NX_IPS.includes(";")) {
      this.DEVICES_IP_LIST = process.env.NX_IPS.split(";")[0];
    } else if (process?.env?.NX_IPS) {
      this.DEVICES_IP_LIST.push(process.env.NX_IPS);
    }
    debug.log("Save sync manager initialized", this.DEVICES_IP_LIST);
  }
  async addRecentDevice(ip) {
    if (!this.DEVICES_IP_LIST.includes(ip)) {
      debug.ftp("ADD TO DEVICES", ip);
      this.DEVICES_IP_LIST.push(ip);
    }
  }

  async start(config) {
    const { retry = false } = config ?? {};
    if (retry && this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout.unref();
    }
    this.ensurePauseInterval();
    debug.ftp("RUNING FTP CHECK ON DEVICES:", this.DEVICES_IP_LIST.length);
    for (const switchIP of this.DEVICES_IP_LIST) {
      try {
        await this.makeDeviceSync(switchIP);
      } catch (error) {
        if (!retry) {
          debug.ftp(
            "Fail during ftp sync, ip:",
            switchIP,
            "will retry in next sync..."
          );
        }
      }
    }
    this.ensureIntervalExists();
  }
  ensurePauseInterval() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  ensureIntervalExists() {
    if (!this.checkInterval && this.intervalMS >= 5000) {
      this.checkInterval = setInterval(() => this.start(), this.intervalMS);
      debug.log(
        "SCHEDULED NEXT EXECUTION IN",
        this.intervalMS / 1000,
        "seconds"
      );
    }
  }

  async makeDeviceSync(switchIP) {
    const switchPORT = process.env.NX_PORTS ?? 5000;
    const switchPass = process.env.NX_PASSWORD ?? undefined;
    const switchUser = process.env.NX_USER ?? undefined;
    const client = new ftp.Client(0);
    client.trackProgress((info) => {
      process.stdout.write(".");
    });

    await client.access({
      host: switchIP,
      port: switchPORT,
      password: switchPass,
      user: switchUser,
    });
    debug.ftp("CONNECTED TO DEVICE:", switchIP);
    await downloadEverthing(client);
  }
}
/**
 * Description
 * @param {ftp.Client} ftp
 * @returns {void}
 */
async function downloadEverthing(ftp) {
  const supportedBackups = await checkSwitchBackups(ftp);
  debug.ftp(
    "SUPPORTED BACKUPS",
    supportedBackups.map((val) => val.name)
  );
  if (supportedBackups.length) {
    for (const backupFolder of supportedBackups) {
      const localBackupFolder = path.resolve(savesDirPath, backupFolder.local);
      debug.ftp(
        "START SYNC SWITCH FOLDER:",
        backupFolder.remote,
        "TO:",
        localBackupFolder
      );
      await ftp.downloadToDir(localBackupFolder, backupFolder.remote);
      debug.ftp("END SYNC SWITCH FOLDER");
    }
  } else {
    debug.ftp("NO BACKUPS SUPPORTED BY");
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
    const tinfoilFiles = await ftp.list("/switch/tinfoil/saves");
    if (tinfoilFiles.length) {
      supportedBackups.push({
        name: "TINFOIL",
        local: "Tinfoil",
        remote: "/switch/tinfoil/saves",
      });
    }
  } catch (error) {
    debug.ftp("NOT FOUND TINFOIL FOLDER", "/switch/tinfoil/saves");
  }
  return supportedBackups;
}

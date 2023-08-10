import findIPS from "local-devices";
export default class IPSearch {
  static async searchLanDevices(values) {
    const result = await new Promise(async (resolve, rej) => {
      const ipsFound = await findIPS({
        address: "192.168.0.2-192.168.0.192",
      });
      const mappedReturn = ipsFound.map((value) => value);
      resolve(mappedReturn);
    });
    return result;
  }
}

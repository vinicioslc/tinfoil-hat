import findIPS from "local-devices";

/**
 * Busca dispositivos na LAN para descoberta automatica do Switch.
 * O range de IPs e configuravel via env LAN_SCAN_RANGE (ex.: "192.168.0.2-192.168.0.192").
 * Default: varre a sub-rede /24 da interface padrao (best-effort).
 */
export default class IPSearch {
  static async searchLanDevices() {
    const range = process.env.LAN_SCAN_RANGE;
    const opts = range ? { address: range } : {};
    const ipsFound = await findIPS(opts);
    return ipsFound.map((value) => value);
  }
}

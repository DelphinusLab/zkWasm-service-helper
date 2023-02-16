import BN from "bn.js";
export declare class ZkWasmUtil {
    static hexToBNs(hexString: string): Array<BN>;
    static parseArg(input: string): Array<BN> | null;
    static convertToMd5(value: Uint8Array): string;
}

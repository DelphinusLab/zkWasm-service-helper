import BN from "bn.js";
import { AddImageParams, ProvingParams, DeployParams } from "interface/interface";
export declare class ZkWasmUtil {
    static hexToBNs(hexString: string): Array<BN>;
    static parseArg(input: string): Array<BN> | null;
    static convertToMd5(value: Uint8Array): string;
    createAddImageSignMessage(params: AddImageParams): string;
    createProvingSignMessage(params: ProvingParams): string;
    createDeploySignMessage(params: DeployParams): string;
}

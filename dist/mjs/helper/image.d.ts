import { ZkWasmServiceEndpoint } from "./endpoint.js";
export declare class ZkWasmServiceImageHelper {
    endpoint: ZkWasmServiceEndpoint;
    constructor(endpoint: string, username: string, useraddress: string);
    queryImage(md5: string): Promise<any>;
    queryImages(md5: string): Promise<any>;
}

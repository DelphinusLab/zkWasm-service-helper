import FormData from "form-data";
type JSON = {
    [key: string]: any;
};
type Headers = {
    [key: string]: string;
};
export declare class ZkWasmServiceEndpoint {
    endpoint: string;
    username: string;
    useraddress: string;
    enable_logs: boolean;
    constructor(endpoint: string, username: string, useraddress: string, enable_logs?: boolean);
    prepareRequest(method: "GET" | "POST", url: string, body: JSON | FormData | null, headers?: {
        [key: string]: string;
    }): Promise<any>;
    getJSONResponse(json: any): Promise<any>;
    invokeRequest(method: "GET" | "POST", url: string, body: JSON | FormData | null, headers?: {
        [key: string]: string;
    }): Promise<any>;
    customHttp(method: 'GET' | 'POST', url: string, localPort: number, body: JSON | FormData | null, headers?: Headers): Promise<unknown>;
}
export {};

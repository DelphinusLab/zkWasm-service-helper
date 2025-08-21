import FormData from "form-data";
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
}
export declare class ZkWasmServiceEndpointError extends Error {
    code: string;
    constructor(message: string, code: string);
}

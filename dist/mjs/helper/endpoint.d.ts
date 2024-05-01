import FormData from "form-data";
export declare class ZkWasmServiceEndpoint {
    endpoint: string;
    username: string;
    useraddress: string;
    enable_logs: boolean;
    custom_port: number;
    constructor(endpoint: string, username: string, useraddress: string, enable_logs?: boolean, custom_port?: number);
    prepareRequest(method: "GET" | "POST", url: string, body: JSON | FormData | null, headers?: {
        [key: string]: string;
    }): Promise<any>;
    getJSONResponse(json: any): Promise<any>;
    invokeRequest(method: "GET" | "POST", url: string, body: JSON | FormData | null, headers?: {
        [key: string]: string;
    }): Promise<any>;
    customRequest(method: 'GET' | 'POST', url: string, body: JSON | FormData | null, headers?: {
        [key: string]: string;
    }): Promise<unknown>;
    customGetRequest(method: 'GET', url: string, body: JSON | FormData | null, headers?: {
        [key: string]: string;
    }): Promise<unknown>;
}

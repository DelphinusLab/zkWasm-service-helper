import axios from "axios";
import FormData from "form-data";

export class ZkWasmServiceEndpoint {
    constructor(
        public endpoint: string,
        public username: string,
        public useraddress: string,
        public enable_logs: boolean = true,
    ) { }
    async prepareRequest(
        method: "GET" | "POST",
        url: string,
        body: JSON | FormData | null,
        headers?: {
            [key: string]: string;
        }
    ) {
        if (method === "GET") {
            if (this.enable_logs) {
              console.log(this.endpoint + url);
            }
            try {
                let response = await axios.get(
                    this.endpoint + url,
                    body ? { params: body!, headers: { ...headers } } : {},
                    
                );
                return response.data;
            } catch (e: any) {
                if (this.enable_logs) {
                  console.error(e);
                }
                return {
                    success: false,
                    error: e.response ? {
                        code: e.response.status,
                        message: e.response.data 
                    } : {
                        code: null,
                        message: e.message,
                    },
                }
            }
        } else {
            try {
                let response = await axios.post(
                    this.endpoint + url,
                    body ? body! : {},
                    {
                        headers: {
                            ...headers,
                        },
                    }
                );
                return response.data;
            } catch (e: any) {
                if (this.enable_logs) {
                  console.log(e);
                }
                return {
                    success: false,
                    error: e.response ? {
                        code: e.response.status,
                        message: e.response.data
                    } : {
                        code: null,
                        message: e.message,
                    },
                }

            }
        }
    }

    async getJSONResponse(json: any) {
        if (json["success"] !== true) {
            if (this.enable_logs) {
              console.error(json);
            }
            throw new Error(`${json["error"].code}: ${json["error"].message}`);
        }
        return json["result"];
    }

    async invokeRequest(
        method: "GET" | "POST",
        url: string,
        body: JSON | FormData | null,
        headers?: {
            [key: string]: string;
        }
    ) {
        let response = await this.prepareRequest(method, url, body, headers);
        return await this.getJSONResponse(response);
    }
}

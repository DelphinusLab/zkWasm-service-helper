import axios from "axios";
import FormData from "form-data";

export class ZkWasmServiceEndpoint {
    constructor(
        public endpoint: string,
        public username: string,
        public useraddress: string
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
            console.log(this.endpoint + url);
            try {
                let response = await axios.get(
                    this.endpoint + url,
                    body ? { params: body! } : {}
                );
                return response.data;
            } catch (e: any) {
                console.error(e);
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
                console.log(e);
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
            console.error(json);
            throw new Error(json["error"].message);
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

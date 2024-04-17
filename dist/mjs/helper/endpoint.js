import axios from "axios";
export class ZkWasmServiceEndpoint {
    endpoint;
    username;
    useraddress;
    enable_log;
    constructor(endpoint, username, useraddress, enable_log = true) {
        this.endpoint = endpoint;
        this.username = username;
        this.useraddress = useraddress;
        this.enable_log = enable_log;
    }
    async prepareRequest(method, url, body, headers) {
        if (method === "GET") {
            if (this.enable_log) {
                console.log(this.endpoint + url);
            }
            try {
                let response = await axios.get(this.endpoint + url, body ? { params: body, headers: { ...headers } } : {});
                return response.data;
            }
            catch (e) {
                if (this.enable_log) {
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
                };
            }
        }
        else {
            try {
                let response = await axios.post(this.endpoint + url, body ? body : {}, {
                    headers: {
                        ...headers,
                    },
                });
                return response.data;
            }
            catch (e) {
                if (this.enable_log) {
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
                };
            }
        }
    }
    async getJSONResponse(json) {
        if (json["success"] !== true) {
            if (this.enable_log) {
                console.error(json);
            }
            throw new Error(json["error"].message);
        }
        return json["result"];
    }
    async invokeRequest(method, url, body, headers) {
        let response = await this.prepareRequest(method, url, body, headers);
        return await this.getJSONResponse(response);
    }
}

import axios from "axios";
export class ZkWasmServiceEndpoint {
    endpoint;
    username;
    useraddress;
    enable_logs;
    constructor(endpoint, username, useraddress, enable_logs = true) {
        this.endpoint = endpoint;
        this.username = username;
        this.useraddress = useraddress;
        this.enable_logs = enable_logs;
    }
    async prepareRequest(method, url, body, headers) {
        if (method === "GET") {
            if (this.enable_logs) {
                console.log(this.endpoint + url);
            }
            try {
                let response = await axios.get(this.endpoint + url, body ? { params: body, headers: { ...headers } } : {});
                return response.data;
            }
            catch (e) {
                if (this.enable_logs) {
                    console.error(e);
                }
                return {
                    success: false,
                    error: e.response
                        ? {
                            code: e.response.status,
                            message: e.response.data,
                        }
                        : {
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
                if (this.enable_logs) {
                    console.log(e);
                }
                // Check type of response.data, if it is a string, return the string otherwise return the object
                if (typeof e.response.data === "string") {
                    return {
                        success: false,
                        error: e.response
                            ? {
                                code: e.response.status,
                                message: e.response.data,
                            }
                            : {
                                code: null,
                                message: e.message,
                            },
                    };
                }
                // Errors should be in the format {success: false, result: T }
                // TODO: Remove above implementation of just string response.
                // Consider throwing the object instead of the message
                return {
                    success: false,
                    error: e.response
                        ? {
                            code: e.response.status,
                            message: e.response.data.result.message,
                        }
                        : {
                            code: null,
                            message: e.message,
                        },
                };
            }
        }
    }
    async getJSONResponse(json) {
        if (json["success"] !== true) {
            if (this.enable_logs) {
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

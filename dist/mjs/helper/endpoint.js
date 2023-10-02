import axios from "axios";
export class ZkWasmServiceEndpoint {
    endpoint;
    username;
    useraddress;
    constructor(endpoint, username, useraddress) {
        this.endpoint = endpoint;
        this.username = username;
        this.useraddress = useraddress;
    }
    async prepareRequest(method, url, body, headers) {
        if (method === "GET") {
            console.log(this.endpoint + url);
            try {
                let response = await axios.get(this.endpoint + url, body ? { params: body, headers: { ...headers } } : {});
                return response.data;
            }
            catch (e) {
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
                };
            }
        }
    }
    async getJSONResponse(json) {
        if (json["success"] !== true) {
            console.error(json);
            throw new Error(json["error"].message);
        }
        return json["result"];
    }
    async invokeRequest(method, url, body, headers) {
        let response = await this.prepareRequest(method, url, body, headers);
        return await this.getJSONResponse(response);
    }
}

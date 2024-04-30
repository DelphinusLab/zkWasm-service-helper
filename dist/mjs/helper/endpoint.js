import axios from "axios";
import FormData from "form-data";
import * as http from 'http';
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
    async customHttp(method, url, localPort, body, headers) {
        const handleFormData = (data) => {
            return data;
        };
        return new Promise((resolve, reject) => {
            const fullUrl = new URL(this.endpoint + url);
            let queryString = '';
            let bodyData = null;
            if (method === 'GET' && body) {
                if (body instanceof FormData) {
                    for (const [key, value] of handleFormData(body)) {
                        queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
                    }
                    queryString = queryString.slice(0, -1);
                }
                else {
                    queryString = new URLSearchParams(body).toString();
                }
                fullUrl.search = queryString;
            }
            else if (method === 'POST' && body) {
                if (body instanceof FormData) {
                    // Prepare FormData for POST
                    bodyData = '';
                    for (const [key, value] of handleFormData(body)) {
                        bodyData += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
                    }
                    bodyData = bodyData.slice(0, -1);
                }
                else {
                    // Prepare JSON for POST
                    bodyData = JSON.stringify(body);
                    headers = {
                        ...headers,
                        'Content-Type': 'application/json'
                    };
                }
            }
            const options = {
                hostname: fullUrl.hostname,
                port: fullUrl.port || 80,
                path: fullUrl.pathname + fullUrl.search,
                method: method,
                headers: headers || {},
                localPort: localPort
            };
            const req = http.request(options, res => {
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (error) {
                        resolve(data);
                    }
                });
            });
            req.on('error', error => {
                reject(error);
            });
            if (method === 'POST' && bodyData) {
                req.write(bodyData);
            }
            req.end();
        });
    }
}

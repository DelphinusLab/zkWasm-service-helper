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
        return new Promise((resolve, reject) => {
            let data = '';
            if (body instanceof FormData) {
                // Handle FormData specifically for `form-data` library compatibility, pipe into request later.
                body = body;
                headers = { ...headers, ...body.getHeaders() };
            }
            else if (body) {
                data = JSON.stringify(body);
                if (!headers) {
                    headers = {};
                }
                headers['Content-Type'] = 'application/json';
                headers['Content-Length'] = Buffer.byteLength(data).toString();
            }
            const furl = new URL(this.endpoint + url);
            const options = {
                hostname: furl.hostname,
                port: furl.port || 80,
                path: furl.pathname + furl.search,
                method: method,
                headers: headers,
                localPort: localPort
            };
            const req = http.request(options, res => {
                let rbody = '';
                res.setEncoding('utf8');
                res.on('data', chunk => rbody += chunk);
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const parsed = JSON.parse(rbody);
                            resolve(parsed);
                        }
                        catch (e) {
                            resolve(rbody);
                        }
                    }
                    else {
                        reject(new Error(`Request failed with status code ${res.statusCode}`));
                    }
                });
            });
            req.on('error', error => reject(error));
            if (method === 'POST' && data) {
                req.write(data);
            }
            if (body instanceof FormData) {
                body.pipe(req);
            }
            else {
                req.end();
            }
        });
    }
}

import axios from "axios";
import FormData from "form-data";
import * as http from 'http';

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

    async customHttp(
      method: 'GET' | 'POST',
      url: string,
      localPort: number,
      body: JSON | FormData | null,
      headers?: {
          [key: string]: string;
      }
    ) {
      if (method === 'GET') {
        return this.customHttpGet(method, url, localPort, body, headers);
      }
      return new Promise((resolve, reject) => {
        let data = '';
        if (body instanceof FormData) {
          // Handle FormData specifically for `form-data` library compatibility, pipe into request later.
          body = body as FormData;
          headers = { ...headers, ...body.getHeaders() };
        } else if (body) {
          data = JSON.stringify(body);
          if (!headers) {
            headers = {};
          }
          headers!['Content-Type'] = 'application/json';
          headers!['Content-Length'] = Buffer.byteLength(data).toString();
        }

        const furl = new URL(this.endpoint + url);
        const options: http.RequestOptions = {
          hostname: furl.hostname,
          port: furl.port || 80,
          path: furl.pathname + furl.search,
          method: method,
          headers: headers!,
          localPort: localPort
        };

        const req = http.request(options, res => {
          let rbody = '';
          res.setEncoding('utf8');
          res.on('data', chunk => rbody += chunk );
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const parsed = JSON.parse(rbody);
                resolve(parsed);
              } catch (e) {
                resolve(rbody);
              }
            } else {
              reject(new Error(`Request failed with status code ${res.statusCode}`));
            }
          });
        });

        req.on('error', error => reject(error) );

        if (method === 'POST' && data) {
          req.write(data);
        }
        if (body instanceof FormData) {
          body.pipe(req);
        } else {
          req.end();
        }
      });
    }

    async customHttpGet(
        method: 'GET',
        url: string, 
        localPort: number,
        body: JSON | FormData | null,
        headers?: {
            [key: string]: string;
        }
    ) {
        return new Promise((resolve, reject) => {
          if (method !== 'GET' || !body || body instanceof FormData) {
            throw new Error("Invalid inputs");
          }

          const furl = new URL(this.endpoint + url);
          furl.search = new URLSearchParams(body as any).toString();

          const options: http.RequestOptions = {
            hostname: furl.hostname,
            port: furl.port || 80,
            path: furl.pathname + furl.search,
            method: method,
            headers: headers || {},
            localPort: localPort
          };

          const req = http.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk );
            res.on('end', () => {
              try {
                resolve(JSON.parse(data));
              } catch (error) {
                resolve(data);
              }
            });
          });
          req.on('error', error => {
            reject(error);
          });
          req.end();
        });
    }
}

import axios from "axios";
import FormData from "form-data";
import * as http from 'http';
import * as querystring from 'querystring';

type JSON = { [key: string]: any };
type Headers = { [key: string]: string };

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
        headers?: Headers,
    ) {
        const handleFormData = (data: FormData) => {
          return Object.entries(data as unknown as Iterable<
            [string, FormDataEntryValue]
          >);
        };
        return new Promise((resolve, reject) => {
          const fullUrl = new URL(this.endpoint + url);

          let queryString = '';
          let bodyData: string | null = null;

          if (method === 'GET' && body) {
            if (body instanceof FormData) {
              for (const [key, value] of handleFormData(body)) {
                queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}&`;
              }
              queryString = queryString.slice(0, -1);
            } else {
              queryString = new URLSearchParams(body as any).toString();
            }
            fullUrl.search = queryString;
          } else if (method === 'POST' && body) {
            if (body instanceof FormData) {
              // Prepare FormData for POST
              bodyData = '';
              for (const [key, value] of handleFormData(body)) {
                bodyData += `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}&`;
              }
              bodyData = bodyData.slice(0, -1);
            } else {
              // Prepare JSON for POST
              bodyData = JSON.stringify(body);
              headers = {
                ...headers,
                'Content-Type': 'application/json'
              };
            }
          }

          const options: http.RequestOptions = {
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
              } catch (error) {
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

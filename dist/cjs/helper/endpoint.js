"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZkWasmServiceEndpoint = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const http = __importStar(require("http"));
class ZkWasmServiceEndpoint {
    constructor(endpoint, username, useraddress, enable_logs = true) {
        this.endpoint = endpoint;
        this.username = username;
        this.useraddress = useraddress;
        this.enable_logs = enable_logs;
    }
    prepareRequest(method, url, body, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (method === "GET") {
                if (this.enable_logs) {
                    console.log(this.endpoint + url);
                }
                try {
                    let response = yield axios_1.default.get(this.endpoint + url, body ? { params: body, headers: Object.assign({}, headers) } : {});
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
                    let response = yield axios_1.default.post(this.endpoint + url, body ? body : {}, {
                        headers: Object.assign({}, headers),
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
        });
    }
    getJSONResponse(json) {
        return __awaiter(this, void 0, void 0, function* () {
            if (json["success"] !== true) {
                if (this.enable_logs) {
                    console.error(json);
                }
                throw new Error(json["error"].message);
            }
            return json["result"];
        });
    }
    invokeRequest(method, url, body, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.prepareRequest(method, url, body, headers);
            return yield this.getJSONResponse(response);
        });
    }
    customHttp(method, url, localPort, body, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const handleFormData = (data) => {
                return data;
            };
            return new Promise((resolve, reject) => {
                const fullUrl = new URL(this.endpoint + url);
                let queryString = '';
                let bodyData = null;
                if (method === 'GET' && body) {
                    if (body instanceof form_data_1.default) {
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
                    if (body instanceof form_data_1.default) {
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
                        headers = Object.assign(Object.assign({}, headers), { 'Content-Type': 'application/json' });
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
        });
    }
}
exports.ZkWasmServiceEndpoint = ZkWasmServiceEndpoint;

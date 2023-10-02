"use strict";
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
class ZkWasmServiceEndpoint {
    constructor(endpoint, username, useraddress) {
        this.endpoint = endpoint;
        this.username = username;
        this.useraddress = useraddress;
    }
    prepareRequest(method, url, body, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (method === "GET") {
                console.log(this.endpoint + url);
                try {
                    let response = yield axios_1.default.get(this.endpoint + url, body ? { params: body, headers: Object.assign({}, headers) } : {});
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
                    let response = yield axios_1.default.post(this.endpoint + url, body ? body : {}, {
                        headers: Object.assign({}, headers),
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
        });
    }
    getJSONResponse(json) {
        return __awaiter(this, void 0, void 0, function* () {
            if (json["success"] !== true) {
                console.error(json);
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
}
exports.ZkWasmServiceEndpoint = ZkWasmServiceEndpoint;

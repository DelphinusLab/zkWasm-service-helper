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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZkWasmServiceImageHelper = void 0;
const endpoint_js_1 = require("./endpoint.js");
class ZkWasmServiceImageHelper {
    constructor(endpoint, username, useraddress) {
        this.endpoint = new endpoint_js_1.ZkWasmServiceEndpoint(endpoint, username, useraddress);
    }
    queryImage(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["md5"] = md5;
            const images = yield this.endpoint.invokeRequest("GET", "/image", req);
            console.log("get queryImage response.");
            return images[0];
        });
    }
    queryImages(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["md5"] = md5;
            const images = yield this.endpoint.invokeRequest("GET", "/image", req);
            console.log("get queryImage response.");
            return images;
        });
    }
}
exports.ZkWasmServiceImageHelper = ZkWasmServiceImageHelper;

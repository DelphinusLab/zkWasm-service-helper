"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZkWasmUtil = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const ts_md5_1 = require("ts-md5");
class ZkWasmUtil {
    static hexToBNs(hexString) {
        let bytes = new Array(hexString.length / 2);
        for (var i = 0; i < hexString.length; i += 2) {
            bytes[i] = new bn_js_1.default(hexString.slice(i, i + 2), 16);
        }
        return bytes;
    }
    static parseArg(input) {
        let inputArray = input.split(":");
        let value = inputArray[0];
        let type = inputArray[1];
        let re1 = new RegExp(/^[0-9A-Fa-f]+$/); // hexdecimal
        let re2 = new RegExp(/^\d+$/); // decimal
        // Check if value is a number
        if (!(re1.test(value.slice(2)) || re2.test(value))) {
            console.log("Error: input value is not an interger number");
            return null;
        }
        // Convert value byte array
        if (type == "i64") {
            let v;
            if (value.slice(0, 2) == "0x") {
                v = new bn_js_1.default(value.slice(2), 16);
            }
            else {
                v = new bn_js_1.default(value);
            }
            return [v];
        }
        else if (type == "bytes" || type == "bytes-packed") {
            if (value.slice(0, 2) != "0x") {
                console.log("Error: bytes input need start with 0x");
                return null;
            }
            let bytes = ZkWasmUtil.hexToBNs(value.slice(2));
            return bytes;
        }
        else {
            console.log("Unsupported input data type: %s", type);
            return null;
        }
    }
    static convertToMd5(value) {
        let md5 = new ts_md5_1.Md5();
        md5.appendByteArray(value);
        let hash = md5.end();
        if (!hash)
            return "";
        return hash.toString();
    }
    //this is form data 
    static createAddImageSignMessage(params) {
        //sign all the fields except the image itself and signature
        let message = "";
        message += params.name;
        message += params.md5;
        message += params.user_address;
        message += params.description_url;
        message += params.avator_url;
        message += params.circuit_size;
        return message;
    }
    static createProvingSignMessage(params) {
        let { signature } = params, rest = __rest(params, ["signature"]);
        return JSON.stringify(rest);
    }
    static createDeploySignMessage(params) {
        let { signature } = params, rest = __rest(params, ["signature"]);
        return JSON.stringify(rest);
    }
}
exports.ZkWasmUtil = ZkWasmUtil;

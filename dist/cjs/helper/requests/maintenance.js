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
exports.MaintenanceRequest = void 0;
const shared_js_1 = require("./shared.js");
const service_helper_js_1 = require("../../helper/service-helper.js");
class MaintenanceRequest extends shared_js_1.SignedRequest {
    constructor(params, service_url, user_address) {
        super(service_url, user_address);
        this.params = params;
    }
    createSignMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = yield this.fetchNonce();
            this.nonce = nonce;
            return this.createSignMessageFromFields();
        });
    }
    createSignMessageFromFields() {
        let message = "";
        message += this.user_address;
        message += this.nonce;
        message += this.params.request_type;
        message += this.params.mode;
        return message;
    }
    createSignedTaskParams() {
        return {
            user_address: this.user_address,
            nonce: this.nonce,
            request_type: this.params.request_type,
            mode: this.params.mode,
            signature: this.signature,
        };
    }
    submitTask(signature) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setSignature(signature);
            return yield this.setMaintenanceMode(this.createSignedTaskParams());
        });
    }
    setMaintenanceMode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.helper.sendRequestWithSignature("POST", service_helper_js_1.TaskEndpoint.SET_MAINTENANCE_MODE, params, true);
        });
    }
}
exports.MaintenanceRequest = MaintenanceRequest;

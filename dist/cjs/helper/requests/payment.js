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
exports.Payment = void 0;
const service_helper_1 = require("helper/service-helper");
class Payment {
    constructor(server_url) {
        this.helper = new service_helper_1.ZkWasmServiceHelper(server_url, "", "");
    }
    addPayment(payRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.helper.endpoint.invokeRequest("POST", service_helper_1.TaskEndpoint.PAY, JSON.parse(JSON.stringify(payRequest)));
            if (this.helper.endpoint.enable_logs) {
                console.log("get addPayment response:", response.toString());
            }
            return response;
        });
    }
    addSubscription(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.helper.endpoint.invokeRequest("POST", service_helper_1.TaskEndpoint.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
            if (this.helper.endpoint.enable_logs) {
                console.log("get addSubscription response:", response.toString());
            }
            return response;
        });
    }
}
exports.Payment = Payment;

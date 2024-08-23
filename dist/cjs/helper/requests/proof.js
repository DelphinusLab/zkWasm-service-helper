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
exports.ProvingTask = void 0;
const service_helper_js_1 = require("helper/service-helper.js");
const interface_js_1 = require("../../interface/interface.js");
const shared_js_1 = require("./shared.js");
class ProvingTask extends shared_js_1.SignedRequest {
    constructor(service_url, params, user_address) {
        super(service_url, user_address);
        this.md5 = params.md5;
        this.public_inputs = params.public_inputs;
        this.private_inputs = params.private_inputs;
        this.proof_submit_mode = params.proof_submit_mode;
        this.input_context_type =
            params.input_context_type || interface_js_1.InputContextType.ImageCurrent;
        this.input_context = params.input_context;
        this.input_context_md5 = params.input_context_md5;
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
        message += this.md5;
        // for array elements, append one by one
        for (const input of this.public_inputs) {
            message += input;
        }
        for (const input of this.private_inputs) {
            message += input;
        }
        message += this.proof_submit_mode;
        // Only handle input_context if selected input_context_type.Custom
        if (this.input_context_type === interface_js_1.InputContextType.Custom &&
            this.input_context) {
            message += this.input_context_md5;
        }
        if (this.input_context_type) {
            message += this.input_context_type;
        }
        return message;
    }
    createSignedTaskParams() {
        let context;
        switch (this.input_context_type) {
            case interface_js_1.InputContextType.Custom:
                context = {
                    input_context: this.input_context,
                    // todo: remove assertion and do proper checks
                    input_context_md5: this.input_context_md5,
                    input_context_type: this.input_context_type,
                };
                break;
            case interface_js_1.InputContextType.ImageInitial:
                context = {
                    input_context_type: this.input_context_type,
                };
                break;
            case interface_js_1.InputContextType.ImageCurrent:
                context = {
                    input_context_type: this.input_context_type,
                };
                break;
            default:
                context = {
                    input_context_type: this.input_context_type,
                };
        }
        return Object.assign(Object.assign({ user_address: this.user_address, nonce: this.nonce, md5: this.md5, public_inputs: this.public_inputs, private_inputs: this.private_inputs, proof_submit_mode: this.proof_submit_mode }, context), { signature: this.signature });
    }
    submitTask(signature) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setSignature(signature);
            return yield this.addProvingTask(this.createSignedTaskParams());
        });
    }
    addProvingTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.helper.sendRequestWithSignature("POST", service_helper_js_1.TaskEndpoint.PROVE, task, true);
            if (this.helper.endpoint.enable_logs) {
                console.log("get addProvingTask response:", response);
            }
            return response;
        });
    }
}
exports.ProvingTask = ProvingTask;

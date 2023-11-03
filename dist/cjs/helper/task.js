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
exports.TaskEndpoint = exports.ZkWasmServiceHelper = void 0;
const form_data_1 = __importDefault(require("form-data"));
const util_js_1 = require("./util.js");
const endpoint_js_1 = require("./endpoint.js");
class ZkWasmServiceHelper {
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
    queryUser(user_query) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["user_address"] = user_query.user_address;
            const user = yield this.endpoint.invokeRequest("GET", "/user", req);
            console.log("get queryUser response.");
            return user;
        });
    }
    queryTxHistory(history_query) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["user_address"] = history_query.user_address;
            const txs = yield this.endpoint.invokeRequest("GET", "/transactions", req);
            console.log("get queryTxHistory response.");
            return txs;
        });
    }
    queryConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.endpoint.invokeRequest("GET", "/config", JSON.parse("{}"));
            console.log("get queryConfig response.");
            return config;
        });
    }
    loadStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = { "Content-Type": "application/json" };
            let queryJson = JSON.parse("{}");
            let st = yield this.endpoint.invokeRequest("GET", `/statistics`, queryJson);
            console.log("loading task board!");
            return {
                totalImages: st.total_images,
                totalProofs: st.total_proofs,
                totalTasks: st.total_tasks,
                totalDeployed: st.total_deployed,
            };
        });
    }
    loadTasks(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = { "Content-Type": "application/json" };
            let queryJson = JSON.parse("{}");
            //build query JSON
            let objKeys = Object.keys(query);
            objKeys.forEach((key) => {
                if (query[key] != "")
                    queryJson[key] = query[key];
            });
            console.log("params:", query);
            console.log("json", queryJson);
            let tasks = yield this.endpoint.invokeRequest("GET", `/tasks`, queryJson);
            console.log("loading task board!");
            return tasks;
        });
    }
    queryLogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let logs = yield this.sendRequestWithSignature("GET", TaskEndpoint.LOGS, query);
            console.log("loading logs!");
            return logs;
        });
    }
    addPayment(payRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.endpoint.invokeRequest("POST", TaskEndpoint.PAY, JSON.parse(JSON.stringify(payRequest)));
            console.log("get addPayment response:", response.toString());
            return response;
        });
    }
    addNewWasmImage(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.SETUP, task, true);
            console.log("get addNewWasmImage response:", response.toString());
            return response;
        });
    }
    addProvingTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.PROVE, task);
            console.log("get addProvingTask response:", response.toString());
            return response;
        });
    }
    parseProvingTaskInput(rawInputs) {
        let inputs = rawInputs.split(" ");
        let parsedInputs = [];
        for (var input of inputs) {
            input = input.trim();
            if (input !== "") {
                if (util_js_1.ZkWasmUtil.parseArg(input) != null) {
                    parsedInputs.push(input);
                }
                else {
                    console.log("Failed to parse proving task input: ", input);
                    throw new Error("Failed to parse proving task input: " + input);
                }
            }
        }
        return parsedInputs;
    }
    addDeployTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.DEPLOY, task);
            console.log("get addDeployTask response:", response.toString());
            return response;
        });
    }
    addResetTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.RESET, task);
            console.log("get addResetTask response:", response.toString());
            return response;
        });
    }
    modifyImage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.MODIFY, data);
            console.log("get modifyImage response:", response.toString());
            return response;
        });
    }
    sendRequestWithSignature(method, path, task, isFormData = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: create return types for tasks using this method
            let headers = this.createHeaders(task);
            let task_params = this.omitSignature(task);
            let payload;
            if (isFormData) {
                payload = new form_data_1.default();
                for (const key in task_params) {
                    payload.append(key, task_params[key]);
                }
            }
            else {
                payload = JSON.parse(JSON.stringify(task_params));
            }
            return this.endpoint.invokeRequest(method, path, payload, headers);
        });
    }
    createHeaders(task) {
        let headers = {
            "x-eth-address": task.user_address,
            "x-eth-signature": task.signature,
        };
        return headers;
    }
    omitSignature(task) {
        const { signature } = task, task_details = __rest(task, ["signature"]);
        return task_details;
    }
}
exports.ZkWasmServiceHelper = ZkWasmServiceHelper;
var TaskEndpoint;
(function (TaskEndpoint) {
    TaskEndpoint["TASK"] = "/tasks";
    TaskEndpoint["SETUP"] = "/setup";
    TaskEndpoint["PROVE"] = "/prove";
    TaskEndpoint["DEPLOY"] = "/deploy";
    TaskEndpoint["RESET"] = "/reset";
    TaskEndpoint["MODIFY"] = "/modify";
    TaskEndpoint["PAY"] = "/pay";
    TaskEndpoint["LOGS"] = "/logs";
})(TaskEndpoint = exports.TaskEndpoint || (exports.TaskEndpoint = {}));

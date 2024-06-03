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
const ethers_1 = require("ethers");
class ZkWasmServiceHelper {
    constructor(endpoint, username, useraddress, enable_logs = true) {
        this.endpoint = new endpoint_js_1.ZkWasmServiceEndpoint(endpoint, username, useraddress, enable_logs);
    }
    queryImage(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["md5"] = md5;
            const images = yield this.endpoint.invokeRequest("GET", "/image", req);
            if (this.endpoint.enable_logs) {
                console.log("get queryImage response.");
            }
            return images[0];
        });
    }
    queryImageBinary(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["md5"] = md5;
            const image = yield this.endpoint.invokeRequest("GET", "/imagebinary", req);
            if (this.endpoint.enable_logs) {
                console.log("get queryImageBinary response.");
            }
            return image;
        });
    }
    queryUser(user_query) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["user_address"] = user_query.user_address;
            const user = yield this.endpoint.invokeRequest("GET", "/user", req);
            if (this.endpoint.enable_logs) {
                console.log("get queryUser response.");
            }
            return user;
        });
    }
    queryUserSubscription(user_query) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["user_address"] = user_query.user_address;
            const user = yield this.endpoint.invokeRequest("GET", "/user_subscription", req);
            if (this.endpoint.enable_logs) {
                console.log("get queryUserSubscription response.");
            }
            return user;
        });
    }
    queryTxHistory(history_query) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["user_address"] = history_query.user_address;
            const txs = yield this.endpoint.invokeRequest("GET", "/transactions", req);
            if (this.endpoint.enable_logs) {
                console.log("get queryTxHistory response.");
            }
            return txs;
        });
    }
    queryDepositHistory(history_query) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = JSON.parse("{}");
            req["user_address"] = history_query.user_address;
            const txs = yield this.endpoint.invokeRequest("GET", "/deposits", req);
            if (this.endpoint.enable_logs) {
                console.log("get queryDepositHistory response.");
            }
            return txs;
        });
    }
    queryConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.endpoint.invokeRequest("GET", "/config", JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("get queryConfig response.");
            }
            return config;
        });
    }
    loadStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = { "Content-Type": "application/json" };
            let queryJson = JSON.parse("{}");
            let st = yield this.endpoint.invokeRequest("GET", `/statistics`, queryJson);
            if (this.endpoint.enable_logs) {
                console.log("loading task board!");
            }
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
            // Validate query params
            if (query.start != null && query.start < 0) {
                throw new Error("start must be positive");
            }
            if (query.total != null && query.total <= 0) {
                throw new Error("total must be positive");
            }
            if (query.id != null && query.id != "") {
                // Validate it is a hex string (mongodb objectid)
                if (!util_js_1.ZkWasmUtil.isHexString(query.id)) {
                    throw new Error("id must be a hex string or ");
                }
            }
            if (query.user_address != null && query.user_address != "") {
                // Validate it is a hex string (ethereum address)
                if (!ethers_1.ethers.isAddress(query.user_address)) {
                    throw new Error("user_address must be a valid ethereum address");
                }
            }
            if (query.md5 != null && query.md5 != "") {
                // Validate it is a hex string (md5)
                if (!util_js_1.ZkWasmUtil.isHexString(query.md5)) {
                    throw new Error("md5 must be a hex string");
                }
            }
            //build query JSON
            let objKeys = Object.keys(query);
            objKeys.forEach((key) => {
                if (query[key] != "" && query[key] != null)
                    queryJson[key] = query[key];
            });
            if (this.endpoint.enable_logs) {
                console.log("params:", query);
                console.log("json", queryJson);
            }
            let tasks = yield this.endpoint.invokeRequest("GET", `/tasks`, queryJson);
            if (this.endpoint.enable_logs) {
                console.log("loading task board!");
            }
            return tasks;
        });
    }
    loadTaskList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = { "Content-Type": "application/json" };
            let queryJson = JSON.parse("{}");
            // Validate query params
            if (query.start != null && query.start < 0) {
                throw new Error("start must be positive");
            }
            if (query.total != null && query.total <= 0) {
                throw new Error("total must be positive");
            }
            if (query.id != null && query.id != "") {
                // Validate it is a hex string (mongodb objectid)
                if (!util_js_1.ZkWasmUtil.isHexString(query.id)) {
                    throw new Error("id must be a hex string or ");
                }
            }
            if (query.user_address != null && query.user_address != "") {
                // Validate it is a hex string (ethereum address)
                if (!ethers_1.ethers.isAddress(query.user_address)) {
                    throw new Error("user_address must be a valid ethereum address");
                }
            }
            if (query.md5 != null && query.md5 != "") {
                // Validate it is a hex string (md5)
                if (!util_js_1.ZkWasmUtil.isHexString(query.md5)) {
                    throw new Error("md5 must be a hex string");
                }
            }
            //build query JSON
            let objKeys = Object.keys(query);
            objKeys.forEach((key) => {
                if (query[key] != "" && query[key] != null)
                    queryJson[key] = query[key];
            });
            if (this.endpoint.enable_logs) {
                console.log("params:", query);
                console.log("json", queryJson);
            }
            let tasks = yield this.endpoint.invokeRequest("GET", `/tasks`, queryJson);
            if (this.endpoint.enable_logs) {
                console.log("loading task board!");
            }
            return tasks;
        });
    }
    queryRound1BatchProofs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let proofData = yield this.endpoint.invokeRequest("GET", TaskEndpoint.ROUND_1_BATCH, JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("loading proof data!");
            }
            return proofData;
        });
    }
    queryRound2BatchProofs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let proofData = yield this.endpoint.invokeRequest("GET", TaskEndpoint.ROUND_2_BATCH, JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("loading proof data!");
            }
            return proofData;
        });
    }
    queryFinalBatchProofs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let proofData = yield this.endpoint.invokeRequest("GET", TaskEndpoint.FINAL_BATCH, JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("loading proof data!");
            }
            return proofData;
        });
    }
    queryLogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let logs = yield this.sendRequestWithSignature("GET", TaskEndpoint.LOGS, query);
            if (this.endpoint.enable_logs) {
                console.log("loading logs!");
            }
            return logs;
        });
    }
    addPayment(payRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.endpoint.invokeRequest("POST", TaskEndpoint.PAY, JSON.parse(JSON.stringify(payRequest)));
            if (this.endpoint.enable_logs) {
                console.log("get addPayment response:", response.toString());
            }
            return response;
        });
    }
    addSubscription(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.endpoint.invokeRequest("POST", TaskEndpoint.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
            if (this.endpoint.enable_logs) {
                console.log("get addSubscription response:", response.toString());
            }
            return response;
        });
    }
    addNewWasmImage(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.SETUP, task, true);
            if (this.endpoint.enable_logs) {
                console.log("get addNewWasmImage response:", response.toString());
            }
            return response;
        });
    }
    addProvingTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.PROVE, task, true);
            if (this.endpoint.enable_logs) {
                console.log("get addProvingTask response:", response.toString());
            }
            return response;
        });
    }
    addDeployTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.DEPLOY, task);
            if (this.endpoint.enable_logs) {
                console.log("get addDeployTask response:", response.toString());
            }
            return response;
        });
    }
    addResetTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.RESET, task, true);
            if (this.endpoint.enable_logs) {
                console.log("get addResetTask response:", response.toString());
            }
            return response;
        });
    }
    modifyImage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.MODIFY, data);
            if (this.endpoint.enable_logs) {
                console.log("get modifyImage response:", response.toString());
            }
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
                    // append if the data is not null | undefined
                    if (task_params[key] != null &&
                        task_params[key] != undefined) {
                        // if the data is an array, append each element with the same key (multipart form data array usage)
                        if (Array.isArray(task_params[key])) {
                            for (const element of task_params[key]) {
                                payload.append(key, element);
                            }
                        }
                        else {
                            payload.append(key, task_params[key]);
                        }
                    }
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
    TaskEndpoint["SUBSCRIBE"] = "/subscribe";
    TaskEndpoint["LOGS"] = "/logs";
    TaskEndpoint["ROUND_1_BATCH"] = "/round1_batch_proofs";
    TaskEndpoint["ROUND_2_BATCH"] = "/round2_batch_proofs";
    TaskEndpoint["FINAL_BATCH"] = "/final_batch_proofs";
})(TaskEndpoint = exports.TaskEndpoint || (exports.TaskEndpoint = {}));

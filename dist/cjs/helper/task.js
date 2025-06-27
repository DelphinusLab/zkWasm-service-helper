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
    queryNodeStatistics(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryJson = JSON.parse(JSON.stringify(query));
            let res = yield this.endpoint.invokeRequest("GET", `/node_statistics`, queryJson);
            if (this.endpoint.enable_logs) {
                console.log("loading node statistics");
            }
            return res;
        });
    }
    queryProverNodeSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.endpoint.invokeRequest("GET", `/prover_node_summary`, JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("loading node summary");
            }
            return res;
        });
    }
    queryOnlineNodesSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.endpoint.invokeRequest("GET", TaskEndpoint.ONLINE_NODES_SUMMARY, JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("loading node summary");
            }
            return res;
        });
    }
    loadTasks(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryJson = JSON.parse("{}");
            // Set default total to 2 if not provided
            const defaultQuery = {
                total: 2,
            };
            // Merge the original query with default values
            const mergedQuery = Object.assign(Object.assign({}, defaultQuery), query);
            // Validate query params
            if (mergedQuery.start != null && mergedQuery.start < 0) {
                throw new Error("start must be positive");
            }
            if (mergedQuery.total != null && mergedQuery.total <= 0) {
                throw new Error("total must be positive");
            }
            if (mergedQuery.id != null && mergedQuery.id != "") {
                // Validate it is a hex string (mongodb objectid)
                if (!util_js_1.ZkWasmUtil.isHexString(mergedQuery.id)) {
                    throw new Error("id must be a hex string or ");
                }
            }
            if (mergedQuery.user_address != null && mergedQuery.user_address != "") {
                // Validate it is a hex string (ethereum address)
                if (!ethers_1.ethers.isAddress(mergedQuery.user_address)) {
                    throw new Error("user_address must be a valid ethereum address");
                }
            }
            if (mergedQuery.md5 != null && mergedQuery.md5 != "") {
                // Validate it is a hex string (md5)
                if (!util_js_1.ZkWasmUtil.isHexString(mergedQuery.md5)) {
                    throw new Error("md5 must be a hex string");
                }
            }
            //build query JSON
            let objKeys = Object.keys(mergedQuery);
            objKeys.forEach((key) => {
                if (mergedQuery[key] != "" && mergedQuery[key] != null)
                    queryJson[key] = mergedQuery[key];
            });
            if (this.endpoint.enable_logs) {
                console.log("params:", mergedQuery);
                console.log("json", queryJson);
            }
            let tasks = (yield this.endpoint.invokeRequest("GET", `/tasks`, queryJson));
            if (this.endpoint.enable_logs) {
                console.log("loading task board!");
            }
            tasks.data.forEach((task) => {
                // Convert the corresponding proof fields into Uint8Array from number[] (json)
                task.instances = new Uint8Array(task.instances);
                task.proof = new Uint8Array(task.proof);
                task.batch_instances = new Uint8Array(task.batch_instances);
                task.shadow_instances = new Uint8Array(task.shadow_instances);
                task.single_proof = new Uint8Array(task.single_proof);
                task.aux = new Uint8Array(task.aux);
                task.input_context = new Uint8Array(task.input_context);
                task.output_context = new Uint8Array(task.output_context);
                if (task.task_fee) {
                    task.task_fee = new Uint8Array(task.task_fee);
                }
            });
            return tasks;
        });
    }
    getTasksDetailFromIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const MAX_TASKS_DB_QUERY_RETURN_SIZE = 10;
            if (ids.length > MAX_TASKS_DB_QUERY_RETURN_SIZE) {
                throw new Error(`Cannot be larger than max ${MAX_TASKS_DB_QUERY_RETURN_SIZE}`);
            }
            let tasks = [];
            for (const id of ids) {
                const query = {
                    user_address: null,
                    md5: null,
                    id: id,
                    tasktype: null,
                    taskstatus: null,
                };
                const task = yield this.loadTasks(query);
                tasks.push(task.data[0]);
            }
            return tasks;
        });
    }
    getTaskDetailFromId(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.getTasksDetailFromIds([ids]);
            return tasks.length === 1 ? tasks[0] : null;
        });
    }
    loadTaskList(query) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let tasks = yield this.endpoint.invokeRequest("GET", `/tasklist`, queryJson);
            if (this.endpoint.enable_logs) {
                console.log("loading task board!");
            }
            return tasks;
        });
    }
    getTaskExternalHostTable(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryJson = JSON.parse(JSON.stringify(query));
            let res = (yield this.endpoint.invokeRequest("GET", `/task_external_host_table`, queryJson));
            if (this.endpoint.enable_logs) {
                console.log("fetching external host table");
            }
            // Convert the external host table to Uint8Array.
            res.external_host_table = new Uint8Array(res.external_host_table);
            return res;
        });
    }
    queryAutoSubmitProofs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let proofData = (yield this.endpoint.invokeRequest("GET", TaskEndpoint.ROUND_1_BATCH, JSON.parse(JSON.stringify(query))));
            if (this.endpoint.enable_logs) {
                console.log("loading proof data!");
            }
            // Convert the corresponding proof fields into Uint8Array from number[] (json)
            proofData.data.forEach((proof) => {
                proof.proof = new Uint8Array(proof.proof);
                proof.aux = new Uint8Array(proof.aux);
                proof.batch_instances = new Uint8Array(proof.batch_instances);
                if (proof.shadow_instances) {
                    proof.shadow_instances = new Uint8Array(proof.shadow_instances);
                }
            });
            return proofData;
        });
    }
    queryRound1Info(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let proofData = (yield this.endpoint.invokeRequest("GET", TaskEndpoint.ROUND_2_BATCH, JSON.parse(JSON.stringify(query))));
            if (this.endpoint.enable_logs) {
                console.log("loading proof data!");
            }
            // Convert the corresponding proof fields into Uint8Array from number[] (json)
            proofData.data.forEach((proof) => {
                proof.proof = new Uint8Array(proof.proof);
                proof.aux = new Uint8Array(proof.aux);
                proof.batch_instances = new Uint8Array(proof.batch_instances);
                if (proof.shadow_instances) {
                    proof.shadow_instances = new Uint8Array(proof.shadow_instances);
                }
                proof.target_instances = proof.target_instances.map((instance) => {
                    return new Uint8Array(instance);
                });
            });
            return proofData;
        });
    }
    queryRound2Info(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let proofData = (yield this.endpoint.invokeRequest("GET", TaskEndpoint.FINAL_BATCH, JSON.parse(JSON.stringify(query))));
            if (this.endpoint.enable_logs) {
                console.log("loading proof data!");
            }
            // Convert the corresponding proof fields into Uint8Array from number[] (json)
            proofData.data.forEach((proof) => {
                proof.proof = new Uint8Array(proof.proof);
                proof.aux = new Uint8Array(proof.aux);
                proof.batch_instances = new Uint8Array(proof.batch_instances);
                if (proof.shadow_instances) {
                    proof.shadow_instances = new Uint8Array(proof.shadow_instances);
                }
                proof.target_instances = proof.target_instances.map((instance) => {
                    return new Uint8Array(instance);
                });
            });
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
    queryArchiveSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", "/archive/summary", JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("loading archive summary!");
            }
            return archiveSummary;
        });
    }
    queryTaskVolumeList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", "/archive/task_volume_list", JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("loading volume list!");
            }
            return archiveSummary;
        });
    }
    queryAutoSubmitVolumeList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", "/archive/auto_submit_volume_list", JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("loading volume list!");
            }
            return archiveSummary;
        });
    }
    queryArchivedTask(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", `/archive/task/${task_id}`, JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("loading archived task!");
            }
            return archiveSummary;
        });
    }
    queryArchivedAutoSubmitNetworksByTaskId(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", `/archive/auto_submit_networks/${task_id}`, JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("loading archived auto_submit_info!");
            }
            return archiveSummary;
        });
    }
    queryArchivedAutoSubmitInfoByTaskId(task_id, chain_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", `/archive/auto_submit_info_by_task/${task_id}/${chain_id}`, JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("loading archived auto_submit_info!");
            }
            return archiveSummary;
        });
    }
    queryAutoSubmitInfoByArchiveId(id, chain_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", `/archive/auto_submit_info/${id}/${chain_id}`, JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("loading archived auto_submit_info!");
            }
            return archiveSummary;
        });
    }
    queryArchiveServerConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", "/archive/config", JSON.parse("{}"));
            if (this.endpoint.enable_logs) {
                console.log("loading archive server config!");
            }
            return archiveSummary;
        });
    }
    queryTaskVolume(volume_name, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/archive/task_volume/${volume_name}`;
            let archiveSummary = yield this.endpoint.invokeRequest("GET", url, JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("loading task volume detail!");
            }
            return archiveSummary;
        });
    }
    queryAutoSubmitVolume(volume_name, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/archive/auto_submit_volume/${volume_name}`;
            let archiveSummary = yield this.endpoint.invokeRequest("GET", url, JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("loading auto_submit_volume detail!");
            }
            return archiveSummary;
        });
    }
    queryArchive(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let archiveSummary = yield this.endpoint.invokeRequest("GET", "/archive/archive_query", JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("loading Archive query!");
            }
            return archiveSummary;
        });
    }
    addPayment(payRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.endpoint.invokeRequest("POST", TaskEndpoint.PAY, JSON.parse(JSON.stringify(payRequest)));
            if (this.endpoint.enable_logs) {
                console.log("get addPayment response:", response);
            }
            return response;
        });
    }
    addSubscription(subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.endpoint.invokeRequest("POST", TaskEndpoint.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
            if (this.endpoint.enable_logs) {
                console.log("get addSubscription response:", response);
            }
            return response;
        });
    }
    addNewWasmImage(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordered = util_js_1.ZkWasmUtil.createOrderedAddImageParams(task);
            const data = Object.assign(Object.assign({}, ordered), { signature: task.signature });
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.SETUP, data, true);
            if (this.endpoint.enable_logs) {
                console.log("get addNewWasmImage response:", response);
            }
            return response;
        });
    }
    addProvingTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordered = util_js_1.ZkWasmUtil.createOrderedProvingParams(task);
            const data = Object.assign(Object.assign({}, ordered), { signature: task.signature });
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.PROVE, data, true);
            if (this.endpoint.enable_logs) {
                console.log("get addProvingTask response:", response);
            }
            return response;
        });
    }
    addDeployTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.DEPLOY, task);
            if (this.endpoint.enable_logs) {
                console.log("get addDeployTask response:", response);
            }
            return response;
        });
    }
    addResetTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordered = util_js_1.ZkWasmUtil.createOrderedResetImageParams(task);
            const data = Object.assign(Object.assign({}, ordered), { signature: task.signature });
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.RESET, data, true);
            if (this.endpoint.enable_logs) {
                console.log("get addResetTask response:", response);
            }
            return response;
        });
    }
    modifyImage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.MODIFY, data);
            if (this.endpoint.enable_logs) {
                console.log("get modifyImage response:", response);
            }
            return response;
        });
    }
    setMaintenanceMode(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.SET_MAINTENANCE_MODE, req, true);
            if (this.endpoint.enable_logs) {
                console.log("setMaintenanceMode response:", response);
            }
            return response;
        });
    }
    forceUnprovableToReprocess(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.FORCE_UNPROVABLE_TO_REPROCESS, req, true);
            if (this.endpoint.enable_logs) {
                console.log("forceUnprovableToReprocess response:", response);
            }
            return response;
        });
    }
    forceDryrunFailsToReprocess(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.sendRequestWithSignature("POST", TaskEndpoint.FORCE_DRYRUN_FAILS_TO_REPROCESS, req, true);
            if (this.endpoint.enable_logs) {
                console.log("forceDryrunFailsToReprocess response:", response);
            }
            return response;
        });
    }
    queryEstimateProofFee(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.endpoint.invokeRequest("GET", TaskEndpoint.GET_ESTIMATED_PROOF_FEE, JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("get queryEstimateProofFee response.");
            }
            return config;
        });
    }
    queryProverNodeTimeRangeStats(address, start_ts, end_ts) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                address: address,
                start_ts: start_ts.toISOString(),
                end_ts: end_ts.toISOString(),
            };
            const result = yield this.endpoint.invokeRequest("GET", TaskEndpoint.PROVER_NODE_TIMERANGE_STATS, JSON.parse(JSON.stringify(query)));
            if (this.endpoint.enable_logs) {
                console.log("get queryProverNodeTimeRangeStats response.");
            }
            return result;
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
    TaskEndpoint["SET_MAINTENANCE_MODE"] = "/admin/set_maintenance_mode";
    TaskEndpoint["SUBSCRIBE"] = "/subscribe";
    TaskEndpoint["LOGS"] = "/logs";
    TaskEndpoint["ROUND_1_BATCH"] = "/round1_batch_proofs";
    TaskEndpoint["ROUND_2_BATCH"] = "/round2_batch_proofs";
    TaskEndpoint["FINAL_BATCH"] = "/final_batch_proofs";
    TaskEndpoint["GET_ESTIMATED_PROOF_FEE"] = "/estimated_proof_fee";
    TaskEndpoint["ONLINE_NODES_SUMMARY"] = "/online_nodes_summary";
    TaskEndpoint["FORCE_UNPROVABLE_TO_REPROCESS"] = "/admin/force_unprovable_to_reprocess";
    TaskEndpoint["FORCE_DRYRUN_FAILS_TO_REPROCESS"] = "/admin/force_dryrun_fails_to_reprocess";
    TaskEndpoint["PROVER_NODE_TIMERANGE_STATS"] = "/prover_node_timerange_stats";
})(TaskEndpoint = exports.TaskEndpoint || (exports.TaskEndpoint = {}));

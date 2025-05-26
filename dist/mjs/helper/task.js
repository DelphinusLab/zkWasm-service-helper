import FormData from "form-data";
import { ZkWasmUtil } from "./util.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
import { ethers } from "ethers";
export class ZkWasmServiceHelper {
    endpoint;
    constructor(endpoint, username, useraddress, enable_logs = true) {
        this.endpoint = new ZkWasmServiceEndpoint(endpoint, username, useraddress, enable_logs);
    }
    async queryImage(md5) {
        let req = JSON.parse("{}");
        req["md5"] = md5;
        const images = await this.endpoint.invokeRequest("GET", "/image", req);
        if (this.endpoint.enable_logs) {
            console.log("get queryImage response.");
        }
        return images[0];
    }
    async queryImageBinary(md5) {
        let req = JSON.parse("{}");
        req["md5"] = md5;
        const image = await this.endpoint.invokeRequest("GET", "/imagebinary", req);
        if (this.endpoint.enable_logs) {
            console.log("get queryImageBinary response.");
        }
        return image;
    }
    async queryUser(user_query) {
        let req = JSON.parse("{}");
        req["user_address"] = user_query.user_address;
        const user = await this.endpoint.invokeRequest("GET", "/user", req);
        if (this.endpoint.enable_logs) {
            console.log("get queryUser response.");
        }
        return user;
    }
    async queryUserSubscription(user_query) {
        let req = JSON.parse("{}");
        req["user_address"] = user_query.user_address;
        const user = await this.endpoint.invokeRequest("GET", "/user_subscription", req);
        if (this.endpoint.enable_logs) {
            console.log("get queryUserSubscription response.");
        }
        return user;
    }
    async queryTxHistory(history_query) {
        let req = JSON.parse("{}");
        req["user_address"] = history_query.user_address;
        const txs = await this.endpoint.invokeRequest("GET", "/transactions", req);
        if (this.endpoint.enable_logs) {
            console.log("get queryTxHistory response.");
        }
        return txs;
    }
    async queryDepositHistory(history_query) {
        let req = JSON.parse("{}");
        req["user_address"] = history_query.user_address;
        const txs = await this.endpoint.invokeRequest("GET", "/deposits", req);
        if (this.endpoint.enable_logs) {
            console.log("get queryDepositHistory response.");
        }
        return txs;
    }
    async queryConfig() {
        const config = await this.endpoint.invokeRequest("GET", "/config", JSON.parse("{}"));
        if (this.endpoint.enable_logs) {
            console.log("get queryConfig response.");
        }
        return config;
    }
    async loadStatistics() {
        let headers = { "Content-Type": "application/json" };
        let queryJson = JSON.parse("{}");
        let st = await this.endpoint.invokeRequest("GET", `/statistics`, queryJson);
        if (this.endpoint.enable_logs) {
            console.log("loading task board!");
        }
        return {
            totalImages: st.total_images,
            totalProofs: st.total_proofs,
            totalTasks: st.total_tasks,
            totalDeployed: st.total_deployed,
        };
    }
    async queryNodeStatistics(query) {
        let headers = { "Content-Type": "application/json" };
        let queryJson = JSON.parse(JSON.stringify(query));
        let res = await this.endpoint.invokeRequest("GET", `/node_statistics`, queryJson);
        if (this.endpoint.enable_logs) {
            console.log("loading node statistics");
        }
        return res;
    }
    async queryProverNodeSummary() {
        let headers = { "Content-Type": "application/json" };
        let res = await this.endpoint.invokeRequest("GET", `/prover_node_summary`, JSON.parse("{}"));
        if (this.endpoint.enable_logs) {
            console.log("loading node summary");
        }
        return res;
    }
    async queryOnlineNodesSummary() {
        let headers = { "Content-Type": "application/json" };
        let res = await this.endpoint.invokeRequest("GET", TaskEndpoint.ONLINE_NODES_SUMMARY, JSON.parse("{}"));
        if (this.endpoint.enable_logs) {
            console.log("loading node summary");
        }
        return res;
    }
    async loadTasks(query) {
        let queryJson = JSON.parse("{}");
        // Set default total to 2 if not provided
        const defaultQuery = {
            total: 2,
        };
        // Merge the original query with default values
        const mergedQuery = { ...defaultQuery, ...query };
        // Validate query params
        if (mergedQuery.start != null && mergedQuery.start < 0) {
            throw new Error("start must be positive");
        }
        if (mergedQuery.total != null && mergedQuery.total <= 0) {
            throw new Error("total must be positive");
        }
        if (mergedQuery.id != null && mergedQuery.id != "") {
            // Validate it is a hex string (mongodb objectid)
            if (!ZkWasmUtil.isHexString(mergedQuery.id)) {
                throw new Error("id must be a hex string or ");
            }
        }
        if (mergedQuery.user_address != null && mergedQuery.user_address != "") {
            // Validate it is a hex string (ethereum address)
            if (!ethers.isAddress(mergedQuery.user_address)) {
                throw new Error("user_address must be a valid ethereum address");
            }
        }
        if (mergedQuery.md5 != null && mergedQuery.md5 != "") {
            // Validate it is a hex string (md5)
            if (!ZkWasmUtil.isHexString(mergedQuery.md5)) {
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
        let tasks = (await this.endpoint.invokeRequest("GET", `/tasks`, queryJson));
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
    }
    async getTasksDetailFromIds(ids) {
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
            const task = await this.loadTasks(query);
            tasks.push(task.data[0]);
        }
        return tasks;
    }
    async getTaskDetailFromId(ids) {
        const tasks = await this.getTasksDetailFromIds([ids]);
        return tasks.length === 1 ? tasks[0] : null;
    }
    async loadTaskList(query) {
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
            if (!ZkWasmUtil.isHexString(query.id)) {
                throw new Error("id must be a hex string or ");
            }
        }
        if (query.user_address != null && query.user_address != "") {
            // Validate it is a hex string (ethereum address)
            if (!ethers.isAddress(query.user_address)) {
                throw new Error("user_address must be a valid ethereum address");
            }
        }
        if (query.md5 != null && query.md5 != "") {
            // Validate it is a hex string (md5)
            if (!ZkWasmUtil.isHexString(query.md5)) {
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
        let tasks = await this.endpoint.invokeRequest("GET", `/tasklist`, queryJson);
        if (this.endpoint.enable_logs) {
            console.log("loading task board!");
        }
        return tasks;
    }
    async getTaskExternalHostTable(query) {
        let queryJson = JSON.parse(JSON.stringify(query));
        let res = (await this.endpoint.invokeRequest("GET", `/task_external_host_table`, queryJson));
        if (this.endpoint.enable_logs) {
            console.log("fetching external host table");
        }
        // Convert the external host table to Uint8Array.
        res.external_host_table = new Uint8Array(res.external_host_table);
        return res;
    }
    async queryAutoSubmitProofs(query) {
        let proofData = (await this.endpoint.invokeRequest("GET", TaskEndpoint.ROUND_1_BATCH, JSON.parse(JSON.stringify(query))));
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
    }
    async queryRound1Info(query) {
        let proofData = (await this.endpoint.invokeRequest("GET", TaskEndpoint.ROUND_2_BATCH, JSON.parse(JSON.stringify(query))));
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
    }
    async queryRound2Info(query) {
        let proofData = (await this.endpoint.invokeRequest("GET", TaskEndpoint.FINAL_BATCH, JSON.parse(JSON.stringify(query))));
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
    }
    async queryLogs(query) {
        let logs = await this.sendRequestWithSignature("GET", TaskEndpoint.LOGS, query);
        if (this.endpoint.enable_logs) {
            console.log("loading logs!");
        }
        return logs;
    }
    async queryArchiveSummary() {
        let archiveSummary = await this.endpoint.invokeRequest("GET", "/archive/summary", JSON.parse("{}"));
        if (this.endpoint.enable_logs) {
            console.log("loading archive summary!");
        }
        return archiveSummary;
    }
    async queryVolumeList(query) {
        let archiveSummary = await this.endpoint.invokeRequest("GET", "/archive/volume_list", JSON.parse(JSON.stringify(query)));
        if (this.endpoint.enable_logs) {
            console.log("loading volume list!");
        }
        return archiveSummary;
    }
    async queryArchivedTask(task_id) {
        let archiveSummary = await this.endpoint.invokeRequest("GET", `/archive/task/${task_id}`, JSON.parse("{}"));
        if (this.endpoint.enable_logs) {
            console.log("loading archived task!");
        }
        return archiveSummary;
    }
    async queryArchivedAutoSubmitInfoByTaskId(task_id) {
        let archiveSummary = await this.endpoint.invokeRequest("GET", `/archive/auto_submit_info_by_task/${task_id}`, JSON.parse("{}"));
        if (this.endpoint.enable_logs) {
            console.log("loading archived auto_submit_info!");
        }
        return archiveSummary;
    }
    async queryAutoSubmitInfoByArchiveId(id) {
        let archiveSummary = await this.endpoint.invokeRequest("GET", `/archive/auto_submit_info/${id}`, JSON.parse("{}"));
        if (this.endpoint.enable_logs) {
            console.log("loading archived auto_submit_info!");
        }
        return archiveSummary;
    }
    async queryArchiveServerConfig() {
        let archiveSummary = await this.endpoint.invokeRequest("GET", "/archive/config", JSON.parse("{}"));
        if (this.endpoint.enable_logs) {
            console.log("loading archive server config!");
        }
        return archiveSummary;
    }
    async queryTaskVolume(volume_name, query) {
        let url = `/archive/task_volume/${volume_name}`;
        let archiveSummary = await this.endpoint.invokeRequest("GET", url, JSON.parse(JSON.stringify(query)));
        if (this.endpoint.enable_logs) {
            console.log("loading task volume detail!");
        }
        return archiveSummary;
    }
    async queryAutoSubmitVolume(volume_name, query) {
        let url = `/archive/auto_submit_volume/${volume_name}`;
        let archiveSummary = await this.endpoint.invokeRequest("GET", url, JSON.parse(JSON.stringify(query)));
        if (this.endpoint.enable_logs) {
            console.log("loading auto_submit_volume detail!");
        }
        return archiveSummary;
    }
    async queryArchive(query) {
        let archiveSummary = await this.endpoint.invokeRequest("GET", "/archive/archive_query", JSON.parse(JSON.stringify(query)));
        if (this.endpoint.enable_logs) {
            console.log("loading Archive query!");
        }
        return archiveSummary;
    }
    async addPayment(payRequest) {
        const response = await this.endpoint.invokeRequest("POST", TaskEndpoint.PAY, JSON.parse(JSON.stringify(payRequest)));
        if (this.endpoint.enable_logs) {
            console.log("get addPayment response:", response.toString());
        }
        return response;
    }
    async addSubscription(subscription) {
        const response = await this.endpoint.invokeRequest("POST", TaskEndpoint.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
        if (this.endpoint.enable_logs) {
            console.log("get addSubscription response:", response.toString());
        }
        return response;
    }
    async addNewWasmImage(task) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.SETUP, task, true);
        if (this.endpoint.enable_logs) {
            console.log("get addNewWasmImage response:", response.toString());
        }
        return response;
    }
    async addProvingTask(task) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.PROVE, task, true);
        if (this.endpoint.enable_logs) {
            console.log("get addProvingTask response:", response);
        }
        return response;
    }
    async addDeployTask(task) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.DEPLOY, task);
        if (this.endpoint.enable_logs) {
            console.log("get addDeployTask response:", response.toString());
        }
        return response;
    }
    async addResetTask(task) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.RESET, task, true);
        if (this.endpoint.enable_logs) {
            console.log("get addResetTask response:", response.toString());
        }
        return response;
    }
    async modifyImage(data) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.MODIFY, data);
        if (this.endpoint.enable_logs) {
            console.log("get modifyImage response:", response.toString());
        }
        return response;
    }
    async setMaintenanceMode(req) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.SET_MAINTENANCE_MODE, req, true);
        if (this.endpoint.enable_logs) {
            console.log("setMaintenanceMode response:", response.toString());
        }
        return response;
    }
    async forceUnprovableToReprocess(req) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.FORCE_UNPROVABLE_TO_REPROCESS, req, true);
        if (this.endpoint.enable_logs) {
            console.log("forceUnprovableToReprocess response:", response.toString());
        }
        return response;
    }
    async forceDryrunFailsToReprocess(req) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.FORCE_DRYRUN_FAILS_TO_REPROCESS, req, true);
        if (this.endpoint.enable_logs) {
            console.log("forceDryrunFailsToReprocess response:", response.toString());
        }
        return response;
    }
    async queryEstimateProofFee(query) {
        const config = await this.endpoint.invokeRequest("GET", TaskEndpoint.GET_ESTIMATED_PROOF_FEE, JSON.parse(JSON.stringify(query)));
        if (this.endpoint.enable_logs) {
            console.log("get queryEstimateProofFee response.");
        }
        return config;
    }
    async sendRequestWithSignature(method, path, task, isFormData = false) {
        // TODO: create return types for tasks using this method
        let headers = this.createHeaders(task);
        let task_params = this.omitSignature(task);
        let payload;
        if (isFormData) {
            payload = new FormData();
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
    }
    createHeaders(task) {
        let headers = {
            "x-eth-signature": task.signature,
        };
        return headers;
    }
    omitSignature(task) {
        const { signature, ...task_details } = task;
        return task_details;
    }
}
export var TaskEndpoint;
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
})(TaskEndpoint || (TaskEndpoint = {}));

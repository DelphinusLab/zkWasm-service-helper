import FormData from "form-data";
import { ZkWasmUtil } from "./util.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
import { ethers } from "ethers";
export class ZkWasmServiceHelper {
    endpoint;
    constructor(endpoint, username, useraddress) {
        this.endpoint = new ZkWasmServiceEndpoint(endpoint, username, useraddress);
    }
    async queryImage(md5) {
        let req = JSON.parse("{}");
        req["md5"] = md5;
        const images = await this.endpoint.invokeRequest("GET", "/image", req);
        console.log("get queryImage response.");
        return images[0];
    }
    async queryUser(user_query) {
        let req = JSON.parse("{}");
        req["user_address"] = user_query.user_address;
        const user = await this.endpoint.invokeRequest("GET", "/user", req);
        console.log("get queryUser response.");
        return user;
    }
    async queryTxHistory(history_query) {
        let req = JSON.parse("{}");
        req["user_address"] = history_query.user_address;
        const txs = await this.endpoint.invokeRequest("GET", "/transactions", req);
        console.log("get queryTxHistory response.");
        return txs;
    }
    async queryDepositHistory(history_query) {
        let req = JSON.parse("{}");
        req["user_address"] = history_query.user_address;
        const txs = await this.endpoint.invokeRequest("GET", "/deposits", req);
        console.log("get queryDepositHistory response.");
        return txs;
    }
    async queryConfig() {
        const config = await this.endpoint.invokeRequest("GET", "/config", JSON.parse("{}"));
        console.log("get queryConfig response.");
        return config;
    }
    async loadStatistics() {
        let headers = { "Content-Type": "application/json" };
        let queryJson = JSON.parse("{}");
        let st = await this.endpoint.invokeRequest("GET", `/statistics`, queryJson);
        console.log("loading task board!");
        return {
            totalImages: st.total_images,
            totalProofs: st.total_proofs,
            totalTasks: st.total_tasks,
            totalDeployed: st.total_deployed,
        };
    }
    async loadTasks(query) {
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
        console.log("params:", query);
        console.log("json", queryJson);
        let tasks = await this.endpoint.invokeRequest("GET", `/tasks`, queryJson);
        console.log("loading task board!");
        return tasks;
    }
    async queryLogs(query) {
        let logs = await this.sendRequestWithSignature("GET", TaskEndpoint.LOGS, query);
        console.log("loading logs!");
        return logs;
    }
    async addPayment(payRequest) {
        const response = await this.endpoint.invokeRequest("POST", TaskEndpoint.PAY, JSON.parse(JSON.stringify(payRequest)));
        console.log("get addPayment response:", response.toString());
        return response;
    }
    async addSubscription(subscription) {
        const response = await this.endpoint.invokeRequest("POST", TaskEndpoint.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
        console.log("get addSubscription response:", response.toString());
        return response;
    }
    async addNewWasmImage(task) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.SETUP, task, true);
        console.log("get addNewWasmImage response:", response.toString());
        return response;
    }
    async addProvingTask(task) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.PROVE, task, true);
        console.log("get addProvingTask response:", response.toString());
        return response;
    }
    async addDeployTask(task) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.DEPLOY, task);
        console.log("get addDeployTask response:", response.toString());
        return response;
    }
    async addResetTask(task) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.RESET, task, true);
        console.log("get addResetTask response:", response.toString());
        return response;
    }
    async modifyImage(data) {
        let response = await this.sendRequestWithSignature("POST", TaskEndpoint.MODIFY, data);
        console.log("get modifyImage response:", response.toString());
        return response;
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
    TaskEndpoint["SUBSCRIBE"] = "/subscribe";
    TaskEndpoint["LOGS"] = "/logs";
})(TaskEndpoint || (TaskEndpoint = {}));

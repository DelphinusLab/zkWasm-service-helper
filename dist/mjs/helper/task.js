import FormData from "form-data";
import { ZkWasmUtil } from "./util.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
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
        const user = await this.endpoint.invokeRequest("GET", "/transactions", req);
        console.log("get queryTxHistory response.");
        return user;
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
        //build query JSON
        let objKeys = Object.keys(query);
        objKeys.forEach((key) => {
            if (query[key] != "")
                queryJson[key] = query[key];
        });
        console.log("params:", query);
        console.log("json", queryJson);
        let tasks = await this.endpoint.invokeRequest("GET", `/tasks`, queryJson);
        console.log("loading task board!");
        return tasks;
    }
    async addPayment(payRequest) {
        const response = await this.endpoint.invokeRequest("POST", "/pay", JSON.parse(JSON.stringify(payRequest)));
        console.log("get addPayment response:", response.toString());
        return response;
    }
    async addNewWasmImage(task) {
        let formdata = new FormData();
        formdata.append("name", task.name);
        formdata.append("md5", task.image_md5);
        formdata.append("image", task.image);
        formdata.append("user_address", task.user_address);
        formdata.append("description_url", task.description_url);
        formdata.append("avator_url", task.avator_url);
        formdata.append("circuit_size", task.circuit_size);
        formdata.append("signature", task.signature);
        console.log("wait response", formdata);
        let headers = { 'Content-Type': 'multipart/form-data' };
        console.log("wait response", headers);
        const response = await this.endpoint.invokeRequest("POST", "/setup", formdata, headers);
        console.log("get addNewWasmImage response:", response.toString());
        return response;
    }
    async addProvingTask(task) {
        const response = await this.endpoint.invokeRequest("POST", "/prove", JSON.parse(JSON.stringify(task)));
        console.log("get addProvingTask response:", response.toString());
        return response;
    }
    parseProvingTaskInput(rawInputs) {
        let inputs = rawInputs.split(" ");
        let parsedInputs = [];
        for (var input of inputs) {
            input = input.trim();
            if (input !== "") {
                if (ZkWasmUtil.parseArg(input) != null) {
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
    async addDeployTask(task) {
        const response = await this.endpoint.invokeRequest("POST", "/deploy", JSON.parse(JSON.stringify(task)));
        console.log("get addDeployTask response:", response.toString());
        return response;
    }
}

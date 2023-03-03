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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZkWasmServiceHelper = void 0;
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
    addPayment(payRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.endpoint.invokeRequest("POST", "/pay", JSON.parse(JSON.stringify(payRequest)));
            console.log("get addPayment response:", response.toString());
            return response;
        });
    }
    addNewWasmImage(task) {
        return __awaiter(this, void 0, void 0, function* () {
            let formdata = new form_data_1.default();
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
            const response = yield this.endpoint.invokeRequest("POST", "/setup", formdata, headers);
            console.log("get addNewWasmImage response:", response.toString());
            return response;
        });
    }
    addProvingTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.endpoint.invokeRequest("POST", "/prove", JSON.parse(JSON.stringify(task)));
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
            const response = yield this.endpoint.invokeRequest("POST", "/deploy", JSON.parse(JSON.stringify(task)));
            console.log("get addDeployTask response:", response.toString());
            return response;
        });
    }
}
exports.ZkWasmServiceHelper = ZkWasmServiceHelper;

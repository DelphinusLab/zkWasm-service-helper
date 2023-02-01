import axios from "axios";
import FormData from "form-data";
import BN from "bn.js";

import { QueryParams, ProvingTask, DeployTask, Statistics, AddWasmImageTask } from "../interface/interface.js";


export class ZkWasmUtil {
    static hexToBNs(hexString: string): Array<BN> {
        let bytes = new Array(hexString.length / 2);
        for (var i = 0; i < hexString.length; i += 2) {
            bytes[i] = new BN(hexString.slice(i, i + 2), 16);
        }
        return bytes;
    }
    static parseArg(input: string): Array<BN> | null {
        let inputArray = input.split(":");
        let value = inputArray[0];
        let type = inputArray[1];
        let re1 = new RegExp(/^[0-9A-Fa-f]+$/); // hexdecimal
        let re2 = new RegExp(/^\d+$/); // decimal

        // Check if value is a number
        if (!(re1.test(value.slice(2)) || re2.test(value))) {
            console.log("Error: input value is not an interger number");
            return null;
        }

        // Convert value byte array
        if (type == "i64") {
            let v: BN;
            if (value.slice(0, 2) == "0x") {
                v = new BN(value.slice(2), 16);
            } else {
                v = new BN(value);
            }
            return [v];
        } else if (type == "bytes" || type == "bytes-packed") {
            if (value.slice(0, 2) != "0x") {
                console.log("Error: bytes input need start with 0x");
                return null;
            }
            let bytes = ZkWasmUtil.hexToBNs(value.slice(2));
            return bytes;
        } else {
            console.log("Unsupported input data type: %s", type);
            return null;
        }
    }
}

export class ZkWasmServiceHelper {
    constructor(
        public endpoint: string,
        public username: string,
        public useraddress: string
    ) { }
    async prepareRequest(
        method: "GET" | "POST",
        url: string,
        body: JSON | FormData | null,
        headers?: {
            [key: string]: string;
        }
    ) {
        if (method === "GET") {
            console.log(this.endpoint + url);
            try {
                let response = await axios.get(
                    this.endpoint + url,
                    body ? { params: body! } : {}
                );
                return response.data;
            } catch (e: any) {
                console.error(e);
                throw Error("RestEndpointGetFailure");
            }
        } else {
            try {
                let response = await axios.post(
                    this.endpoint + url,
                    body ? body! : {},
                    {
                        headers: {
                            ...headers,
                        },
                    }
                );
                return response.data;
            } catch (e: any) {
                console.log(e);
                throw Error("RestEndpointPostFailure");
            }
        }
    }

    async getJSONResponse(json: any) {
        if (json["success"] !== true) {
            console.error(json);
            throw new Error("RequestError:" + json["error"]);
        }
        return json["result"];
    }

    async invokeRequest(
        method: "GET" | "POST",
        url: string,
        body: JSON | FormData | null,
        headers?: {
            [key: string]: string;
        }
    ) {
        let response = await this.prepareRequest(method, url, body, headers);
        return await this.getJSONResponse(response);
    }
}

export class ZkWasmServiceTaskHelper extends ZkWasmServiceHelper {
    constructor(endpoint: string, username: string, useraddress: string) {
        super(endpoint, useraddress, useraddress);
    }

    async loadStatistics(): Promise<Statistics> {
        let headers = { "Content-Type": "application/json" };
        let queryJson = JSON.parse("{}");

        let st = await this.invokeRequest("GET", `/statistics`, queryJson);
        console.log("loading task board!");

        return {
            totalImages: st.total_images,
            totalProofs: st.total_proofs,
            totalTasks: st.total_tasks,
            totalDeployed: st.total_deployed,
        }
    }

    async loadTasks(query: QueryParams) {
        let headers = { "Content-Type": "application/json" };
        let queryJson = JSON.parse("{}");

        //build query JSON
        let objKeys = Object.keys(query) as Array<keyof QueryParams>;
        objKeys.forEach((key) => {
            if (query[key] != "") queryJson[key] = query[key];
        });

        console.log("params:", query);
        console.log("json", queryJson);

        let tasks = await this.invokeRequest("GET", `/tasks`, queryJson);
        console.log("loading task board!");
        return tasks;
    }


    async addNewWasmImage(task: AddWasmImageTask) {
        let formdata = new FormData();
        formdata.append("name", task.name);
        formdata.append("image", task.image);
        formdata.append("user_address", task.user_address);
        formdata.append("description_url", task.description_url);
        formdata.append("avator_url", task.avator_url);
        formdata.append("circuit_size", task.circuit_size);

        console.log("wait response", formdata);
        let headers = { 'Content-Type': 'multipart/form-data' };
        console.log("wait response", headers);

        const response = await this.invokeRequest(
            "POST",
            "/setup",
            formdata,
            headers
        );
        console.log("get addNewWasmImage response:", response.toString());
        return response;
    }

    async addProvingTask(task: ProvingTask) {
        const response = await this.invokeRequest(
            "POST",
            "/prove",
            JSON.parse(JSON.stringify(task))
        );
        console.log("get addProvingTask response:", response.toString());
        return response;
    }

    parseProvingTaskInput(rawInputs: string): Array<string> {
        let inputs = rawInputs.split(" ");
        let parsedInputs: Array<string> = [];
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


    async addDeployTask(
        task: DeployTask
    ) {

        const response = await this.invokeRequest(
            "POST",
            "/deploy",
            JSON.parse(JSON.stringify(task))
        );
        console.log("get addDeployTask response:", response.toString());
        return response;

    }

}

export class ZkWasmServiceImageHelper extends ZkWasmServiceHelper {
    constructor(endpoint: string, username: string, useraddress: string) {
        super(endpoint, useraddress, useraddress);
    }

    async queryImage(md5: string) {
        let req = JSON.parse("{}");
        req["md5"] = md5;

        const images = await this.invokeRequest(
            "GET",
            "/image",
            req
        );
        console.log("get queryImage response.");
        return images[0]!;
    }

    async queryImages(md5: string) {
        let req = JSON.parse("{}");
        req["md5"] = md5;

        const images = await this.invokeRequest(
            "GET",
            "/image",
            req
        );
        console.log("get queryImage response.");
        return images;
    }

}
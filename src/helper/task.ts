import FormData from "form-data";
import { ZkWasmUtil } from "./util.js";
import { QueryParams, ProvingParams, DeployParams, Statistics, AddImageParams } from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js"

export class ZkWasmServiceTaskHelper {
    endpoint: ZkWasmServiceEndpoint;

    constructor(endpoint: string, username: string, useraddress: string) {
        this.endpoint = new ZkWasmServiceEndpoint(endpoint, username, useraddress);
    }

    async loadStatistics(): Promise<Statistics> {
        let headers = { "Content-Type": "application/json" };
        let queryJson = JSON.parse("{}");

        let st = await this.endpoint.invokeRequest("GET", `/statistics`, queryJson);
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

        let tasks = await this.endpoint.invokeRequest("GET", `/tasks`, queryJson);
        console.log("loading task board!");
        return tasks;
    }


    async addNewWasmImage(task: AddImageParams) {
        let formdata = new FormData();
        formdata.append("name", task.name);
        formdata.append("image", task.image);
        formdata.append("user_address", task.user_address);
        formdata.append("description_url", task.description_url);
        formdata.append("avator_url", task.avator_url);
        formdata.append("circuit_size", task.circuit_size);
        formdata.append("signature", task.signature);

        console.log("wait response", formdata);
        let headers = { 'Content-Type': 'multipart/form-data' };
        console.log("wait response", headers);

        const response = await this.endpoint.invokeRequest(
            "POST",
            "/setup",
            formdata,
            headers
        );
        console.log("get addNewWasmImage response:", response.toString());
        return response;
    }

    async addProvingTask(task: ProvingParams) {
        const response = await this.endpoint.invokeRequest(
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
        task: DeployParams
    ) {

        const response = await this.endpoint.invokeRequest(
            "POST",
            "/deploy",
            JSON.parse(JSON.stringify(task))
        );
        console.log("get addDeployTask response:", response.toString());
        return response;

    }

    //this is form data 
    createAddImageSignMessage(params: AddImageParams): string {
        //sign all the fields except the image itself and signature
        let message = "";
        message += params.name;
        message += params.md5;
        message += params.user_address;
        message += params.description_url;
        message += params.avator_url;
        message += params.circuit_size;
        return message;
    }

    createProvingSignMessage(params: ProvingParams): string {
        let {signature, ...rest} = params;
        return JSON.stringify(rest);
    }

    createDeploySignMessage(params: DeployParams): string {
        let {signature, ...rest} = params;
        return JSON.stringify(rest);
    }
    

}
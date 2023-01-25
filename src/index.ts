import axios from "axios";
import FormData from "form-data";

import { sayHello, sayGoodbye } from './hello';

import { Task, ProvingTask, DeployTask } from './Interface/task';
import { StatusState, QueryParams } from './Interface/status';
import { DeploymentInfo, Image } from './Interface/image';
export {
    sayHello, sayGoodbye,
    Task, ProvingTask, DeployTask,
    StatusState, QueryParams,
    DeploymentInfo, Image
};

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


    async addNewWasmImage(formdata: FormData) {
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
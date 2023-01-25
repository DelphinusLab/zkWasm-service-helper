import { RestEndpoint } from "servicehelper";
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
    public endPoint: RestEndpoint;

    constructor(endpoint: string, username: string, useraddress: string) {
        this.endPoint = new RestEndpoint(endpoint, username, useraddress);
    }

    async invokeRequest(
        method: "GET" | "POST",
        url: string,
        body: JSON | FormData | null,
        headers?: {
            [key: string]: string;
        }
    ) {

        return await this.endPoint.invokeRequest(method, url, body, headers);
    }


}

export class ZkWasmServiceTaskHelper extends ZkWasmServiceHelper {
    constructor(endpoint: string, username: string, useraddress: string) {
        super(endpoint, useraddress, useraddress);
    }


    async loadTasks(query: QueryParams) {
        let headers = { 'Content-Type': 'application/json' };
        let queryJson = JSON.parse("{}");
        if (query.account != "") {
            queryJson["account"] = query.account;
        }

        if (query.md5 != "") {
            queryJson["md5"] = query.md5;
        }

        console.log("params:", query);
        console.log("json", queryJson);

        const tasks = await this.endPoint.invokeRequest(
            "GET",
            "/tasks",
            queryJson
        );
        console.log("loading task board!");
        return tasks;
    }


    async addNewWasmImage(formdata: FormData) {
        console.log("wait response", formdata);
        let headers = { 'Content-Type': 'multipart/form-data' };
        console.log("wait response", headers);

        const response = await this.endPoint.invokeRequest(
            "POST",
            "/setup",
            formdata,
            headers
        );
        console.log("get addNewWasmImage response:", response.toString());
        return response;
    }

    async addProvingTask(task: ProvingTask) {
        const response = await this.endPoint.invokeRequest(
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

        const response = await this.endPoint.invokeRequest(
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

        const images = await this.endPoint.invokeRequest(
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

        const images = await this.endPoint.invokeRequest(
            "GET",
            "/image",
            req
        );
        console.log("get queryImage response.");
        return images;
    }

}
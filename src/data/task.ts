import { RestEndpoint } from "servicehelper";
import FormData from "form-data";
import { ProvingTask, DeployTask } from "../Interface/task";
import { QueryParams } from "../Interface/status";


export async function loadTasks(endpoint: string, query: QueryParams) {
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


    const queryClient = new RestEndpoint(endpoint, "", "");
    const tasks = await queryClient.invokeRequest(
        "GET",
        "/tasks",
        queryJson
    );
    console.log("loading task board!");
    return tasks;
}


export async function addNewWasmImage(endpoint: string, formdata: FormData) {
    console.log("wait response", formdata);
    let headers = { 'Content-Type': 'multipart/form-data' };
    console.log("wait response", headers);

    const queryClient = new RestEndpoint(endpoint, "", "");
    const response = await queryClient.invokeRequest(
        "POST",
        "/setup",
        formdata,
        headers
    );
    console.log("get addNewWasmImage response:", response.toString());
    return response;
}

export async function addProvingTask(
    endpoint: string,
    task: ProvingTask
) {
    const queryClient = new RestEndpoint(endpoint, "", "");

    const response = await queryClient.invokeRequest(
        "POST",
        "/prove",
        JSON.parse(JSON.stringify(task))
    );
    console.log("get addProvingTask response:", response.toString());
    return response;

}

export async function addDeployTask(
    endpoint: string,
    task: DeployTask
) {
    const queryClient = new RestEndpoint(endpoint, "", "");

    const response = await queryClient.invokeRequest(
        "POST",
        "/deploy",
        JSON.parse(JSON.stringify(task))
    );
    console.log("get addDeployTask response:", response.toString());
    return response;

}





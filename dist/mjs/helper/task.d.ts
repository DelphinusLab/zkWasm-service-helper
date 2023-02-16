import { QueryParams, ProvingTask, DeployTask, Statistics, AddWasmImageTask } from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
export declare class ZkWasmServiceTaskHelper {
    endpoint: ZkWasmServiceEndpoint;
    constructor(endpoint: string, username: string, useraddress: string);
    loadStatistics(): Promise<Statistics>;
    loadTasks(query: QueryParams): Promise<any>;
    addNewWasmImage(task: AddWasmImageTask): Promise<any>;
    addProvingTask(task: ProvingTask): Promise<any>;
    parseProvingTaskInput(rawInputs: string): Array<string>;
    addDeployTask(task: DeployTask): Promise<any>;
}

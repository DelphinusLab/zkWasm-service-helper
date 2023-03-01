import { QueryParams, ProvingParams, DeployParams, Statistics, AddImageParams, WithSignature } from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
export declare class ZkWasmServiceTaskHelper {
    endpoint: ZkWasmServiceEndpoint;
    constructor(endpoint: string, username: string, useraddress: string);
    loadStatistics(): Promise<Statistics>;
    loadTasks(query: QueryParams): Promise<any>;
    addNewWasmImage(task: WithSignature<AddImageParams>): Promise<any>;
    addProvingTask(task: WithSignature<ProvingParams>): Promise<any>;
    parseProvingTaskInput(rawInputs: string): Array<string>;
    addDeployTask(task: WithSignature<DeployParams>): Promise<any>;
}

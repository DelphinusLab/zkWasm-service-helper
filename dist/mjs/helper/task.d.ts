import { QueryParams, ProvingParams, DeployParams, Statistics, AddImageParams } from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
export declare class ZkWasmServiceTaskHelper {
    endpoint: ZkWasmServiceEndpoint;
    constructor(endpoint: string, username: string, useraddress: string);
    loadStatistics(): Promise<Statistics>;
    loadTasks(query: QueryParams): Promise<any>;
    addNewWasmImage(task: AddImageParams): Promise<any>;
    addProvingTask(task: ProvingParams): Promise<any>;
    parseProvingTaskInput(rawInputs: string): Array<string>;
    addDeployTask(task: DeployParams): Promise<any>;
    createAddImageSignMessage(params: AddImageParams): string;
    createProvingSignMessage(params: ProvingParams): string;
    createDeploySignMessage(params: DeployParams): string;
}

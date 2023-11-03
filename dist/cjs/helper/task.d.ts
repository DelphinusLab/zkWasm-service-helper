import { QueryParams, ProvingParams, DeployParams, Statistics, AddImageParams, WithSignature, UserQueryParams, PaymentParams, TxHistoryQueryParams, LogQuery, ResetImageParams, PaginationResult, Task, Image, User, TransactionInfo, AppConfig, OmitSignature, ModifyImageParams } from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
export declare class ZkWasmServiceHelper {
    endpoint: ZkWasmServiceEndpoint;
    constructor(endpoint: string, username: string, useraddress: string);
    queryImage(md5: string): Promise<Image>;
    queryUser(user_query: UserQueryParams): Promise<User>;
    queryTxHistory(history_query: TxHistoryQueryParams): Promise<PaginationResult<TransactionInfo[]>>;
    queryConfig(): Promise<AppConfig>;
    loadStatistics(): Promise<Statistics>;
    loadTasks(query: QueryParams): Promise<PaginationResult<Task[]>>;
    queryLogs(query: WithSignature<LogQuery>): Promise<string>;
    addPayment(payRequest: PaymentParams): Promise<any>;
    addNewWasmImage(task: WithSignature<AddImageParams>): Promise<any>;
    addProvingTask(task: WithSignature<ProvingParams>): Promise<any>;
    parseProvingTaskInput(rawInputs: string): Array<string>;
    addDeployTask(task: WithSignature<DeployParams>): Promise<any>;
    addResetTask(task: WithSignature<ResetImageParams>): Promise<any>;
    modifyImage(data: WithSignature<ModifyImageParams>): Promise<any>;
    sendRequestWithSignature<T>(method: "GET" | "POST", path: TaskEndpoint, task: WithSignature<T>, isFormData?: boolean): Promise<any>;
    createHeaders<T>(task: WithSignature<T>): Record<string, string>;
    omitSignature<T>(task: WithSignature<T>): OmitSignature<T>;
}
export declare enum TaskEndpoint {
    TASK = "/tasks",
    SETUP = "/setup",
    PROVE = "/prove",
    DEPLOY = "/deploy",
    RESET = "/reset",
    MODIFY = "/modify",
    PAY = "/pay",
    LOGS = "/logs"
}

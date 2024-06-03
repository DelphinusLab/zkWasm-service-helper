import { QueryParams, ProvingParams, DeployParams, Statistics, AddImageParams, WithSignature, UserQueryParams, PaymentParams, TxHistoryQueryParams, LogQuery, ResetImageParams, PaginationResult, Task, Image, TransactionInfo, AppConfig, OmitSignature, ModifyImageParams, SubscriptionRequest, ERC20DepositInfo, User, Subscription, PaginatedQuery, Round1BatchProofQuery, Round2BatchProofQuery, Round2BatchProof, Round1BatchProof, FinalBatchProofQuery, FinalBatchProof, ConciseTask } from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
export declare class ZkWasmServiceHelper {
    endpoint: ZkWasmServiceEndpoint;
    constructor(endpoint: string, username: string, useraddress: string, enable_logs?: boolean);
    queryImage(md5: string): Promise<Image>;
    queryImageBinary(md5: string): Promise<number[]>;
    queryUser(user_query: UserQueryParams): Promise<User>;
    queryUserSubscription(user_query: UserQueryParams): Promise<Subscription | null>;
    queryTxHistory(history_query: TxHistoryQueryParams): Promise<PaginationResult<TransactionInfo[]>>;
    queryDepositHistory(history_query: TxHistoryQueryParams): Promise<PaginationResult<ERC20DepositInfo[]>>;
    queryConfig(): Promise<AppConfig>;
    loadStatistics(): Promise<Statistics>;
    loadTasks(query: QueryParams): Promise<PaginationResult<Task[]>>;
    loadTaskList(query: QueryParams): Promise<PaginationResult<ConciseTask[]>>;
    queryRound1BatchProofs(query: PaginatedQuery<Round1BatchProofQuery>): Promise<PaginationResult<Round1BatchProof[]>>;
    queryRound2BatchProofs(query: PaginatedQuery<Round2BatchProofQuery>): Promise<PaginationResult<Round2BatchProof[]>>;
    queryFinalBatchProofs(query: PaginatedQuery<FinalBatchProofQuery>): Promise<PaginationResult<FinalBatchProof[]>>;
    queryLogs(query: WithSignature<LogQuery>): Promise<string>;
    addPayment(payRequest: PaymentParams): Promise<any>;
    addSubscription(subscription: SubscriptionRequest): Promise<any>;
    addNewWasmImage(task: WithSignature<AddImageParams>): Promise<any>;
    addProvingTask(task: WithSignature<ProvingParams>): Promise<any>;
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
    SUBSCRIBE = "/subscribe",
    LOGS = "/logs",
    ROUND_1_BATCH = "/round1_batch_proofs",
    ROUND_2_BATCH = "/round2_batch_proofs",
    FINAL_BATCH = "/final_batch_proofs"
}

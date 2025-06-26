import { QueryParams, TaskExternalHostTableParams, ProvingParams, DeployParams, Statistics, AddImageParams, WithSignature, UserQueryParams, PaymentParams, TxHistoryQueryParams, LogQuery, ResetImageParams, PaginationResult, Task, TaskExternalHostTable, Image, TransactionInfo, AppConfig, OmitSignature, ModifyImageParams, SubscriptionRequest, ERC20DepositInfo, User, Subscription, PaginatedQuery, AutoSubmitProofQuery, Round1InfoQuery, Round1Info, Round2Info, Round2InfoQuery, AutoSubmitProof, ConciseTask, NodeStatistics, NodeStatisticsQueryParams, SetMaintenanceModeParams, ProverNodesSummary, OnlineNodesSummary, EstimatedProofFeeParams, EstimatedProofFee, ForceUnprovableToReprocessParams, ForceDryrunFailsToReprocessParams, ProverNodeTimeRangeStats } from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
import { ArchiveQuery, VolumeDetailQuery, VolumeListQuery } from "interface/archive.js";
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
    queryNodeStatistics(query: NodeStatisticsQueryParams): Promise<PaginationResult<NodeStatistics[]>>;
    queryProverNodeSummary(): Promise<ProverNodesSummary>;
    queryOnlineNodesSummary(): Promise<OnlineNodesSummary>;
    loadTasks(query: QueryParams): Promise<PaginationResult<Task[]>>;
    getTasksDetailFromIds(ids: string[]): Promise<Task[]>;
    getTaskDetailFromId(ids: string): Promise<Task | null>;
    loadTaskList(query: QueryParams): Promise<PaginationResult<ConciseTask[]>>;
    getTaskExternalHostTable(query: TaskExternalHostTableParams): Promise<TaskExternalHostTable>;
    queryAutoSubmitProofs(query: PaginatedQuery<AutoSubmitProofQuery>): Promise<PaginationResult<AutoSubmitProof[]>>;
    queryRound1Info(query: PaginatedQuery<Round1InfoQuery>): Promise<PaginationResult<Round1Info[]>>;
    queryRound2Info(query: PaginatedQuery<Round2InfoQuery>): Promise<PaginationResult<Round2Info[]>>;
    queryLogs(query: WithSignature<LogQuery>): Promise<string>;
    queryArchiveSummary(): Promise<any>;
    queryVolumeList(query: VolumeListQuery): Promise<any>;
    queryArchivedTask(task_id: string): Promise<any>;
    queryArchiveServerConfig(): Promise<any>;
    queryVolume(volume_name: string, query: VolumeDetailQuery): Promise<any>;
    queryArchive(query: ArchiveQuery): Promise<any>;
    addPayment(payRequest: PaymentParams): Promise<any>;
    addSubscription(subscription: SubscriptionRequest): Promise<any>;
    addNewWasmImage(task: WithSignature<AddImageParams>): Promise<any>;
    addProvingTask(task: WithSignature<ProvingParams>): Promise<any>;
    addDeployTask(task: WithSignature<DeployParams>): Promise<any>;
    addResetTask(task: WithSignature<ResetImageParams>): Promise<any>;
    modifyImage(data: WithSignature<ModifyImageParams>): Promise<any>;
    setMaintenanceMode(req: WithSignature<SetMaintenanceModeParams>): Promise<any>;
    forceUnprovableToReprocess(req: WithSignature<ForceUnprovableToReprocessParams>): Promise<any>;
    forceDryrunFailsToReprocess(req: WithSignature<ForceDryrunFailsToReprocessParams>): Promise<any>;
    queryEstimateProofFee(query: EstimatedProofFeeParams): Promise<EstimatedProofFee>;
    queryProverNodeTimeRangeStats(address: string, start_ts: Date, end_ts: Date): Promise<ProverNodeTimeRangeStats>;
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
    SET_MAINTENANCE_MODE = "/admin/set_maintenance_mode",
    SUBSCRIBE = "/subscribe",
    LOGS = "/logs",
    ROUND_1_BATCH = "/round1_batch_proofs",
    ROUND_2_BATCH = "/round2_batch_proofs",
    FINAL_BATCH = "/final_batch_proofs",
    GET_ESTIMATED_PROOF_FEE = "/estimated_proof_fee",
    ONLINE_NODES_SUMMARY = "/online_nodes_summary",
    FORCE_UNPROVABLE_TO_REPROCESS = "/admin/force_unprovable_to_reprocess",
    FORCE_DRYRUN_FAILS_TO_REPROCESS = "/admin/force_dryrun_fails_to_reprocess",
    PROVER_NODE_TIMERANGE_STATS = "/prover_node_timerange_stats"
}

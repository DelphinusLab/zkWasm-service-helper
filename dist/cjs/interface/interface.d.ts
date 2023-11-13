export interface Statistics {
    totalImages: number;
    totalProofs: number;
    totalTasks: number;
    totalDeployed: number;
}
export interface Task {
    user_address: string;
    node_address?: string;
    md5: string;
    task_type: string;
    status: TaskStatus;
    proof: Uint8Array;
    aux: Uint8Array;
    batch_instances: Uint8Array;
    instances: Uint8Array;
    public_inputs: Array<string>;
    private_inputs: Array<string>;
    _id: any;
    submit_time: string;
    process_started?: string;
    process_finished?: string;
    task_fee?: Uint8Array;
    status_message?: string;
    internal_message?: string;
}
export type TaskStatus = "Pending" | "Processing" | "DryRunFailed" | "Done" | "Fail" | "Stale";
export interface PaginationResult<T> {
    data: T;
    total: number;
}
export interface AddImageParams {
    name: string;
    image: any;
    image_md5: string;
    user_address: string;
    description_url: string;
    avator_url: string;
    circuit_size: number;
}
export interface ProvingParams {
    user_address: string;
    md5: string;
    public_inputs: Array<string>;
    private_inputs: Array<string>;
}
export interface DeployParams {
    user_address: string;
    md5: string;
    chain_id: number;
}
export interface ResetImageParams {
    md5: string;
    circuit_size: number;
    user_address: string;
}
export interface ModifyImageParams {
    md5: string;
    user_address: string;
    description_url: string;
    avator_url: string;
}
export type WithSignature<T> = T & {
    signature: string;
    user_address: string;
};
export type OmitSignature<T> = Omit<WithSignature<T>, "signature">;
export interface VerifyData {
    proof: Array<BigInt>;
    target_instances: Array<BigInt>;
    aggregator_instances: Array<BigInt>;
    aux_instances: Array<BigInt>;
}
export interface QueryParams {
    user_address: string;
    md5: string;
    id: string;
    tasktype: string;
    taskstatus: string;
    start?: number;
    total?: number;
}
export interface VerifyProofParams {
    aggregate_proof: Uint8Array;
    batch_instances: Uint8Array;
    aux: Uint8Array;
    public_inputs: Array<string>;
}
export interface LogQuery {
    id: string;
    user_address: string;
}
export interface StatusState {
    tasks: Array<Task>;
    statistics: Statistics;
    loaded: boolean;
    config: AppConfig;
}
export interface AppConfig {
    receiver_address: string;
    deployer_address: string;
    task_fee_list: {
        setup_fee: string;
        prove_fee: string;
    };
    chain_info_list: Array<ChainInfo>;
    deployments: ContractDeployments[];
}
export interface ContractDeployments {
    chain_id: number;
    circuit_size: number;
    aggregator_lib_address: string;
    aggregator_config_address: string;
    aggregator_verifier_steps: string[];
    aggregator_verifier: string;
}
export interface ChainInfo {
    chain_id: number;
    chain_name: string;
    block_explorer_url: string;
    deploy_fee: string;
}
export interface ChainDetails {
    chainHexId: string;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
}
export interface DeploymentInfo {
    chain_id: number;
    address: string;
}
export interface Image {
    user_address: string;
    md5: string;
    deployment: Array<DeploymentInfo>;
    description_url: string;
    avator_url: string;
    circuit_size: number;
    status: string;
    checksum: ImageChecksum | null;
}
export interface ImageChecksum {
    x: Uint8Array;
    y: Uint8Array;
}
export interface PaymentParams {
    txhash: string;
}
export interface UserQueryParams {
    user_address: string;
}
export interface TxHistoryQueryParams {
    user_address: string;
    start?: number;
    total?: number;
}
export interface User {
    user_address: string;
    balance: Uint8Array;
}
export interface TransactionInfo {
    txhash: string;
    value: Uint8Array;
    user_address: string;
    receiver_address: string;
}

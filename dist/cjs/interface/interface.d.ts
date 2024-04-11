export interface Statistics {
    totalImages: number;
    totalProofs: number;
    totalTasks: number;
    totalDeployed: number;
}
export declare enum InputContextType {
    Custom = "Custom",
    ImageInitial = "ImageInitial",
    ImageCurrent = "ImageCurrent"
}
export type ContextHexString = string;
export interface Task {
    user_address: string;
    node_address?: string;
    md5: string;
    task_type: string;
    status: TaskStatus;
    single_proof: Uint8Array;
    proof: Uint8Array;
    aux: Uint8Array;
    external_host_table: Uint8Array;
    shadow_instances: Uint8Array;
    batch_instances: Uint8Array;
    instances: Uint8Array;
    public_inputs: Array<string>;
    private_inputs: Array<string>;
    input_context: Uint8Array;
    input_context_type?: InputContextType;
    output_context: Uint8Array;
    _id: any;
    submit_time: string;
    process_started?: string;
    process_finished?: string;
    task_fee?: Uint8Array;
    status_message?: string;
    internal_message?: string;
    task_verification_data: TaskVerificationData;
    debug_logs?: string;
}
export interface TaskVerificationData {
    static_file_checksum: Uint8Array;
    verifier_contracts: Array<VerifierContracts>;
}
export interface VerifierContracts {
    chain_id: number;
    aggregator_verifier: string;
    circuit_size: number;
}
export type TaskType = "Setup" | "Prove" | "Reset";
/**
 * Image status:
 *  Received: Server received setup task of the image but haven’t been done successfully.
 *  Initialized: Server received setup task of the image and it is done successfully. No proof task had been done successfully for this image.
 *  Verified: At least one of the proof task had been done successfully for the image.
 **/
export type ImageStatus = "Received" | "Initialized" | "Verified";
export type TaskStatus = "Pending" | "Processing" | "DryRunFailed" | "Done" | "Fail" | "Stale";
export declare enum AutoSubmitStatus {
    InProgress = "InProgress",
    Done = "Done"
}
export interface PaginationResult<T> {
    data: T;
    total: number;
}
export declare enum ImageMetadataKeys {
    ProvePaymentSrc = "ProvePaymentSrc"
}
export declare enum ImageMetadataValsProvePaymentSrc {
    Default = "Default",
    CreatorPay = "CreatorPay"
}
export interface BaseAddImageParams {
    name: string;
    image: any;
    image_md5: string;
    user_address: string;
    description_url: string;
    avator_url: string;
    circuit_size: number;
    metadata_keys: ImageMetadataKeys[];
    metadata_vals: string[];
}
export interface WithInitialContext {
    initial_context: unknown;
    initial_context_md5: string;
}
export interface WithoutInitialContext {
    initial_context?: never;
    initial_context_md5?: never;
}
export type AddImageParams = BaseAddImageParams & (WithInitialContext | WithoutInitialContext);
export declare enum TaskMetadataKeys {
    ProofSubmitMode = "ProofSubmitMode"
}
export declare enum TaskMetadataValsProofSubmitMode {
    Manual = "Manual",
    Auto = "Auto"
}
export interface BaseProvingParams {
    user_address: string;
    md5: string;
    public_inputs: Array<string>;
    private_inputs: Array<string>;
    metadata_keys: TaskMetadataKeys[];
    metadata_vals: string[];
}
export interface WithCustomInputContextType {
    input_context_type: InputContextType.Custom;
    input_context: unknown;
    input_context_md5: string;
}
export interface WithNonCustomInputContextType {
    input_context_type: Exclude<InputContextType, InputContextType.Custom>;
    input_context?: never;
    input_context_md5?: never;
}
export interface WithoutInputContextType {
    input_context_type?: never;
    input_context?: never;
    input_context_md5?: never;
}
export type ProvingParams = BaseProvingParams & (WithCustomInputContextType | WithoutInputContextType | WithNonCustomInputContextType);
export interface DeployParams {
    user_address: string;
    md5: string;
    chain_id: number;
}
export interface BaseResetImageParams {
    md5: string;
    circuit_size: number;
    user_address: string;
    metadata_keys: ImageMetadataKeys[];
    metadata_vals: string[];
}
export interface WithResetContext {
    reset_context: unknown;
    reset_context_md5: string;
}
export interface WithoutResetContext {
    reset_context?: never;
    reset_context_md5?: never;
}
export type ResetImageParams = BaseResetImageParams & (WithResetContext | WithoutResetContext);
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
    user_address: string | null;
    md5: string | null;
    id: string | null;
    tasktype: string | null;
    taskstatus: string | null;
    start?: number | null;
    total?: number | null;
}
export interface VerifyProofParams {
    aggregate_proof: Uint8Array;
    shadow_instances: Uint8Array;
    aux: Uint8Array;
    instances: Array<Uint8Array>;
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
    latest_server_checksum: Uint8Array;
    topup_token_params: TokenParams;
    topup_token_data: TokenData;
    deployments: ContractDeployments[];
    subscription_plans: SubscriptionParams[];
}
export interface ContractDeployments {
    chain_id: number;
    circuit_size: number;
    aggregator_lib_address: string;
    aggregator_config_address: string;
    aggregator_verifier_steps: string[];
    aggregator_verifier: string;
    static_file_checksum: Uint8Array;
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
    context?: Uint8Array;
    initial_context?: Uint8Array;
    status: string;
    checksum: ImageChecksum | null;
    metadata: {
        values: {
            [key: string]: string;
        };
    };
}
export interface ImageChecksum {
    x: Uint8Array;
    y: Uint8Array;
}
export interface PaymentParams {
    txhash: string;
}
export type SubscriptionType = "Basic" | "Developer" | "Enterprise";
export type BaseSubscriptionDuration = "Month" | "Year";
export type SubscriptionDuration = {
    base_duration: BaseSubscriptionDuration;
    multiplier: number;
};
export interface SubscriptionParams {
    subscription_type: SubscriptionType;
    duration: SubscriptionDuration;
    token_params: TokenParams;
    token_data: TokenData;
    price_per_base_duration: string;
    credited_amount: string;
    enabled: boolean;
}
export interface TokenParams {
    token_address: string;
    network_id: number;
    topup_conversion_rate: number | null;
}
export interface TokenData {
    decimals: number;
    symbol: string;
}
export interface SubscriptionRequest {
    subscriber_address: string;
    subscription_type: SubscriptionType;
    duration: SubscriptionDuration;
    payment_hash: string;
}
export type SubscriptionStatus = "Active" | "Expired";
export interface ERC20DepositInfo {
    user_address: string;
    receiver_address: string;
    txhash: string;
    amount: string;
    token_params: TokenParams;
    token_data: TokenData;
}
export interface Subscription {
    subscriber_address: string;
    start_date: number;
    end_date: number;
    params: SubscriptionParams;
    status: SubscriptionStatus;
    payment_details: ERC20DepositInfo[];
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
    /**
     * @deprecated This field is deprecated and will be removed in a future version.
     * Use `credits` as an alternative.
     */
    balance: Uint8Array;
    credits: string;
}
export interface TransactionInfo {
    txhash: string;
    value: Uint8Array;
    user_address: string;
    receiver_address: string;
}

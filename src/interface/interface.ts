import BN from "bn.js";
import { FileChangeInfo } from "fs/promises";

export interface Statistics {
    totalImages: number;
    totalProofs: number;
    totalTasks: number;
    totalDeployed: number;
}
export interface Task {
    user_address: string;
    md5: string;
    task_type: string;
    status: string;
    proof: Uint8Array;
    aux: Uint8Array;
    instances: Uint8Array;
    public_inputs: Array<string>;
    private_inputs: Array<string>;
    _id: any;
    submit_time: string;
    process_started?: string;
    process_finished?: string;
}

export interface AddImageParams {
    name: string;
    image: any; //This is because F/E use dom File but cli have to use Buffer. Our rust service just read it as bytes and get data before the first EOF.
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

export type WithSignature<T> = T & { signature: string };

export interface VerifyData {
    proof: Array<BN>;
    target_instances: Array<BN>;
    aggregator_instances: Array<BN>;
    aux_instances: Array<BN>;
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
        deploy_fee: string;
    }
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
}

export interface PaymentParams {
    transaction_hash: string;
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
}

export interface TxHistory {
    tx_history: Array<TransactionInfo>;
    total: number;
}
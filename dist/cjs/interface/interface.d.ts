import BN from "bn.js";
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
export type WithSignature<T> = T & {
    signature: string;
};
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

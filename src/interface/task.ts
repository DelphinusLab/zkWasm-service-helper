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
 }
 
 export interface ProvingTask {
    user_address: string;
    md5: string;
    public_inputs: Array<string>;
    private_inputs: Array<string>;
 }
 
 export interface DeployTask {
    user_address: string;
    md5: string;
    chain_id: number;
 }

 export interface StatusState {
    tasks: Array<Task>,
    loaded: boolean;
}
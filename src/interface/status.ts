import BN from "bn.js";
import {Task} from "./task";

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
 }

 export interface StatusState {
    tasks: Array<Task>,
    loaded: boolean;
}
import { Task } from "./task"

export interface StatusState {
    tasks: Array<Task>,
    loaded: boolean;
}

export interface QueryParams {
    user_address: string;
    md5: string;
    id: string;
    tasktype: string;
    taskstatus: string;
}
import { Task } from "./task"

export interface StatusState {
    tasks: Array<Task>,
    loaded: boolean;
}

export interface QueryParams {
    account: string;
    md5: string;
}
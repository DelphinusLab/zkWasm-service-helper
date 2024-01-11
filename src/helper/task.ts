import FormData from "form-data";
import { ZkWasmUtil } from "./util.js";
import {
  QueryParams,
  ProvingParams,
  DeployParams,
  Statistics,
  AddImageParams,
  WithSignature,
  UserQueryParams,
  PaymentParams,
  TxHistoryQueryParams,
  LogQuery,
  ResetImageParams,
  PaginationResult,
  Task,
  Image,
  User,
  TransactionInfo,
  AppConfig,
  OmitSignature,
  ModifyImageParams,
} from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";

export class ZkWasmServiceHelper {
  endpoint: ZkWasmServiceEndpoint;

  constructor(endpoint: string, username: string, useraddress: string) {
    this.endpoint = new ZkWasmServiceEndpoint(endpoint, username, useraddress);
  }

  async queryImage(md5: string): Promise<Image> {
    let req = JSON.parse("{}");
    req["md5"] = md5;

    const images = await this.endpoint.invokeRequest("GET", "/image", req);
    console.log("get queryImage response.");
    return images[0]!;
  }

  async queryUser(user_query: UserQueryParams): Promise<User> {
    let req = JSON.parse("{}");
    req["user_address"] = user_query.user_address;

    const user = await this.endpoint.invokeRequest("GET", "/user", req);
    console.log("get queryUser response.");
    return user;
  }

  async queryTxHistory(
    history_query: TxHistoryQueryParams
  ): Promise<PaginationResult<TransactionInfo[]>> {
    let req = JSON.parse("{}");
    req["user_address"] = history_query.user_address;

    const txs = await this.endpoint.invokeRequest("GET", "/transactions", req);
    console.log("get queryTxHistory response.");
    return txs;
  }

  async queryConfig(): Promise<AppConfig> {
    const config = await this.endpoint.invokeRequest(
      "GET",
      "/config",
      JSON.parse("{}")
    );
    console.log("get queryConfig response.");
    return config;
  }

  async loadStatistics(): Promise<Statistics> {
    let headers = { "Content-Type": "application/json" };
    let queryJson = JSON.parse("{}");

    let st = await this.endpoint.invokeRequest("GET", `/statistics`, queryJson);
    console.log("loading task board!");

    return {
      totalImages: st.total_images,
      totalProofs: st.total_proofs,
      totalTasks: st.total_tasks,
      totalDeployed: st.total_deployed,
    };
  }

  async loadTasks(query: QueryParams): Promise<PaginationResult<Task[]>> {
    let headers = { "Content-Type": "application/json" };
    let queryJson = JSON.parse("{}");

    //build query JSON
    let objKeys = Object.keys(query) as Array<keyof QueryParams>;
    objKeys.forEach((key) => {
      if (query[key] != "") queryJson[key] = query[key];
    });

    console.log("params:", query);
    console.log("json", queryJson);

    let tasks = await this.endpoint.invokeRequest("GET", `/tasks`, queryJson);
    console.log("loading task board!");
    return tasks;
  }

  async queryLogs(query: WithSignature<LogQuery>): Promise<string> {
    let logs = await this.sendRequestWithSignature(
      "GET",
      TaskEndpoint.LOGS,
      query
    );
    console.log("loading logs!");
    return logs;
  }

  async addPayment(payRequest: PaymentParams) {
    const response = await this.endpoint.invokeRequest(
      "POST",
      TaskEndpoint.PAY,
      JSON.parse(JSON.stringify(payRequest))
    );
    console.log("get addPayment response:", response.toString());
    return response;
  }

  async addNewWasmImage(task: WithSignature<AddImageParams>) {
    let response = await this.sendRequestWithSignature<AddImageParams>(
      "POST",
      TaskEndpoint.SETUP,
      task,
      true
    );

    console.log("get addNewWasmImage response:", response.toString());
    return response;
  }

  async addProvingTask(task: WithSignature<ProvingParams>) {
    let response = await this.sendRequestWithSignature<ProvingParams>(
      "POST",
      TaskEndpoint.PROVE,
      task
    );
    console.log("get addProvingTask response:", response.toString());
    return response;
  }

  async addDeployTask(task: WithSignature<DeployParams>) {
    let response = await this.sendRequestWithSignature<DeployParams>(
      "POST",
      TaskEndpoint.DEPLOY,
      task
    );
    console.log("get addDeployTask response:", response.toString());
    return response;
  }

  async addResetTask(task: WithSignature<ResetImageParams>) {
    let response = await this.sendRequestWithSignature<ResetImageParams>(
      "POST",
      TaskEndpoint.RESET,
      task
    );

    console.log("get addResetTask response:", response.toString());
    return response;
  }

  async modifyImage(data: WithSignature<ModifyImageParams>) {
    let response = await this.sendRequestWithSignature<ModifyImageParams>(
      "POST",
      TaskEndpoint.MODIFY,
      data
    );

    console.log("get modifyImage response:", response.toString());
    return response;
  }

  async sendRequestWithSignature<T>(
    method: "GET" | "POST",
    path: TaskEndpoint,
    task: WithSignature<T>,
    isFormData = false
  ): Promise<any> {
    // TODO: create return types for tasks using this method
    let headers = this.createHeaders(task);
    let task_params = this.omitSignature(task);

    let payload: FormData | JSON | null;
    if (isFormData) {
      payload = new FormData();
      for (const key in task_params) {
        // append if the data is not null
        if (task_params[key as keyof typeof task_params]) {
          payload.append(
            key,
            task_params[key as keyof typeof task_params] as string
          );
        }
      }
    } else {
      payload = JSON.parse(JSON.stringify(task_params));
    }

    return this.endpoint.invokeRequest(method, path, payload, headers);
  }

  createHeaders<T>(task: WithSignature<T>): Record<string, string> {
    let headers = {
      "x-eth-signature": task.signature,
    };
    return headers;
  }

  omitSignature<T>(task: WithSignature<T>): OmitSignature<T> {
    const { signature, ...task_details } = task;
    return task_details;
  }
}

export enum TaskEndpoint {
  TASK = "/tasks",
  SETUP = "/setup",
  PROVE = "/prove",
  DEPLOY = "/deploy",
  RESET = "/reset",
  MODIFY = "/modify",
  PAY = "/pay",
  LOGS = "/logs",
}

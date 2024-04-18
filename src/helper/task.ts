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
  TransactionInfo,
  AppConfig,
  OmitSignature,
  ModifyImageParams,
  SubscriptionRequest,
  ERC20DepositInfo,
  User,
  Subscription,
} from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
import { ethers } from "ethers";

export class ZkWasmServiceHelper {
  endpoint: ZkWasmServiceEndpoint;

  constructor(endpoint: string, username: string, useraddress: string, enable_logs : boolean = true) {
    this.endpoint = new ZkWasmServiceEndpoint(endpoint, username, useraddress, enable_logs);
  }

  async queryImage(md5: string): Promise<Image> {
    let req = JSON.parse("{}");
    req["md5"] = md5;

    const images = await this.endpoint.invokeRequest("GET", "/image", req);
    if (this.endpoint.enable_logs) {
      console.log("get queryImage response.");
    }
    return images[0]!;
  }

  async queryImageBinary(md5: string): Promise<number[]> {
    let req = JSON.parse("{}");
    req["md5"] = md5;

    const image = await this.endpoint.invokeRequest("GET", "/imagebinary", req);
    if (this.endpoint.enable_logs) {
      console.log("get queryImageBinary response.");
    }
    return image!;
  }

  async queryUser(user_query: UserQueryParams): Promise<User> {
    let req = JSON.parse("{}");
    req["user_address"] = user_query.user_address;

    const user = await this.endpoint.invokeRequest("GET", "/user", req);
    if (this.endpoint.enable_logs) {
      console.log("get queryUser response.");
    }
    return user;
  }

  async queryUserSubscription(
    user_query: UserQueryParams
  ): Promise<Subscription | null> {
    let req = JSON.parse("{}");
    req["user_address"] = user_query.user_address;

    const user = await this.endpoint.invokeRequest(
      "GET",
      "/user_subscription",
      req
    );
    if (this.endpoint.enable_logs) {
      console.log("get queryUserSubscription response.");
    }
    return user;
  }

  async queryTxHistory(
    history_query: TxHistoryQueryParams
  ): Promise<PaginationResult<TransactionInfo[]>> {
    let req = JSON.parse("{}");
    req["user_address"] = history_query.user_address;

    const txs = await this.endpoint.invokeRequest("GET", "/transactions", req);
    if (this.endpoint.enable_logs) {
      console.log("get queryTxHistory response.");
    }
    return txs;
  }

  async queryDepositHistory(
    history_query: TxHistoryQueryParams
  ): Promise<PaginationResult<ERC20DepositInfo[]>> {
    let req = JSON.parse("{}");
    req["user_address"] = history_query.user_address;

    const txs = await this.endpoint.invokeRequest("GET", "/deposits", req);
    if (this.endpoint.enable_logs) {
      console.log("get queryDepositHistory response.");
    }
    return txs;
  }

  async queryConfig(): Promise<AppConfig> {
    const config = await this.endpoint.invokeRequest(
      "GET",
      "/config",
      JSON.parse("{}")
    );
    if (this.endpoint.enable_logs) {
      console.log("get queryConfig response.");
    }
    return config;
  }

  async loadStatistics(): Promise<Statistics> {
    let headers = { "Content-Type": "application/json" };
    let queryJson = JSON.parse("{}");

    let st = await this.endpoint.invokeRequest("GET", `/statistics`, queryJson);
    if (this.endpoint.enable_logs) {
      console.log("loading task board!");
    }

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

    // Validate query params
    if (query.start != null && query.start < 0) {
      throw new Error("start must be positive");
    }
    if (query.total != null && query.total <= 0) {
      throw new Error("total must be positive");
    }

    if (query.id != null && query.id != "") {
      // Validate it is a hex string (mongodb objectid)
      if (!ZkWasmUtil.isHexString(query.id)) {
        throw new Error("id must be a hex string or ");
      }
    }

    if (query.user_address != null && query.user_address != "") {
      // Validate it is a hex string (ethereum address)
      if (!ethers.isAddress(query.user_address)) {
        throw new Error("user_address must be a valid ethereum address");
      }
    }

    if (query.md5 != null && query.md5 != "") {
      // Validate it is a hex string (md5)
      if (!ZkWasmUtil.isHexString(query.md5)) {
        throw new Error("md5 must be a hex string");
      }
    }

    //build query JSON
    let objKeys = Object.keys(query) as Array<keyof QueryParams>;
    objKeys.forEach((key) => {
      if (query[key] != "" && query[key] != null) queryJson[key] = query[key];
    });

    if (this.endpoint.enable_logs) {
      console.log("params:", query);
      console.log("json", queryJson);
    }

    let tasks = await this.endpoint.invokeRequest("GET", `/tasks`, queryJson);
    if (this.endpoint.enable_logs) {
      console.log("loading task board!");
    }
    return tasks;
  }

  async queryLogs(query: WithSignature<LogQuery>): Promise<string> {
    let logs = await this.sendRequestWithSignature(
      "GET",
      TaskEndpoint.LOGS,
      query
    );
    if (this.endpoint.enable_logs) {
      console.log("loading logs!");
    }
    return logs;
  }

  async addPayment(payRequest: PaymentParams) {
    const response = await this.endpoint.invokeRequest(
      "POST",
      TaskEndpoint.PAY,
      JSON.parse(JSON.stringify(payRequest))
    );
    if (this.endpoint.enable_logs) {
      console.log("get addPayment response:", response.toString());
    }
    return response;
  }

  async addSubscription(subscription: SubscriptionRequest) {
    const response = await this.endpoint.invokeRequest(
      "POST",
      TaskEndpoint.SUBSCRIBE,
      JSON.parse(JSON.stringify(subscription))
    );
    if (this.endpoint.enable_logs) {
      console.log("get addSubscription response:", response.toString());
    }
    return response;
  }

  async addNewWasmImage(task: WithSignature<AddImageParams>) {
    let response = await this.sendRequestWithSignature<AddImageParams>(
      "POST",
      TaskEndpoint.SETUP,
      task,
      true
    );

    if (this.endpoint.enable_logs) {
      console.log("get addNewWasmImage response:", response.toString());
    }
    return response;
  }

  async addProvingTask(task: WithSignature<ProvingParams>) {
    let response = await this.sendRequestWithSignature<ProvingParams>(
      "POST",
      TaskEndpoint.PROVE,
      task,
      true
    );
    if (this.endpoint.enable_logs) {
      console.log("get addProvingTask response:", response.toString());
    }
    return response;
  }

  async addDeployTask(task: WithSignature<DeployParams>) {
    let response = await this.sendRequestWithSignature<DeployParams>(
      "POST",
      TaskEndpoint.DEPLOY,
      task
    );
    if (this.endpoint.enable_logs) {
      console.log("get addDeployTask response:", response.toString());
    }
    return response;
  }

  async addResetTask(task: WithSignature<ResetImageParams>) {
    let response = await this.sendRequestWithSignature<ResetImageParams>(
      "POST",
      TaskEndpoint.RESET,
      task,
      true
    );

    if (this.endpoint.enable_logs) {
      console.log("get addResetTask response:", response.toString());
    }
    return response;
  }

  async modifyImage(data: WithSignature<ModifyImageParams>) {
    let response = await this.sendRequestWithSignature<ModifyImageParams>(
      "POST",
      TaskEndpoint.MODIFY,
      data
    );

    if (this.endpoint.enable_logs) {
      console.log("get modifyImage response:", response.toString());
    }
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
        // append if the data is not null | undefined
        if (
          task_params[key as keyof typeof task_params] != null &&
          task_params[key as keyof typeof task_params] != undefined
        ) {
          // if the data is an array, append each element with the same key (multipart form data array usage)
          if (Array.isArray(task_params[key as keyof typeof task_params])) {
            for (const element of task_params[
              key as keyof typeof task_params
            ] as Array<unknown>) {
              payload.append(key, element as string);
            }
          } else {
            payload.append(
              key,
              task_params[key as keyof typeof task_params] as string
            );
          }
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
  SUBSCRIBE = "/subscribe",
  LOGS = "/logs",
}

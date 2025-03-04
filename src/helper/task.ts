import FormData from "form-data";
import { ZkWasmUtil } from "./util.js";
import {
  QueryParams,
  TaskExternalHostTableParams,
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
  TaskExternalHostTable,
  Image,
  TransactionInfo,
  AppConfig,
  OmitSignature,
  ModifyImageParams,
  SubscriptionRequest,
  ERC20DepositInfo,
  User,
  Subscription,
  PaginatedQuery,
  AutoSubmitProofQuery,
  Round1InfoQuery,
  Round1Info,
  Round2Info,
  Round2InfoQuery,
  AutoSubmitProof,
  ConciseTask,
  NodeStatistics,
  NodeStatisticsQueryParams,
  SetMaintenanceModeParams,
  ProverNodesSummary,
  OnlineNodesSummary,
  EstimatedProofFeeParams,
  EstimatedProofFee,
} from "../interface/interface.js";
import { ZkWasmServiceEndpoint } from "./endpoint.js";
import { ethers } from "ethers";

export class ZkWasmServiceHelper {
  endpoint: ZkWasmServiceEndpoint;

  constructor(
    endpoint: string,
    username: string,
    useraddress: string,
    enable_logs: boolean = true
  ) {
    this.endpoint = new ZkWasmServiceEndpoint(
      endpoint,
      username,
      useraddress,
      enable_logs
    );
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

  async queryNodeStatistics(
    query: NodeStatisticsQueryParams
  ): Promise<PaginationResult<NodeStatistics[]>> {
    let headers = { "Content-Type": "application/json" };
    let queryJson = JSON.parse(JSON.stringify(query));

    let res = await this.endpoint.invokeRequest(
      "GET",
      `/node_statistics`,
      queryJson
    );
    if (this.endpoint.enable_logs) {
      console.log("loading node statistics");
    }

    return res as PaginationResult<NodeStatistics[]>;
  }

  async queryProverNodeSummary(): Promise<ProverNodesSummary> {
    let headers = { "Content-Type": "application/json" };

    let res = await this.endpoint.invokeRequest(
      "GET",
      `/prover_node_summary`,
      JSON.parse("{}")
    );
    if (this.endpoint.enable_logs) {
      console.log("loading node summary");
    }

    return res as ProverNodesSummary;
  }

  async queryOnlineNodesSummary(): Promise<OnlineNodesSummary> {
    let headers = { "Content-Type": "application/json" };

    let res = await this.endpoint.invokeRequest(
      "GET",
      TaskEndpoint.ONLINE_NODES_SUMMARY,
      JSON.parse("{}")
    );
    if (this.endpoint.enable_logs) {
      console.log("loading node summary");
    }

    return res as OnlineNodesSummary;
  }

  async loadTasks(query: QueryParams): Promise<PaginationResult<Task[]>> {
    // Validate query params
    if (query.start != null && query.start < 0) {
      throw new Error("start must be positive");
    }

    // If total is not set then default will be used 
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

    // build query JSON
    let queryJson = JSON.parse("{}");
    let objKeys = Object.keys(query) as Array<keyof QueryParams>;
    objKeys.forEach((key) => {
      if (query[key] != "" && query[key] != null)
        queryJson[key] = query[key];
    });

    if (this.endpoint.enable_logs) {
      console.log("params:", query);
      console.log("json", queryJson);
    }

    let tasks = (await this.endpoint.invokeRequest(
      "GET",
      `/tasks`,
      queryJson
    )) as PaginationResult<Task[]>;
    if (this.endpoint.enable_logs) {
      console.log("loading task board!");
    }

    tasks.data.forEach((task) => {
      // Convert the corresponding proof fields into Uint8Array from number[] (json)
      task.instances = new Uint8Array(task.instances);
      task.proof = new Uint8Array(task.proof);
      task.batch_instances = new Uint8Array(task.batch_instances);
      task.shadow_instances = new Uint8Array(task.shadow_instances);
      task.single_proof = new Uint8Array(task.single_proof);
      task.aux = new Uint8Array(task.aux);
      task.input_context = new Uint8Array(task.input_context);
      task.output_context = new Uint8Array(task.output_context);
      if (task.task_fee) {
        task.task_fee = new Uint8Array(task.task_fee);
      }
    });

    return tasks;
  }

  async getTasksDetailFromIds(ids: string[]): Promise<Task[]> {
    const MAX_TASKS_DB_QUERY_RETURN_SIZE = 10;

    if (ids.length > MAX_TASKS_DB_QUERY_RETURN_SIZE) {
      throw new Error(`Cannot be larger than max ${MAX_TASKS_DB_QUERY_RETURN_SIZE}`);
    }

    let tasks = []
    for (const id in ids) {
      const query: QueryParams = {
        user_address: null,
        md5: null,
        id: id,
        tasktype: null,
        taskstatus: null,
      };
      const task = await this.loadTasks(query);
      tasks.push(task.data[0]);
    }

    return tasks;
  }

  async getTaskDetailFromId(ids: string): Promise<Task> {
    return (await this.getTasksDetailFromIds([ids]))[0];
  }

  async loadTaskList(
    query: QueryParams
  ): Promise<PaginationResult<ConciseTask[]>> {
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

    let tasks = await this.endpoint.invokeRequest(
      "GET",
      `/tasklist`,
      queryJson
    );
    if (this.endpoint.enable_logs) {
      console.log("loading task board!");
    }
    return tasks;
  }

  async getTaskExternalHostTable(
    query: TaskExternalHostTableParams
  ): Promise<TaskExternalHostTable> {
    let queryJson = JSON.parse(JSON.stringify(query));
    let res = await this.endpoint.invokeRequest(
      "GET",
      `/task_external_host_table`,
      queryJson
    ) as TaskExternalHostTable;
    if (this.endpoint.enable_logs) {
      console.log("fetching external host table");
    }

    // Convert the external host table to Uint8Array.
    res.external_host_table = new Uint8Array(res.external_host_table);
    return res;
  }

  async queryAutoSubmitProofs(
    query: PaginatedQuery<AutoSubmitProofQuery>
  ): Promise<PaginationResult<AutoSubmitProof[]>> {
    let proofData = (await this.endpoint.invokeRequest(
      "GET",
      TaskEndpoint.ROUND_1_BATCH,
      JSON.parse(JSON.stringify(query))
    )) as PaginationResult<AutoSubmitProof[]>;
    if (this.endpoint.enable_logs) {
      console.log("loading proof data!");
    }

    // Convert the corresponding proof fields into Uint8Array from number[] (json)
    proofData.data.forEach((proof) => {
      proof.proof = new Uint8Array(proof.proof);
      proof.aux = new Uint8Array(proof.aux);
      proof.batch_instances = new Uint8Array(proof.batch_instances);
      if (proof.shadow_instances) {
        proof.shadow_instances = new Uint8Array(proof.shadow_instances);
      }
    });

    return proofData;
  }

  async queryRound1Info(
    query: PaginatedQuery<Round1InfoQuery>
  ): Promise<PaginationResult<Round1Info[]>> {
    let proofData = (await this.endpoint.invokeRequest(
      "GET",
      TaskEndpoint.ROUND_2_BATCH,
      JSON.parse(JSON.stringify(query))
    )) as PaginationResult<Round1Info[]>;
    if (this.endpoint.enable_logs) {
      console.log("loading proof data!");
    }

    // Convert the corresponding proof fields into Uint8Array from number[] (json)
    proofData.data.forEach((proof) => {
      proof.proof = new Uint8Array(proof.proof);
      proof.aux = new Uint8Array(proof.aux);
      proof.batch_instances = new Uint8Array(proof.batch_instances);
      if (proof.shadow_instances) {
        proof.shadow_instances = new Uint8Array(proof.shadow_instances);
      }
      proof.target_instances = proof.target_instances.map((instance) => {
        return new Uint8Array(instance);
      });
    });

    return proofData;
  }

  async queryRound2Info(
    query: PaginatedQuery<Round2InfoQuery>
  ): Promise<PaginationResult<Round2Info[]>> {
    let proofData = (await this.endpoint.invokeRequest(
      "GET",
      TaskEndpoint.FINAL_BATCH,
      JSON.parse(JSON.stringify(query))
    )) as PaginationResult<Round2Info[]>;
    if (this.endpoint.enable_logs) {
      console.log("loading proof data!");
    }
    // Convert the corresponding proof fields into Uint8Array from number[] (json)
    proofData.data.forEach((proof) => {
      proof.proof = new Uint8Array(proof.proof);
      proof.aux = new Uint8Array(proof.aux);
      proof.batch_instances = new Uint8Array(proof.batch_instances);
      if (proof.shadow_instances) {
        proof.shadow_instances = new Uint8Array(proof.shadow_instances);
      }
      proof.target_instances = proof.target_instances.map((instance) => {
        return new Uint8Array(instance);
      });
    });
    return proofData;
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
      console.log("get addProvingTask response:", response);
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

  async setMaintenanceMode(req: WithSignature<SetMaintenanceModeParams>) {
    let response =
      await this.sendRequestWithSignature<SetMaintenanceModeParams>(
        "POST",
        TaskEndpoint.SET_MAINTENANCE_MODE,
        req,
        true
      );
    if (this.endpoint.enable_logs) {
      console.log("setMaintenanceMode response:", response.toString());
    }
    return response;
  }

  async queryEstimateProofFee(
    query: EstimatedProofFeeParams
  ): Promise<EstimatedProofFee> {
    const config = await this.endpoint.invokeRequest(
      "GET",
      TaskEndpoint.GET_ESTIMATED_PROOF_FEE,
      JSON.parse(JSON.stringify(query))
    );
    if (this.endpoint.enable_logs) {
      console.log("get queryEstimateProofFee response.");
    }
    return config;
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
  SET_MAINTENANCE_MODE = "/admin/set_maintenance_mode",
  SUBSCRIBE = "/subscribe",
  LOGS = "/logs",
  ROUND_1_BATCH = "/round1_batch_proofs",
  ROUND_2_BATCH = "/round2_batch_proofs",
  FINAL_BATCH = "/final_batch_proofs",
  GET_ESTIMATED_PROOF_FEE = "/estimated_proof_fee",
  ONLINE_NODES_SUMMARY = "/online_nodes_summary",
}

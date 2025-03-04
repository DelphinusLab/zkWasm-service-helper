import {
  ZkWasmUtil,
  QueryParams,
  PaginationResult,
  Task,
  CompressionType,
  TaskExternalHostTableParams,
  TaskExternalHostTable,
  ConciseTask,
} from "zkwasm-service-helper";
import BN from "bn.js";
import { ServiceHelper } from "../config";
import * as fs from "fs";


// Provide the query parameters, all fields are optional
// const args: QueryParams = {
//   id: taskid!,
//   md5: null,
//   user_address: null,
//   tasktype: null,
//   taskstatus: null,
// };

// Note: `queryTasks` provides task detail such as `aggregate_proof`, `instances`, `batchInstances`, `aux`
// and `task_fee`. For most queries `queryConciseTasks` will suffice and be more performant. It is 
// recommended that for general queries, `queryConciseTasks` approach should be used and if task detail 
// is required, it should be done by querying with the id, see example `queryConciseThenDetail`.
export async function queryTasks(queryParams: QueryParams) {
  const response: PaginationResult<Task[]> = await ServiceHelper.loadTasks(
    queryParams
  );
  const task: Task = response.data[0];

  // convert the byte array to BN
  let aggregate_proof = ZkWasmUtil.bytesToBN(task.proof);
  let instances = ZkWasmUtil.bytesToBN(task.instances);
  let batchInstances = ZkWasmUtil.bytesToBN(task.batch_instances);
  let aux = ZkWasmUtil.bytesToBN(task.aux);
  let fee = task.task_fee && ZkWasmUtil.convertAmount(task.task_fee);

  console.log("Task details: ");
  console.log("    ", task);
  console.log("proof:");
  aggregate_proof.map((proof: BN) => {
    console.log("0x", proof.toString("hex"));
  });
  console.log("batch_instacne:");
  batchInstances.map((ins: BN) => {
    console.log("0x", ins.toString("hex"));
  });
  console.log("instance:");
  instances.map((ins: BN) => {
    console.log("0x", ins.toString("hex"));
  });
  console.log("    aux:");
  aux.map((aux: BN) => {
    console.log("0x", aux.toString("hex"));
  });
  console.log("fee:", fee);

  return response;
}

// Provide the query parameters, all fields are optional
// const args: QueryParams = {
//   id: taskid!,
//   md5: null,
//   user_address: null,
//   tasktype: null,
//   taskstatus: null,
// };

export async function queryConciseTasks(queryParams: QueryParams) {
  const response: PaginationResult<ConciseTask[]> = await ServiceHelper.loadTaskList(
    queryParams
  );
  const task: ConciseTask = response.data[0];
  console.log("Task ID", task._id);
  console.log("Task user address", task.user_address);
  console.log("Task md5", task.md5);
  console.log("Task status", task.status);
  console.log("Task type", task.task_type);
  console.log("Task submit time", task.submit_time);
  console.log("Task start time", task.process_started);
  console.log("Task finish time", task.process_finished);
  console.log("Task auto submit status", task.auto_submit_status);
  console.log("Task proof submit mode", task.proof_submit_mode);

  return response;
}

export async function queryConciseThenDetail(queryParams: QueryParams) {
  // Query concise task 
  const concise = await queryConciseTasks(queryParams);

  // Get the id of the task
  const id = concise.data[0]._id as string;
  const queryById: QueryParams = {
    id: id,
    md5: null,
    user_address: null,
    tasktype: null,
    taskstatus: null,
  };


  // Query task detail with task id
  const taskDetail = await queryTasks(queryById);

  console.log("Task detail fetched by id", taskDetail.data[0]._id);
}

// Provide the id of the task which has the desired external host table file.
// export interface TaskExternalHostTableParams {
//   id: string;
// }

export async function queryTaskExternalHostTable(queryParams: TaskExternalHostTableParams) {
  const response: TaskExternalHostTable = await ServiceHelper.getTaskExternalHostTable(
    queryParams
  );
  const externalHostTable = response.external_host_table;
  const compressionType = response.compression;

  console.log("Compression type of external host table json:", compressionType);
  // Wrap this in Uint8Array because it's "real" type is a number array.
  // There's no logic impact but the change to the API is big so it will have
  // to be fixed later.
  // https://delphinuslab.atlassian.net/browse/ZKWAS-361
  const externalHostFileBytes = new Uint8Array(externalHostTable);
  const filename = `external_host_table${compressionType === CompressionType.GZip ? ".tar.gz" : ".json"}`;
  fs.writeFileSync(filename, externalHostFileBytes);
  console.log(`External host table file is ${filename}`);
  return response;
}

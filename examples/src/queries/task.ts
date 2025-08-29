import {
  ZkWasmUtil,
  QueryParams,
  PaginationResult,
  Task,
  CompressionType,
  TaskExternalHostTableParams,
  TaskExternalHostTable,
  ProverNodeTimeRangeStats,
  ProverNodeTimeRangeStatsParams,
} from "zkwasm-service-helper";
import BN from "bn.js";
import {
  ServiceHelper,
  MD5_TO_QUERY,
  TASK_ID_TO_QUERY,
  NODE_ADDRESS_TO_QUERY,
} from "../config";
import * as fs from "fs";

// Note: `ServiceHelper.loadTasks` provides task detail such as `aggregate_proof`, `instances`, `aux`,
// `task_fee` and `batchInstances`. For most queries `ServiceHelper.loadTaskList` will suffice and will be
// more performant.
//
// It is recommended that for general queries, `ServiceHelper.loadTaskList` should be used and if task detail
// is required, it should be done by querying with the id using `ServiceHelper.getTaskDetailFromId`.
// Both `ServiceHelper.getTaskDetailFromId` and `ServiceHelper.getTasksDetailFromIds` will have the least
// amount of latency for retrieving task details. See example `queryOneTaskIdThenDetail` and
// `queryMultipleTaskIdThenDetail`.
//
// Additionally, `ServiceHelper.loadTaskList` is able to return more tasks in a single query. This is because
// `ServiceHelper.loadTasks` has a limit of 10 results per query, and `ServiceHelper.loadTaskList` has a
// limit of 100 results per query.

// QueryParams structure, required as input for query functions, provides the query parameters, all fields
// are optional but at least one should be specified.
// const args: QueryParams = {
//   id: null,
//   md5: null,
//   user_address: null,
//   tasktype: null,
//   taskstatus: null,
// };

// Example of using `ServiceHelper.loadTasks` to fetch multiple tasks objects with complete detail. This
// approach is not recommended, instead use the approach in `queryOneTaskIdThenDetail`.
export async function queryTasks(queryParams: QueryParams) {
  console.log("Running query tasks with params", queryParams);

  const response: PaginationResult<Task[]> =
    await ServiceHelper.loadTasks(queryParams);
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

// Example of using ServiceHelper.loadTaskList to fetch multiple tasks objects with concise detail.
export async function queryTaskList(queryParams: QueryParams) {
  console.log("Running query task list with params", queryParams);

  const response = await ServiceHelper.loadTaskList(queryParams);
  const task = response.data[0];

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

// Example of using `ServiceHelper.loadTaskList` to fetch one task and then using id retrieved to fetch
// complete details with the `ServiceHelper.getTaskDetailFromId` API.
export async function queryOneTaskIdThenDetail(queryParams: QueryParams) {
  console.log("Running query one task id then detail with params", queryParams);

  // Query concise task
  const concise = await ServiceHelper.loadTaskList(queryParams);

  // Get the id of the task
  const id = concise.data[0]._id["$oid"] as string;

  // Query task detail with task id
  const taskDetail = await ServiceHelper.getTaskDetailFromId(id);
  if (taskDetail === null) {
    console.log("No task with id found with query", queryParams);
  } else {
    console.log("Task detail fetched by id", taskDetail);
  }
}

// Example of using `ServiceHelper.loadTaskList` to fetch multiple tasks and then using their ids to fetch
// complete details with the `ServiceHelper.getTasksDetailFromIds` API.
export async function queryMultipleTaskIdThenDetail(queryParams: QueryParams) {
  console.log(
    "Running query multiple task ids then detail with params",
    queryParams
  );

  // Query concise task
  const concise = await ServiceHelper.loadTaskList(queryParams);

  // Get the ids of the task
  const ids = concise.data.map((task) => task._id["$oid"] as string);

  // Query task detail with task id
  const taskDetails = await ServiceHelper.getTasksDetailFromIds(ids);
  if (taskDetails.length === 0) {
    console.log("No tasks with id found with query", queryParams);
  } else {
    console.log("Task detail fetched by id", taskDetails);
  }
}

// Provide the id of the task which has the desired external host table file.
// export interface TaskExternalHostTableParams {
//   id: string;
// }
//
// Example of using `ServiceHelper.getTaskExternalHostTable` to fetch the external host table of a task.
export async function queryTaskExternalHostTable(
  queryParams: TaskExternalHostTableParams
) {
  console.log(
    "Running query task external host table with params",
    queryParams
  );

  const response: TaskExternalHostTable =
    await ServiceHelper.getTaskExternalHostTable(queryParams);
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

// Example of using `ServiceHelper.queryProverNodeTimeRangeStats` to stats.
export async function queryProverNodeTimeRangeStats(
  query: ProverNodeTimeRangeStatsParams
) {
  console.log("Running query prover node timerange stats with params", query);
  const response: ProverNodeTimeRangeStats[] =
    await ServiceHelper.queryProverNodeTimeRangeStats(query);
  console.log(response);
  return response;
}

async function runQueries() {
  await queryTasks({
    id: null,
    md5: MD5_TO_QUERY!,
    user_address: null,
    tasktype: null,
    taskstatus: null,
  });

  await queryTaskList({
    id: null,
    md5: MD5_TO_QUERY!,
    user_address: null,
    tasktype: null,
    taskstatus: null,
  });

  await queryOneTaskIdThenDetail({
    id: null,
    md5: MD5_TO_QUERY!,
    user_address: null,
    tasktype: null,
    taskstatus: null,
  });

  await queryMultipleTaskIdThenDetail({
    id: null,
    md5: MD5_TO_QUERY!,
    user_address: null,
    tasktype: null,
    taskstatus: null,
  });

  await queryTaskExternalHostTable({
    id: TASK_ID_TO_QUERY!,
  });

  const now = new Date();
  await queryProverNodeTimeRangeStats({
    ranges: [
      {
        address: NODE_ADDRESS_TO_QUERY!,
        start: new Date(new Date().setMonth(now.getMonth() - 1)),
        end: now,
      },
      {
        address: NODE_ADDRESS_TO_QUERY!,
        start: new Date(new Date().setMonth(now.getMonth() - 4)),
        end: new Date(new Date().setMonth(now.getMonth() - 2)),
      },
      {
        address: NODE_ADDRESS_TO_QUERY!,
        start: new Date(new Date().setMonth(now.getMonth() - 5)),
        end: new Date(new Date().setMonth(now.getMonth() - 4)),
      },
    ],
  });
}

runQueries();

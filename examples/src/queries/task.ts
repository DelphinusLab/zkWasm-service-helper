import {
  ZkWasmUtil,
  QueryParams,
  PaginationResult,
  Task,
  CompressionType,
  TaskExternalHostTableParams,
  TaskExternalHostTable,
} from "zkwasm-service-helper";
import BN from "bn.js";
import { ServiceHelper } from "../config";
import { gunzipSync } from 'zlib';

// Provide the query parameters, all fields are optional
// const args: QueryParams = {
//   id: taskid!,
//   md5: null,
//   user_address: null,
//   tasktype: null,
//   taskstatus: null,
// };

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
  const externalHostFileData =
    compressionType === CompressionType.GZip
      ? gunzipSync(Buffer.from(externalHostFileBytes))
      : Buffer.from(externalHostFileBytes);
  console.log("External host table json:");
  console.log(externalHostFileData.toString());

  return response;
}

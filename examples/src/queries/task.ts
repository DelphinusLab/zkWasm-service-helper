import {
  ZkWasmServiceHelper,
  ZkWasmUtil,
  QueryParams,
  PaginationResult,
  Task,
} from "zkwasm-service-helper";
import BN from "bn.js";
import { ServiceHelper } from "../config";

// Provide the query parameters, all fields are optional
// const args: QueryParams = {
//   id: taskid!,
//   md5: null,
//   user_address: null,
//   tasktype: null,
//   taskstatus: null,
// };

export async function QueryTasks(queryParams: QueryParams) {
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

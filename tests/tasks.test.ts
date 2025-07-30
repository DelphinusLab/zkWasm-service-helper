import * as fs from "fs";
import { ZkWasmUtil } from "../dist/mjs/helper/util";
import {
  ModifyImageParams,
  ResetImageParams,
  ProvingParams,
  ProvePaymentSrc,
  AddImageParams,
  ProofSubmitMode,
  AddProveTaskRestrictions,
} from "../dist/mjs/interface/interface";
import { CONFIG, USER_ADDRESS, ZKH } from "./util";

interface AddTaskResult {
  id: string;
  md5: string;
}

function readWasm(path: string): [Buffer, string] {
  const buffer: Buffer = fs.readFileSync(path);
  const md5 = ZkWasmUtil.convertToMd5(buffer as Uint8Array);
  return [buffer, md5];
}

async function waitForDoneTask(id: string): Promise<void> {
  while (true) {
    const res = await ZKH.getTaskDetailFromId(id);
    if (!res) {
      throw new Error("Should be able to query task");
    }
    if (res.status === "Done") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

async function runSetupImage(): Promise<[string, string]> {
  const [buffer, md5] = readWasm(CONFIG.tasks.image);
  let params: AddImageParams = {
    name: md5,
    image_md5: md5,
    image: buffer,
    user_address: USER_ADDRESS,
    description_url: "ZKP CLI test image " + md5,
    avator_url: "",
    circuit_size: 22,
    prove_payment_src: ProvePaymentSrc.Default,
    auto_submit_network_ids: [CONFIG.details.chain_id],
    add_prove_task_restrictions: AddProveTaskRestrictions.Anyone,
    inherited_merkle_data_md5: undefined,
  };
  let signature = await ZkWasmUtil.signMessage(
    ZkWasmUtil.createAddImageSignMessage(params),
    CONFIG.details.private_key,
  );
  const res = (await ZKH.addNewWasmImage({
    ...params,
    signature,
  })) as AddTaskResult;
  return [res.id, res.md5];
}

async function runProveImage(md5: string): Promise<string> {
  let params: ProvingParams = {
    user_address: USER_ADDRESS,
    md5: md5,
    public_inputs: [],
    private_inputs: [],
    proof_submit_mode: ProofSubmitMode.Manual,
  };
  let signature = await ZkWasmUtil.signMessage(
    ZkWasmUtil.createProvingSignMessage(params),
    CONFIG.details.private_key,
  );
  const res = (await ZKH.addProvingTask({
    ...params,
    signature,
  })) as AddTaskResult;
  return res.id;
}

async function runResetImage(md5: string): Promise<string> {
  let params: ResetImageParams = {
    md5: md5,
    circuit_size: 22,
    user_address: USER_ADDRESS,
    prove_payment_src: ProvePaymentSrc.Default,
    auto_submit_network_ids: [CONFIG.details.chain_id],
    add_prove_task_restrictions: AddProveTaskRestrictions.Anyone,
  };
  let signature = await ZkWasmUtil.signMessage(
    ZkWasmUtil.createResetImageMessage(params),
    CONFIG.details.private_key,
  );
  const res = (await ZKH.addResetTask({
    ...params,
    signature,
  })) as AddTaskResult;
  return res.id;
}

async function runModifyImage(md5: string): Promise<void> {
  let params: ModifyImageParams = {
    md5: md5,
    user_address: USER_ADDRESS,
    description_url: "ZKP CLI test image " + md5 + " -- modified",
    avator_url: "",
  };
  let signature = await ZkWasmUtil.signMessage(
    ZkWasmUtil.createModifyImageMessage(params),
    CONFIG.details.private_key,
  );
  await ZKH.modifyImage({
    ...params,
    signature,
  });
}

describe("Tasks", () => {
  test("Test image tasks sequentially", async () => {
    const [setupId, md5] = await runSetupImage();
    await waitForDoneTask(setupId);

    const proveId = await runProveImage(md5);
    await waitForDoneTask(proveId);

    const resetId = await runResetImage(md5);
    await waitForDoneTask(resetId);

    await runModifyImage(md5);
  }, 180_000);
});

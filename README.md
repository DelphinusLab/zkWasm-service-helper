# zkWasm-service-helper

## Introduction

This lib is to help communicate with zkwasm service

## How to use it

This lib main provide a ZkWasmServiceHelper class to help user to communicate to zkwasm service backend.
It mainly provide API to add tasks and get informations to zkwasm service backend.

like:

- async queryImage(md5: string);
- async loadTasks(query: QueryParams);
- async addNewWasmImage(task: WithSignature<AddImageParams>);
- async addProvingTask(task: WithSignature<ProvingParams>);

### A example to add new wasm image

This example typescript code will add the wasm image to the zkwasm service.

```typescript
import {
  AddImageParams,
  WithSignature,
  ZkWasmUtil,
  zkWasmServiceHelper,
  ProvePaymentSrc,
} from "zkwasm-service-helper";

const endpoint = ""https://rpc.zkwasmhub.com:8090";
let helper = new ZkWasmServiceHelper(endpoint, "", "");
let imagePath = "/home/user/a.wasm";
let fileSelected: Buffer = fs.readFileSync(imagePath);
let md5 = ZkWasmUtil.convertToMd5(
        fileSelected as Uint8Array
      );

let info: AddImageParams = {
        name: fileSelected.name,
        image_md5: md5,
        image: fileSelected,
        user_address: account!.address.toLowerCase(),
        description_url: "",
        avator_url: "",
        circuit_size: circuitSize,

        // Determines whether the credits will be deducted from the user supplying proof requests (default) or the user who created the image
        // Currently Enum values are Default and CreatorPay
        prove_payment_src: ProvePaymentSrc.Default,

        // Networks which the auto submit service will batch and submit the proof to.
        // Unsupported networks will be rejected.
        // If empty array, Auto Submitted proofs will be rejected.
        auto_submit_network_ids: [97, 1, 11155111]
      };

// Optional Initial Context information

// Upload a binary file first
let contextFile = await ZkWasmUtil.loadContexFileAsBytes("<YourFilePath>");

if (contextFile) {
  let context_info: WithInitialContext = {
    initial_context: contextFile,
    initial_context_md5: ZkWasmUtil.convertToMd5(contextFile),
  };
  info = { ...info, ...context_info };
}

let msg = ZkWasmUtil.createAddImageSignMessage(info);
let signature: string = await ZkWasmUtil.signMessage(msgString, priv); //Need user private key to sign the msg
let task: WithSignature<AddImageParams> = {
        ...info,
        signature,
      };

let response = await helper.addNewWasmImage(task);

```

### A example to add proving tasks

This example typescript code will add proving tasks to the zkwasm service.

```typescript
import {
  ProvingParams,
  WithSignature,
  ZkWasmUtil,
  zkWasmServiceHelper
} from "zkwasm-service-helper";

const endpoint = ""https://rpc.zkwasmhub.com:8090";
const image_md5 = "xxxx";
const public_inputs = "0x22:i64 0x21:i64";
const private_inputs = "";
const user_addr = "0xaaaaaa";

let helper = new ZkWasmServiceHelper(endpoint, "", "");
let pb_inputs: Array<string> = helper.parseProvingTaskInput(public_inputs);
let priv_inputs: Array<string> = helper.parseProvingTaskInput(private_inputs);

// Use the helper Enum type to determine the proof submit mode
let proofSubmitMode = ProofSubmitMode.Auto ? ProofSubmitMode.Auto : ProofSubmitMode.Manual;

let info: ProvingParams = {
  user_address: user_addr.toLowerCase(),
  md5: image_md5,
  public_inputs: pb_inputs,
  private_inputs: priv_inputs,
  // Whether the proof will be batched and verified through the auto submit service or manually submitted.
  // If the field is not specified, the default value will be ProofSubmitMode.Manual and the proof will not be batched.
  proof_submit_mode: proofSubmitMode,
};

// Context type for proof task. If none provided, will default to InputContextType.ImageCurrent in the server and use the image's current context
let selectedInputContextType = InputContextType.ImageCurrent;

// For Custom Context, upload a binary file first containing the context.
if (selectedInputContextType === InputContextType.Custom) {

  let contextFile = await ZkWasmUtil.loadContexFileAsBytes("<YourFilePath>");

  let context_info: WithCustomInputContextType = {
    input_context: contextFile,
    input_context_md5: ZkWasmUtil.convertToMd5(contextFile),
    input_context_type: selectedInputContextType,
  };
  info = { ...info, ...context_info };
} else {
  info = { ...info, input_context_type: selectedInputContextType };
}
let msgString = ZkWasmUtil.createProvingSignMessage(info);

let signature: string;
try {
  signature = await ZkWasmUtil.signMessage(msgString, priv);
} catch (e: unknown) {
  console.log("error signing message", e);
  return;
}

let task: WithSignature<ProvingParams> = {
  ...info,
  signature: signature,
};

let response = await helper.addProvingTask(task);
```

### Verifying a proof

This example typescript code will verify a proof which utilises Delphinus' web3subscriber library.
You can also do this with `ethers.js` or `web3.js` given the ABI and address of the aggregator verifier contract.
the ABI can be accessed from the `ZkWasmUtil` class.

```typescript
import {
  VerifyProofParams,
  ZkWasmUtil,
  Task,
  VerifyBatchProofParams,
} from "zkwasm-service-helper";
import { withBrowserConnector } from "web3subscriber/src/client";
import { DelphinusBrowserConnector } from "web3subscriber/src/provider";

async function VerifyProof() {
  // Fetch a task from the playground service which contains the proof information
  // See the example to build query function to fetch task details
  const task: Task = await fetchTaskFromService();

  await withBrowserConnector(async (connector: DelphinusBrowserConnector) => {
    let chainidhex = "0x" + selectedChainId!.toString(16);
    await connector.switchNet(chainidhex);

    let contract = await ZkWasmUtil.composeVerifyContract(
      connector,
      aggregator_verifier_address
    );

    // If the proof has no shadow instances, use the batch instances to try and verify instead.
    // Mostly for legacy purposes.
    // Proofs submitted with Auto Submit will not be verified using this method.
    // See below for an example of verifying a proof which has been batched with the Auto Submitted Proof service.
    let verify_instance =
      task.shadow_instances.length === 0
        ? task.batch_instances
        : task.shadow_instances;

    let proofParams: VerifyProofParams = {
      aggregate_proof: task.proof,
      shadow_instances: verify_instance,
      aux: task.aux,
      instances: [task.target_instances], // The target instances are wrapped in an array
    };

    let tx = await ZkWasmUtil.verifyProof(
      contract.getEthersContract(),
      proofParams
    );
    // wait for tx to be mined, can add no. of confirmations as arg
    await tx.wait();

    console.log("transaction:", tx.hash);
  });
}
```

### Verifying a batched proof

This example typescript code will verify a batched proof which utilises Delphinus' web3subscriber library.

```typescript
import {
  VerifyBatchProofParams,
  ZkWasmUtil,
  Task,
  Round2BatchProof,
  VerifyBatchProofParams,
  AutoSubmitStatus,
} from "zkwasm-service-helper";
import { withBrowserConnector } from "web3subscriber/src/client";
import { DelphinusBrowserConnector } from "web3subscriber/src/provider";

async function VerifyBatchedProof() {
  // Fetch a task from the playground service which contains the proof information
  // See the example to build query function to fetch task details
  const task: Task = await fetchAutoSubmittedTask();

  // First we need to ensure that the Batched Round2/Final Proof has been registered on chain by the Auto Submit Service
  const isRegistered =
    task.auto_submit_status === AutoSubmitStatus.RegisteredProof;

  console.log("Is proof registered:", isRegistered);
  // If the final batch proof has not been registered, we should not attempt to verify it as the transaction will fail.

  // We should then fetch the Round 1 Batch Output information given the task id

  const Round1Proof: Round2BatchProof = await fetchRound1Output(
    task._id["$oid"]
  );

  // Convert the Number[] into bytes/Uint8Array
  const round_1_target_instances: Array<Uint8Array> =
    round_1_output.target_instances.map((x) => {
      return new Uint8Array(x);
    });

  // Convert the Number[] into bytes/Uint8Array
  const round_1_shadow_instances: Uint8Array = new Uint8Array(
    round_1_output.shadow_instances!
  );

  // Find the index of this proof in the round 1 output by comparing task_ids
  // This will be used to verify that this proof was included in a particular batch.
  // If it does not exist, the verification will fail
  const index = round_1_output.task_ids.findIndex(
    (id) => id === task._id["$oid"]
  );

  await withBrowserConnector(async (connector: DelphinusBrowserConnector) => {
    let chainidhex = "0x" + selectedChainId!.toString(16);
    await connector.switchNet(chainidhex);

    let contract = await ZkWasmUtil.composeBatchVerifierContract(
      connector,
      aggregator_verifier_address
    );

    // The params are as follows:
    // membership_proof_index: The index of the proof amongst the sibling instances
    // verify_instance: The shadow instances of the initial task
    // sibling_instances: The target_instances used in the same round 1 batch proof
    // round_1_shadow_instance: The shadow instances of the round 1 batch proof
    // target_instances: The target instances of the initial task

    let proof_info: VerifyBatchProofParams = {
      membership_proof_index: [BigInt(index)],
      verify_instance: task.shadow_instances,
      sibling_instances: round_1_target_instances,
      round_1_shadow_instance: round_1_shadow_instances,
      target_instances: [task.instances],
    };

    let tx = await ZkWasmUtil.verifyBatchedProof(
      contract.getEthersContract(),
      proofParams
    );
    // wait for tx to be mined, can add no. of confirmations as arg
    await tx.wait();

    console.log("transaction:", tx.hash);
  });
}

verifyBatchedProof();
```

### A example to query task details

This example typescript code will query task details:

```typescript
import {
    ZkWasmServiceHelper,
    ZkWasmUtil,
    QueryParams,
    PaginationResult,
    Task,
} from "zkwasm-service-helper";
import BN from "bn.js";

const endpoint = ""https://rpc.zkwasmhub.com:8090";
const taskid = "xxxx"

let helper = new ZkWasmServiceHelper(endpoint, "", "");
    let args: QueryParams = {
        id: taskid!,
        user_address: null, // null can also be empty string "" to ignore fields in the query filter
        tasktype: null,
        taskstatus: null,
    };
    helper.loadTasks(args).then((res) => {
        const tasks = res as PaginationResult<Task[]>;
        const task: Task = tasks.data[0];
        let aggregate_proof = ZkWasmUtil.bytesToBN(task.proof);
        let instances = ZkWasmUtil.bytesToBN(task.instances);
        let batchInstances = ZkWasmUtil.bytesToBN(task.batch_instances);
        let aux = ZkWasmUtil.bytesToBN(task.aux);
        let fee = task.task_fee && ZkWasmUtil.convertAmount(task.task_fee);

        console.log("Task details: ");
        console.log("    ", task);
        console.log("    proof:");
        aggregate_proof.map((proof: BN, index) => {
            console.log("   0x", proof.toString("hex"));
        });
        console.log("    batch_instacne:");
        batchInstances.map((ins: BN, index) => {
            console.log("   0x", ins.toString("hex"));
        });
        console.log("    instacne:");
        instances.map((ins: BN, index) => {
            console.log("   0x", ins.toString("hex"));
        });
        console.log("    aux:");
        aux.map((aux: BN, index) => {
            console.log("   0x", aux.toString("hex"));
        });
        console.log("   fee:", fee);
    }).catch((err) => {
        console.log("queryTask Error", err);
    }).finally(() =>
        console.log("Finish queryTask.")
    );
```

### Query Auto Submitted Batch Proofs

This example typescript code will query task details:

```typescript
import {
    ZkWasmServiceHelper,
    ZkWasmUtil,
    Round1BatchProof,
    Round1BatchProofQuery,
    PaginationResult,
    PaginatedQuery,
    Round1BatchProofStatus,
    Round2BatchProofStatus,
    Task,
} from "zkwasm-service-helper";
import BN from "bn.js";

const endpoint = ""https://rpc.zkwasmhub.com:8090";
const taskid = "xxxx"

let helper = new ZkWasmServiceHelper(endpoint, "", "");

// Query the Round 1 Queue to check the status of the first round of batch proofs
let round1QueueQuery: PaginatedQuery<Round1BatchProofQuery> = {
    task_id: taskid!, // Task id of the task that the batch proof is associated with
    id: null, // null can also be empty string "" to ignore fields in the query filter
    status: Round1BatchProofStatus.Batched,
    circuit_size: null, // null or 22 since all images should be utilizing circuit size 22
};
helper.queryRound1BatchProofs(round1QueueQuery).then((res) => {
    const response = res as PaginationResult<Round1BatchProof[]>;
    const proof: Round1BatchProof = response.data[0];
    console.log("Proof details: ");
    console.log("    ", proof);
}).catch((err) => {
    console.log("queryRound1BatchProofs Error", err);
}).finally(() =>
    console.log("Finish queryRound1BatchProofs.")
);

// Query Round 2 Queue to check the status of the second round of batch proofs
// This also contains the output of Round 1 batch proof items, which will be used as inputs for the Round 2 batch proof
let round2QueueQuery: PaginatedQuery<Round2BatchProofQuery> = {
    task_id: taskid!, // Find a Round 2 Proof item which contains this task id
    id: null, // null can also be empty string "" to ignore fields in the query filter
    status: Round2BatchProofStatus.Done,
    circuit_size: null, // null or 22 since all images should be utilizing circuit size 22
};
helper.queryRound2BatchProofs(round2QueueQuery).then((res) => {
    const response = res as PaginationResult<Round2BatchProof[]>;
    const proof: Round2BatchProof = response.data[0];
    console.log("Proof details: ");
    console.log("    ", proof);
}).catch((err) => {
    console.log("queryRound2BatchProofs Error", err);
}).finally(() =>
    console.log("Finish queryRound2BatchProofs.")
);

let finalBatchProofQuery: PaginatedQuery<FinalBatchProofQuery> = {
    task_id: taskid!,
    round_2_id: null, // Can also be a round 2 id to find the associated Round 1 outputs.
    id: null, // null can also be empty string "" to ignore fields in the query filter
    status: FinalProofStatus.ProofRegistered, // ProofRegistered is the status of whether or not the final proof is registered on chain
                                              // Which allows verification of underlying proofs.
};
helper.queryFinalBatchProofs(round2QueueQuery).then((res) => {
    const response = res as PaginationResult<FinalBatchProof[]>;
    const proof: FinalBatchProof = response.data[0];
    console.log("Proof details: ");
    console.log("    ", proof);
}).catch((err) => {
    console.log("queryFinalBatchProofs Error", err);
}).finally(() =>
    console.log("Finish queryFinalBatchProofs.")
);
```

### Notes:

md5 is case insensitive when communicate with our zkwasm service

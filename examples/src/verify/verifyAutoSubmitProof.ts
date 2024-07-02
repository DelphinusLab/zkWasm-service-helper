import {
  ZkWasmUtil,
  Task,
  QueryParams,
  AutoSubmitStatus,
  VerifyBatchProofParams,
  Round1Status,
  Round1Info,
  Round2Status,
} from "zkwasm-service-helper";
import { withDelphinusWalletConnector } from "web3subscriber/src/client";

import { ServiceHelperConfig, Web3ChainConfig } from "../config";
import { queryTasks } from "../queries/task";
import {
  queryRound1ProofInfo,
  queryRound2ProofInfo,
} from "../queries/autosubmit";
import {
  DelphinusBaseProvider,
  GetBaseProvider,
} from "web3subscriber/src/provider";

const provider: DelphinusBaseProvider = GetBaseProvider(
  Web3ChainConfig.providerUrl // web3 provider URL for the verifier chain
);

export async function VerifyAutoSubmitProof() {
  const queryParams: QueryParams = {
    id: "<YOUR_TASK_ID>",
    tasktype: "Prove",
    taskstatus: "Done",
    user_address: null,
    md5: null,
    total: 1,
  };

  // Fetch a task from the playground service which contains the proof information
  // See the example to build query function to fetch task details
  const taskResponse = await queryTasks(queryParams);

  // Handle missing tasks accordingly
  // Assume task exists
  const task: Task = taskResponse.data[0];

  // Check if the base proof task has been registered with the BatchVerifier contract
  // Note that this is a naive check as the Auto Submit service may have registered the proof only on one chain and not other ones.
  const isRegistered =
    task.auto_submit_status === AutoSubmitStatus.RegisteredProof;

  if (!isRegistered) {
    console.log("Proof not registered on any batch verification contracts");
    return;
  }

  const round_1_info_response = await queryRound1ProofInfo({
    task_id: task._id.$oid,
    chain_id: Web3ChainConfig.chainId,
    status: Round1Status.Batched,
    total: 1,
  });

  // Handle missing round 2 proofs accordingly
  // Assume round 2 proof exists
  // Since the response returned is the input to the round 2 proof, we will use this to verify the proof
  const round_1_output: Round1Info = round_1_info_response.data[0];

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

  let proof_info: VerifyBatchProofParams = {
    membership_proof_index: [BigInt(index)],
    verify_instance: task.shadow_instances,
    sibling_instances: round_1_target_instances,
    round_1_shadow_instance: round_1_shadow_instances,
    target_instances: [task.instances],
  };

  const round2_response = await queryRound2ProofInfo({
    task_id: task._id["$oid"],
    chain_id: Web3ChainConfig.chainId,
    // This is a naive check as the Auto Submit service may have registered the proof only on one chain and not other ones.
    status: Round2Status.ProofRegistered,
  });

  // Handle missing round 2 batch proofs accordingly
  // Assume round 2 batch proof exists
  const round_2_output = round2_response.data[0];

  // Use the Batch Verifier contract address to verify the proof
  const contractAddress = round_2_output.verifier_contracts.batch_verifier;

  await withDelphinusWalletConnector(
    async (connector) => {
      let contract = await ZkWasmUtil.composeBatchVerifierContract(
        connector,
        contractAddress
      );

      let tx = await ZkWasmUtil.verifyBatchedProof(
        contract.getEthersContract(),
        proof_info
      );
      // wait for tx to be mined, can add no. of confirmations as arg
      const receipt = await tx.wait();

      console.log("transaction:", tx.hash);
      console.log("receipt:", receipt);
    },
    provider,
    ServiceHelperConfig.privateKey
  );
}

VerifyAutoSubmitProof();

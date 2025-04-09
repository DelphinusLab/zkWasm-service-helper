import {
  ZkWasmUtil,
  Task,
  QueryParams,
  AutoSubmitStatus,
  VerifyBatchProofParams,
  Round1Status,
  Round1Info,
  PaginationResult,
} from "zkwasm-service-helper";
import { withDelphinusWalletConnector } from "web3subscriber/src/client";
import {
  ServiceHelper,
  ServiceHelperConfig,
  Web3ChainConfig,
  AUTO_TASK_ID_TO_VERIFY,
} from "../config";
import {
  DelphinusBaseProvider,
  GetBaseProvider,
} from "web3subscriber/src/provider";

const provider: DelphinusBaseProvider = GetBaseProvider(
  Web3ChainConfig.providerUrl, // web3 provider URL for the verifier chain
);

export async function VerifyAutoSubmitProof() {
  const queryParams: QueryParams = {
    id: AUTO_TASK_ID_TO_VERIFY!,
    tasktype: "Prove",
    taskstatus: "Done",
    user_address: null,
    md5: null,
    total: 1,
  };

  // Fetch a task from the playground service which contains the proof information
  // See the example to build query function to fetch task details
  const taskResponse: PaginationResult<Task[]> =
    await ServiceHelper.loadTasks(queryParams);

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

  const round_1_info_response: PaginationResult<Round1Info[]> =
    await ServiceHelper.queryRound1Info({
      task_id: task._id.$oid,
      chain_id: Web3ChainConfig.chainId,
      status: Round1Status.Batched,
      total: 1,
    });

  // Handle missing round 2 proofs accordingly
  // Assume round 2 proof exists
  // Since the response returned is the input to the round 2 proof, we will use this to verify the proof
  const round_1_output: Round1Info = round_1_info_response.data[0];

  // Find the index of this proof in the round 1 output by comparing task_ids
  // This will be used to verify that this proof was included in a particular batch.
  // If it does not exist, the verification will fail
  const index = round_1_output.task_ids.findIndex(
    (id) => id === task._id["$oid"],
  );

  let proof_info: VerifyBatchProofParams = {
    membership_proof_index: [BigInt(index)],
    verify_instance: task.shadow_instances,
    sibling_instances: round_1_output.target_instances,
    round_1_shadow_instance: round_1_output.shadow_instances!,
    target_instances: [task.instances],
  };

  // Use the Batch Verifier contract address to verify the proof
  const contractAddress = task.task_verification_data.verifier_contracts.find(
    (x) => x.chain_id === Web3ChainConfig.chainId,
  )?.batch_verifier!;

  await withDelphinusWalletConnector(
    async (connector) => {
      let contract = await ZkWasmUtil.composeBatchVerifierContract(
        connector,
        contractAddress,
      );

      // This calls the `verify` function on the BatchVerifier contract
      let tx = await ZkWasmUtil.verifyBatchedProof(
        contract.getEthersContract(),
        proof_info,
      );
      // wait for tx to be mined, can add no. of confirmations as arg
      const receipt = await tx.wait();

      console.log("transaction:", tx.hash);
      console.log("receipt:", receipt);

      // Alternatively, this calls the `checkVerifiedProof` function on the BatchVerifier contract
      let checkVerifiedProof = await ZkWasmUtil.checkVerifiedProof(
        contract.getEthersContract(),
        proof_info,
      );
      // wait for tx to be mined, can add no. of confirmations as arg
      const receipt_checkVerifiedProof = await checkVerifiedProof.wait();

      console.log("transaction:", checkVerifiedProof.hash);
      console.log("receipt:", receipt_checkVerifiedProof);
    },
    provider,
    ServiceHelperConfig.privateKey,
  );
}

VerifyAutoSubmitProof();

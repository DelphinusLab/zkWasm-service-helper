import {
  VerifyProofParams,
  ZkWasmUtil,
  Task,
  QueryParams,
  PaginationResult,
} from "zkwasm-service-helper";
import {
  withBrowserConnector,
  withDelphinusWalletConnector,
} from "web3subscriber/src/client";
import {
  DelphinusBaseProvider,
  GetBaseProvider,
} from "web3subscriber/src/provider";
import { ServiceHelper, ServiceHelperConfig, Web3ChainConfig } from "../config";

const provider: DelphinusBaseProvider = GetBaseProvider(
  Web3ChainConfig.providerUrl // web3 provider URL for the verifier chain
);

export async function VerifyProof() {
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
  const response: PaginationResult<Task[]> = await ServiceHelper.loadTasks(
    queryParams
  );

  // Handle missing tasks accordingly
  // Assume task exists
  const task: Task = response.data[0];

  const verifierContractAddress =
    task.task_verification_data.verifier_contracts.find(
      (x) => x.chain_id === Web3ChainConfig.chainId
    )?.aggregator_verifier;

  if (!verifierContractAddress) {
    console.log(
      "Verifier contract not found for chain id: ",
      Web3ChainConfig.chainId
    );
    return;
  }

  await withDelphinusWalletConnector(
    async (connector) => {
      let contract = await ZkWasmUtil.composeVerifyContract(
        connector,
        verifierContractAddress
      );

      // If the proof has no shadow instances, use the batch instances to try and verify instead.
      // Mostly for legacy purposes.
      // Proofs submitted with Auto Submit will not be verified using this method.

      let verify_instance =
        task.shadow_instances.length === 0
          ? task.batch_instances
          : task.shadow_instances;

      let verifyProofParams: VerifyProofParams = {
        aggregate_proof: task.proof,
        verify_instance: verify_instance,
        aux: task.aux,
        instances: [task.instances], // The target instances are wrapped in an array
      };

      let tx = await ZkWasmUtil.verifyProof(
        contract.getEthersContract(),
        verifyProofParams
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

VerifyProof();

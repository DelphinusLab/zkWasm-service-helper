import {
  Round1BatchProof,
  Round1BatchProofQuery,
  PaginationResult,
  PaginatedQuery,
  Round2BatchProofQuery,
  Round2BatchProof,
  FinalBatchProof,
  FinalBatchProofQuery,
} from "zkwasm-service-helper";
import { ServiceHelper } from "../config";

// This will query the the queue of Round 1 proofs to be batched.
// Values returned are of the batch proof queue (Inputs to the proof from the original task)
// The Output of the Round 1 proof is stored in Round2BatchProof.

// Query parameters are all optional, build your own based on your needs
// let round1QueueQuery: PaginatedQuery<Round1BatchProofQuery> = {
//   task_id, // Task id of the original task that the batch proof is associated with
//   status: Round1BatchProofStatus.Batched,
//   start: 0,
//   total: 1,
//   chain_id: 11155111, // Chain id of the auto submit network if required
// };
export async function QueryRound1Queue(
  queryParams: PaginatedQuery<Round1BatchProofQuery>
): Promise<PaginationResult<Round1BatchProof[]>> {
  const response: PaginationResult<Round1BatchProof[]> =
    await ServiceHelper.queryRound1BatchProofs(queryParams);

  // The response will contain items in the batch proof queue for Round 1
  const round1_input_data: Round1BatchProof = response.data[0];
  console.log("Proof details: ");
  console.log("    ", round1_input_data);

  return response;
}

// Query parameters are all optional, build your own based on your needs
// let round2QueueQuery: PaginatedQuery<Round2BatchProofQuery> = {
//   task_id, // Task id of the original task that the batch proof is associated with
//   status: Round2BatchProofStatus.Batched,
//   start: 0,
//   total: 1,
//   chain_id: 11155111, // Chain id of the auto submit network if required
// };

export async function QueryRound2Queue(
  queryParams: PaginatedQuery<Round2BatchProofQuery>
): Promise<PaginationResult<Round2BatchProof[]>> {
  const response: PaginationResult<Round2BatchProof[]> =
    await ServiceHelper.queryRound2BatchProofs(queryParams);

  // The response will contain items in the batch proof queue for Round 2
  // Note that the items in the response contain the inputs to Round 2, which are also the outputs of Round 1.
  const round2_input_data: Round2BatchProof = response.data[0];
  console.log("Proof details: ");
  console.log("    ", round2_input_data);

  return response;
}

export async function QueryFinalBatchProof(
  queryParams: PaginatedQuery<FinalBatchProofQuery>
): Promise<PaginationResult<FinalBatchProof[]>> {
  const task_id = "<YourTaskId>";

  const response: PaginationResult<FinalBatchProof[]> =
    await ServiceHelper.queryFinalBatchProofs(queryParams);

  // The response contains fully batched round 2 output information.
  // Log it here for demonstration purposes.

  const proof: FinalBatchProof = response.data[0];
  console.log("Proof details: ");
  console.log("    ", proof);

  // Return raw response for further processing
  return response;
}

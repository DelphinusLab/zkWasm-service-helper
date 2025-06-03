import type {
  ObjectId,
  PaginationResult,
  Round2Status,
  StaticFileVerificationData,
  VerifierContracts,
} from "./interface";

export interface ArchiveVolumeMetadata<R> {
  version: string;
  volume_name: string;
  original_coll_name: string;
  range?: R;
  _id: ObjectId;
  prev_last_ts: string;
  image_md5s?: string[];
}

export interface TaskVolumeRange {
  n_records: number;
  fst: ObjectId;
  lst: ObjectId;
  fst_ts: string;
  lst_ts: string;
}

export interface AutoSubmitVolumeRange {
  n_records: number;
  fst_auto_submit_id: ObjectId;
  lst_auto_submit_id: ObjectId;
  fst_task_id: ObjectId;
  lst_task_id: ObjectId;
  fst_ts: string;
  lst_ts: string;
}

export interface ArchiveSummary {
  first?: ArchiveVolumeMetadata<TaskVolumeRange>;
  last?: ArchiveVolumeMetadata<TaskVolumeRange>;
}

export interface VolumeListQuery {
  start?: number;
  limit?: number;
}

export interface VolumeDetailQuery {
  tasks_start?: number;
  tasks_limit?: number;
}

export interface VolumeDetailResponse<M, D> {
  volume: ArchiveVolumeMetadata<M>;
  tasks: PaginationResult<D>;
}

export interface ArchiveQuery {
  task_id?: string;
  md5?: string;
  start_timestamp?: string;
  end_timestamp?: string;
  start?: number;
  limit?: number;
}

export interface ArchivedFinalBatchProof {
  _id: ObjectId;
  original_final_proof_id: string; // The id of the original final proof
  included_md5s: string[]; // The md5s of the included proofs
  round_2_ids: string[]; // 6 Round2 queue item id
  round_1_ids: string[]; // 72 Round1 queue item id
  task_ids: string[]; // 72 task ids. add it for easy to search the task
  target_instances: number[][]; // 6 or less instances of the Round1 output batch_instances (The batch_instances in Round2BatchProof). e.g the inputs of the Round2BatchProof
  proof: number[]; // Round 2 batched result proof (transcript)
  batch_instances: number[]; // Round 2 batched result instance
  shadow_instances: number[]; // Round 2 batched result shadow instance
  aux: number[]; // Round 2 batched result aux, used to verify the proof in Solidity

  // Need to store the 'Round2 Input' values too.
  // This is the input of the Round2BatchProof, which is the output of the Round1BatchProof.
  round_1_proof: number[][]; // Round 1 batched result proof (transcript)
  round_1_batch_instances: number[][]; // Round 1 batched result instance
  round_1_shadow_instances: number[][]; // Round 1 batched result shadow instance
  round_1_aux: number[][]; // Round 1 batched result aux, this is unused in final batch process, only used in Solidity verification
  round_1_target_instances: number[][][]; // Round 1 target instances, equal to all batch instances of underlying aggregate proofs.
  batched_time: string; // The time the batch process done. This will always exist in the archive. (ISO 8601 string)
  internal_message?: string; // a more detailed message for the developer
  static_files_verification_data?: StaticFileVerificationData; // Information about the static files (K params, vkey, aggr-vkey files) and verifier addresses when the task is processing.
  auto_submit_network_chain_id: number; // The network chain id of the network the proof is submitted to
  verifier_contracts: VerifierContracts;
  registered_tx_hash: string; // The tx hash of the registered proof
  status: Round2Status;
}

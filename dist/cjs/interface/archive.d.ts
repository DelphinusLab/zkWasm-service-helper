import type { ObjectId, PaginationResult, Round2Status, StaticFileVerificationData, VerifierContracts } from "./interface";
export interface ArchiveVolumeMetadata<R> {
    version: string;
    volume_name: string;
    original_coll_name: string;
    range?: R;
    _id: ObjectId;
    prev_last_ts: string;
    image_md5s?: string[];
}
export declare enum VolumeStatus {
    Attached = "Attached",
    Detached = "Detached"
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
    original_final_proof_id: string;
    included_md5s: string[];
    round_2_ids: string[];
    round_1_ids: string[];
    task_ids: string[];
    target_instances: number[][];
    proof: number[];
    batch_instances: number[];
    shadow_instances: number[];
    aux: number[];
    round_1_proof: number[][];
    round_1_batch_instances: number[][];
    round_1_shadow_instances: number[][];
    round_1_aux: number[][];
    round_1_target_instances: number[][][];
    batched_time: string;
    internal_message?: string;
    static_files_verification_data?: StaticFileVerificationData;
    auto_submit_network_chain_id: number;
    verifier_contracts: VerifierContracts;
    registered_tx_hash: string;
    status: Round2Status;
}

import { ConciseTask, ObjectId, PaginationResult } from "./interface";

export interface ArchiveVolumeMetadata {
  version: string;
  volume_name: string;
  original_coll_name: string;
  range?: VolumeRange;
  _id: ObjectId;
  prev_last_ts: string;
  image_md5s?: string[];
}

export interface VolumeRange {
  n_records: number;
  fst: ObjectId;
  lst: ObjectId;
  fst_ts: string;
  lst_ts: string;
}

export interface ArchiveSummary {
  first?: ArchiveVolumeMetadata;
  last?: ArchiveVolumeMetadata;
}

export interface VolumeListQuery {
  start?: number;
  limit?: number;
}

export interface VolumeDetailQuery {
  tasks_start?: number;
  tasks_limit?: number;
}

export interface VolumeDetailResponse {
  volume: ArchiveVolumeMetadata;
  tasks: PaginationResult<ConciseTask>;
}

export interface ArchiveQuery {
  task_id?: string;
  md5?: string;
  start_timestamp?: string;
  end_timestamp?: string;
  start?: number;
  limit?: number;
}

export interface Statistics {
  totalImages: number;
  totalProofs: number;
  totalTasks: number;
  totalDeployed: number;
}

export enum InputContextType {
  Custom = "Custom",
  ImageInitial = "ImageInitial",
  ImageCurrent = "ImageCurrent",
}

export type ContextHexString = string; // Hex string of the input context bytes

export interface Task {
  user_address: string;
  node_address?: string;
  md5: string;
  task_type: string;
  status: TaskStatus;
  single_proof: Uint8Array;
  proof: Uint8Array;
  aux: Uint8Array;
  batch_instances: Uint8Array;
  instances: Uint8Array;
  public_inputs: Array<string>;
  private_inputs: Array<string>;
  task_input_context: Uint8Array;
  input_context_type?: InputContextType; // The type of context for the task
  task_output_context: Uint8Array; // The context output from the task which should go to the image
  _id: any;
  submit_time: string;
  process_started?: string;
  process_finished?: string;
  task_fee?: Uint8Array;
  status_message?: string;
  internal_message?: string;
  task_verification_data: TaskVerificationData;
  debug_logs?: string;
}

export interface TaskVerificationData {
  static_file_checksum: Uint8Array;
  verifier_contracts: Array<VerifierContracts>;
}

export interface VerifierContracts {
  chain_id: number;
  aggregator_verifier: string;
  circuit_size: number;
}

export type TaskStatus =
  | "Pending"
  | "Processing"
  | "DryRunFailed"
  | "Done"
  | "Fail"
  | "Stale";

export interface PaginationResult<T> {
  data: T;
  total: number;
}

export interface AddImageParams {
  name: string;
  image: any; //This is because F/E use dom File but cli have to use Buffer. Our rust service just read it as bytes and get data before the first EOF.
  initial_context: ContextHexString;
  image_md5: string;
  user_address: string;
  description_url: string;
  avator_url: string;
  circuit_size: number;
}

export interface ProvingParams {
  user_address: string;
  md5: string;
  public_inputs: Array<string>;
  private_inputs: Array<string>;
  input_context: ContextHexString;
  input_context_type: InputContextType;
}

export interface DeployParams {
  user_address: string;
  md5: string;
  chain_id: number;
}

export interface ResetImageParams {
  md5: string;
  circuit_size: number;
  user_address: string;
}

export interface ModifyImageParams {
  md5: string;
  user_address: string;
  description_url: string;
  avator_url: string;
}

export type WithSignature<T> = T & { signature: string; user_address: string };
export type OmitSignature<T> = Omit<WithSignature<T>, "signature">;
export interface VerifyData {
  proof: Array<BigInt>;
  target_instances: Array<BigInt>;
  aggregator_instances: Array<BigInt>;
  aux_instances: Array<BigInt>;
}

export interface QueryParams {
  user_address: string;
  md5: string;
  id: string;
  tasktype: string;
  taskstatus: string;
  start?: number;
  total?: number;
}

export interface VerifyProofParams {
  aggregate_proof: Uint8Array;
  batch_instances: Uint8Array;
  aux: Uint8Array;
  instances: Uint8Array;
}

export interface LogQuery {
  id: string;
  user_address: string;
}

export interface StatusState {
  tasks: Array<Task>;
  statistics: Statistics;
  loaded: boolean;
  config: AppConfig;
}

export interface AppConfig {
  receiver_address: string;
  deployer_address: string;
  task_fee_list: {
    setup_fee: string;
    prove_fee: string;
  };
  chain_info_list: Array<ChainInfo>;
  latest_server_checksum: Uint8Array;
  deployments: ContractDeployments[];
}

export interface ContractDeployments {
  chain_id: number;
  circuit_size: number;
  aggregator_lib_address: string;
  aggregator_config_address: string;
  aggregator_verifier_steps: string[];
  aggregator_verifier: string;
  static_file_checksum: Uint8Array;
}
// returned from zkwasm service server
export interface ChainInfo {
  chain_id: number;
  chain_name: string;
  block_explorer_url: string;
  deploy_fee: string;
}
// Generic interface for fields required to connect to a chain
export interface ChainDetails {
  chainHexId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export interface DeploymentInfo {
  chain_id: number;
  address: string;
}

export interface Image {
  user_address: string;
  md5: string;
  deployment: Array<DeploymentInfo>;
  description_url: string;
  avator_url: string;
  circuit_size: number;
  context?: Uint8Array;
  status: string;
  checksum: ImageChecksum | null;
}

export interface ImageChecksum {
  x: Uint8Array;
  y: Uint8Array;
}

export interface PaymentParams {
  txhash: string;
}

export interface UserQueryParams {
  user_address: string;
}

export interface TxHistoryQueryParams {
  user_address: string;
  start?: number;
  total?: number;
}

export interface User {
  user_address: string;
  balance: Uint8Array;
}

export interface TransactionInfo {
  txhash: string;
  value: Uint8Array;
  user_address: string;
  receiver_address: string;
}

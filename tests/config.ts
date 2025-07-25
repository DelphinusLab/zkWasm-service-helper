import { Wallet } from "ethers";
import { ZkWasmServiceHelper } from "../dist/mjs/helper/task";
import * as fs from "fs";

export interface TestConfig {
  details: {
    server_url: string;
    private_key: string;
    chain_id: number;
    pedantic_checks: boolean;
  };
  verify: {
    provider_url: string;
    manual_task_id_to_verify: string;
  };
  query: {
    task_id: string;
    md5: string;
    node_address: string;
  };
  auto_submit: {
    round1_id: string;
    round2_id: string;
    task_id_in_auto_submit_batch: string;
  };
  archive: {
    server_url: string;
    id: string;
    archived_task_id: string;
    archive_volume_name: string;
    archive_auto_submit_volume_name: string;
  };
  tasks: {
    image: string;
  };
}

const raw = fs.readFileSync("tests/config.json", "utf-8");

export const CONFIG = JSON.parse(raw) as TestConfig;

export const USER_ADDRESS = new Wallet(
  CONFIG.details.private_key,
).address.toLowerCase();

export const ZKH = new ZkWasmServiceHelper(CONFIG.details.server_url, "", "");

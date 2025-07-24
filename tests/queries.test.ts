import * as fs from "fs";
import { toBigInt, Wallet } from "ethers";
import { ZkWasmServiceHelper } from "../dist/mjs/helper/task";
import { ZkWasmUtil } from "../dist/mjs/helper/util";
import {
  AutoSubmitProofStatus,
  LogQuery,
  PaginationResult,
  ProofSubmitMode,
  Round1Status,
  Round2Status,
} from "../dist/mjs/interface/interface";

interface TestConfig {
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
  };
  tasks: {
    image: string;
  };
}

const raw = fs.readFileSync("test.json", "utf-8");
const config = JSON.parse(raw) as TestConfig;
const user_address = new Wallet(
  config.details.private_key,
).address.toLowerCase();

export const ServiceHelper = new ZkWasmServiceHelper(
  config.details.server_url,
  "",
  "",
);

function checkPaginatedRes<T>(res: PaginationResult<T>) {
  const data = res.data as T[];
  expect(data.length).toBeGreaterThan(0);
  expect(res.total).toBeGreaterThanOrEqual(data.length);
}

describe("ZkWasmServiceHelper", () => {
  test("queryImage", async () => {
    const res = await ServiceHelper.queryImage(config.query.md5);
    expect(res.md5).toEqual(config.query.md5);
  });

  test("queryImageBinary", async () => {
    const res = await ServiceHelper.queryImageBinary(config.query.md5);
    expect(res.length).toBeGreaterThan(0);
  });

  test("queryUser", async () => {
    const res = await ServiceHelper.queryUser({ user_address });
    expect(res.user_address).toEqual(user_address);
  });

  test("queryUserSubscription", async () => {
    const res = await ServiceHelper.queryUserSubscription({ user_address });
    if (config.details.pedantic_checks) {
      expect(res!).toEqual(user_address);
    }
  });

  test("queryTxHistory", async () => {
    const res = await ServiceHelper.queryTxHistory({ user_address });
    if (config.details.pedantic_checks) {
      checkPaginatedRes(res);
    }
  });

  test("queryDepositHistory", async () => {
    const res = await ServiceHelper.queryDepositHistory({ user_address });
    if (config.details.pedantic_checks) {
      checkPaginatedRes(res);
    }
  });

  test("queryConfig", async () => {
    const res = await ServiceHelper.queryConfig();
    expect(res.chain_info_list.length).toBeGreaterThan(0);
    expect(res.supported_auto_submit_network_ids.length).toBeGreaterThan(0);
  });

  test("loadStatistics", async () => {
    const res = await ServiceHelper.loadStatistics();
    expect(res.totalTasks).toBeGreaterThan(0);
    expect(res.totalImages).toBeGreaterThan(0);
    expect(res.totalProofs).toBeGreaterThan(0);
  });

  test("queryNodeStatistics", async () => {
    const res = await ServiceHelper.queryNodeStatistics({});
    checkPaginatedRes(res);
  });

  test("queryNodeStatistics by address", async () => {
    const res = await ServiceHelper.queryNodeStatistics({
      address: user_address,
    });
    checkPaginatedRes(res);
    expect(res.data[0].address).toEqual(user_address);
  });

  test("queryProverNodeSummary", async () => {
    const res = await ServiceHelper.queryProverNodeSummary();
    expect(res.certified_prover_count).toBeGreaterThan(0);
    expect(res.active_prover_count).toBeGreaterThan(0);
    expect(res.intern_prover_count).toBeGreaterThan(0);
    expect(res.inactive_prover_count).toBeGreaterThan(0);
  });

  test("queryOnlineNodesSummary", async () => {
    const res = await ServiceHelper.queryOnlineNodesSummary();
    if (config.details.pedantic_checks) {
      expect(res.certified.length).toBeGreaterThan(0);
      expect(res.active.length).toBeGreaterThan(0);
      expect(res.intern.length).toBeGreaterThan(0);
      expect(res.inactive.length).toBeGreaterThan(0);
    }
  });

  test("queryLogs", async () => {
    const params: LogQuery = { id: config.query.task_id, user_address };
    let signature = await ZkWasmUtil.signMessage(
      ZkWasmUtil.createLogsMesssage(params),
      config.details.private_key,
    );
    const res = await ServiceHelper.queryLogs({ ...params, signature });
    expect(res.length).toBeGreaterThan(0);
  });

  test("queryEstimateProofFee", async () => {
    const res = await ServiceHelper.queryEstimateProofFee({
      user_address: user_address,
      md5: config.query.md5,
      proof_submit_mode: ProofSubmitMode.Auto,
    });
    expect(toBigInt(res.min!)).toBeGreaterThan(toBigInt(0));
    expect(toBigInt(res.max!)).toBeGreaterThan(toBigInt(0));
  });

  test("queryProverNodeTimeRangeStats", async () => {
    const now = new Date();
    const then = new Date(new Date().setDate(new Date().getMonth() - 1));

    const res = await ServiceHelper.queryProverNodeTimeRangeStats(
      user_address,
      then,
      now,
    );
    expect(new Date(res.fst_ts!).getTime()).toBeLessThan(now.getTime());
    expect(new Date(res.lst_ts!).getTime()).toBeGreaterThan(then.getTime());
  });

  describe("task", () => {
    test("loadTasks by user_address", async () => {
      const res = await ServiceHelper.loadTasks({
        user_address: user_address,
        md5: null,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].user_address).toEqual(user_address);
    });

    test("loadTasks by md5", async () => {
      const res = await ServiceHelper.loadTasks({
        user_address: null,
        md5: config.query.md5,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].md5).toEqual(config.query.md5);
    });

    test("loadTasks by task_id", async () => {
      const res = await ServiceHelper.loadTasks({
        user_address: null,
        md5: null,
        id: config.query.task_id,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0]._id.$oid).toEqual(config.query.task_id);
    });

    test("loadTasks by tasktype", async () => {
      const res = await ServiceHelper.loadTasks({
        user_address: null,
        md5: null,
        id: null,
        tasktype: "Prove",
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].task_type).toEqual("Prove");
    });

    test("loadTasks by taskstatus", async () => {
      const res = await ServiceHelper.loadTasks({
        user_address: null,
        md5: null,
        id: null,
        tasktype: null,
        taskstatus: "Done",
      });
      checkPaginatedRes(res);
      expect(res.data[0].status).toEqual("Done");
    });

    test("getTasksDetailFromIds", async () => {
      const ids = Array(10).fill(config.query.task_id);
      const res = await ServiceHelper.getTasksDetailFromIds(ids);
      expect(res.length).toBeGreaterThan(0);
      expect(res.length).toEqual(ids.length);
      expect(res[0]._id.$oid).toEqual(ids[0]);
    });

    test("getTaskDetailFromId", async () => {
      const res = await ServiceHelper.getTaskDetailFromId(config.query.task_id);
      expect(res!._id.$oid).toEqual(config.query.task_id);
    });

    test("loadTaskList by user_address", async () => {
      const res = await ServiceHelper.loadTaskList({
        user_address: user_address,
        md5: null,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].user_address).toEqual(user_address);
    });

    test("loadTaskList by md5", async () => {
      const res = await ServiceHelper.loadTaskList({
        user_address: null,
        md5: config.query.md5,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].md5).toEqual(config.query.md5);
    });

    test("loadTaskList by task_id", async () => {
      const res = await ServiceHelper.loadTaskList({
        user_address: null,
        md5: null,
        id: config.query.task_id,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0]._id.$oid).toEqual(config.query.task_id);
    });

    test("loadTaskList by tasktype", async () => {
      const res = await ServiceHelper.loadTaskList({
        user_address: null,
        md5: null,
        id: null,
        tasktype: "Prove",
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].task_type).toEqual("Prove");
    });

    test("loadTaskList by taskstatus", async () => {
      const res = await ServiceHelper.loadTaskList({
        user_address: null,
        md5: null,
        id: null,
        tasktype: null,
        taskstatus: "Done",
      });
      checkPaginatedRes(res);
      expect(res.data[0].status).toEqual("Done");
    });

    test("getTaskExternalHostTable", async () => {
      const res = await ServiceHelper.getTaskExternalHostTable({
        id: config.query.task_id,
      });
      expect(res.external_host_table.length).toBeGreaterThan(0);
    });
  });

  describe("auto_submit", () => {
    test("queryAutoSubmitProofs by task_id", async () => {
      const task_id = config.auto_submit.task_id_in_auto_submit_batch;
      const res = await ServiceHelper.queryAutoSubmitProofs({ task_id });
      checkPaginatedRes(res);
      expect(res.data[0].task_id).toEqual(task_id);
    });

    test("queryAutoSubmitProofs by status", async () => {
      const status = AutoSubmitProofStatus.Batched;
      const res = await ServiceHelper.queryAutoSubmitProofs({ status });
      checkPaginatedRes(res);
      expect(res.data[0].status).toEqual(status);
    });

    test("queryAutoSubmitProofs by chain_id", async () => {
      const chain_id = config.details.chain_id;
      const res = await ServiceHelper.queryAutoSubmitProofs({ chain_id });
      checkPaginatedRes(res);
      expect(res.data[0].auto_submit_network_chain_id).toEqual(chain_id);
    });

    test("queryRound1Info by id", async () => {
      const id = config.auto_submit.round1_id;
      const res = await ServiceHelper.queryRound1Info({ id });
      checkPaginatedRes(res);
      expect(res.data[0]._id.$oid).toEqual(id);
    });

    test("queryRound1Info by task_id", async () => {
      const task_id = config.auto_submit.task_id_in_auto_submit_batch;
      const res = await ServiceHelper.queryRound1Info({ task_id });
      checkPaginatedRes(res);
      expect(res.data[0].task_ids).toContain(task_id);
    });

    test("queryRound1Info by status", async () => {
      const status = Round1Status.Batched;
      const res = await ServiceHelper.queryRound1Info({ status });
      checkPaginatedRes(res);
      expect(res.data[0].status).toEqual(status);
    });

    test("queryRound1Info by chain_id", async () => {
      const chain_id = config.details.chain_id;
      const res = await ServiceHelper.queryRound1Info({ chain_id });
      checkPaginatedRes(res);
      expect(res.data[0].auto_submit_network_chain_id).toEqual(chain_id);
    });

    test("queryRound2Info by id", async () => {
      const id = config.auto_submit.round2_id;
      const res = await ServiceHelper.queryRound2Info({ id });
      checkPaginatedRes(res);
      expect(res.data[0]._id.$oid).toEqual(id);
    });

    test("queryRound2Info by task_id", async () => {
      const task_id = config.auto_submit.task_id_in_auto_submit_batch;
      const res = await ServiceHelper.queryRound2Info({ task_id });
      checkPaginatedRes(res);
      expect(res.data[0].task_ids).toContain(task_id);
    });

    test("queryRound2Info by status", async () => {
      const status = Round2Status.ProofRegistered;
      const res = await ServiceHelper.queryRound2Info({ status });
      checkPaginatedRes(res);
      expect(res.data[0].status).toEqual(status);
    }, 15_000);

    test("queryRound2Info by chain_id", async () => {
      const chain_id = config.details.chain_id;
      const res = await ServiceHelper.queryRound2Info({ chain_id });
      checkPaginatedRes(res);
      expect(res.data[0].auto_submit_network_chain_id).toEqual(chain_id);
    }, 15_000);
  });
});

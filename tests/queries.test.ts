import exp from "constants";
import { toBigInt } from "ethers";
import { ZkWasmUtil } from "../dist/mjs/helper/util";
import {
  AutoSubmitProofStatus,
  LogQuery,
  PaginationResult,
  ProofSubmitMode,
  ProverNodeTimeRange,
  Round1Status,
  Round2Status,
} from "../dist/mjs/interface/interface";
import { CONFIG, USER_ADDRESS, ZKH } from "./util";

function checkPaginatedRes<T>(res: PaginationResult<T>) {
  const data = res.data as T[];
  expect(data.length).toBeGreaterThan(0);
  expect(res.total).toBeGreaterThanOrEqual(data.length);
}

describe("ZkWasmServiceHelper", () => {
  test("queryImage", async () => {
    const res = await ZKH.queryImage(CONFIG.query.md5);
    expect(res.md5).toEqual(CONFIG.query.md5);
  });

  test("queryImageBinary", async () => {
    const res = await ZKH.queryImageBinary(CONFIG.query.md5);
    expect(res.length).toBeGreaterThan(0);
  });

  test("queryUser", async () => {
    const res = await ZKH.queryUser({ user_address: USER_ADDRESS });
    expect(res.user_address).toEqual(USER_ADDRESS);
  });

  test("queryUserSubscription", async () => {
    const res = await ZKH.queryUserSubscription({ user_address: USER_ADDRESS });
    if (CONFIG.details.pedantic_checks) {
      expect(res!).toEqual(USER_ADDRESS);
    }
  });

  test("queryTxHistory", async () => {
    const res = await ZKH.queryTxHistory({ user_address: USER_ADDRESS });
    if (CONFIG.details.pedantic_checks) {
      checkPaginatedRes(res);
    }
  });

  test("queryDepositHistory", async () => {
    const res = await ZKH.queryDepositHistory({ user_address: USER_ADDRESS });
    if (CONFIG.details.pedantic_checks) {
      checkPaginatedRes(res);
    }
  });

  test("queryConfig", async () => {
    const res = await ZKH.queryConfig();
    expect(res.chain_info_list.length).toBeGreaterThan(0);
    expect(res.supported_auto_submit_network_ids.length).toBeGreaterThan(0);
  });

  test("loadStatistics", async () => {
    const res = await ZKH.loadStatistics();
    expect(res.totalTasks).toBeGreaterThan(0);
    expect(res.totalImages).toBeGreaterThan(0);
    expect(res.totalProofs).toBeGreaterThan(0);
  });

  test("queryNodeStatistics", async () => {
    const res = await ZKH.queryNodeStatistics({});
    checkPaginatedRes(res);
  });

  test("queryNodeStatistics by address", async () => {
    const res = await ZKH.queryNodeStatistics({
      address: CONFIG.query.node_addresses[0],
    });
    checkPaginatedRes(res);
    expect(res.data[0].address).toEqual(CONFIG.query.node_addresses[0]);
  });

  test("queryProverNodeSummary", async () => {
    const res = await ZKH.queryProverNodeSummary();
    expect(res.certified_prover_count).toBeGreaterThan(0);
    expect(res.active_prover_count).toBeGreaterThan(0);
    expect(res.intern_prover_count).toBeGreaterThan(0);
    expect(res.inactive_prover_count).toBeGreaterThan(0);
  });

  test("queryOnlineNodesSummary", async () => {
    const res = await ZKH.queryOnlineNodesSummary();
    if (CONFIG.details.pedantic_checks) {
      expect(res.certified.length).toBeGreaterThan(0);
      expect(res.active.length).toBeGreaterThan(0);
      expect(res.intern.length).toBeGreaterThan(0);
      expect(res.inactive.length).toBeGreaterThan(0);
    }
  });

  test("queryLogs", async () => {
    const params: LogQuery = {
      id: CONFIG.query.task_id,
      user_address: USER_ADDRESS,
    };
    let signature = await ZkWasmUtil.signMessage(
      ZkWasmUtil.createLogsMesssage(params),
      CONFIG.details.private_key
    );
    const res = await ZKH.queryLogs({ ...params, signature });
    expect(res.length).toBeGreaterThan(0);
  });

  test("queryEstimateProofFee", async () => {
    const res = await ZKH.queryEstimateProofFee({
      user_address: USER_ADDRESS,
      md5: CONFIG.query.md5,
      proof_submit_mode: ProofSubmitMode.Auto,
    });
    expect(toBigInt(res.min!)).toBeGreaterThan(toBigInt(0));
    expect(toBigInt(res.max!)).toBeGreaterThan(toBigInt(0));
  });

  test("queryProverNodeTimeRangeStats single range in query", async () => {
    const now = new Date();
    const rg1 = {
      address: CONFIG.query.node_addresses[0],
      start: new Date(new Date().setMonth(now.getMonth() - 6)),
      end: now,
    };
    const res = await ZKH.queryProverNodeTimeRangeStats({ ranges: [rg1] });

    expect(res.length).toEqual(1);
    expect(new Date(res[0].fst_ts!).getTime()).toBeLessThan(rg1.end.getTime());
    expect(new Date(res[0].lst_ts!).getTime()).toBeGreaterThan(
      rg1.start.getTime()
    );
  });

  test("queryProverNodeTimeRangeStats multiple different ranges in query", async () => {
    const now = new Date();
    const rg1 = {
      address: CONFIG.query.node_addresses[1],
      start: new Date(new Date().setMonth(now.getMonth() - 1)),
      end: now,
    };
    const rg2 = {
      address: CONFIG.query.node_addresses[0],
      start: new Date(new Date().setMonth(now.getMonth() - 4)),
      end: new Date(new Date().setMonth(now.getMonth() - 2)),
    };
    const rg3 = {
      address: CONFIG.query.node_addresses[0],
      start: new Date(new Date().setMonth(now.getMonth() - 5)),
      end: new Date(new Date().setMonth(now.getMonth() - 4)),
    };
    const res = await ZKH.queryProverNodeTimeRangeStats({
      ranges: [rg1, rg2, rg3],
    });

    expect(res.length).toEqual(3);
    expect(new Date(res[0].fst_ts!).getTime()).toBeLessThan(rg1.end.getTime());
    expect(new Date(res[0].lst_ts!).getTime()).toBeGreaterThan(
      rg1.start.getTime()
    );
    expect(new Date(res[1].fst_ts!).getTime()).toBeLessThan(rg2.end.getTime());
    expect(new Date(res[1].lst_ts!).getTime()).toBeGreaterThan(
      rg2.start.getTime()
    );
    expect(new Date(res[2].fst_ts!).getTime()).toBeLessThan(rg3.end.getTime());
    expect(new Date(res[2].lst_ts!).getTime()).toBeGreaterThan(
      rg3.start.getTime()
    );
  });

  test("queryProverNodeTimeRangeStats invalid address", async () => {
    const now = new Date();
    const rg1 = {
      address: "0x0000000000000000000000000000000000000000",
      start: new Date(new Date().setMonth(now.getMonth() - 6)),
      end: now,
    };
    const res = await ZKH.queryProverNodeTimeRangeStats({ ranges: [rg1] });

    expect(res.length).toEqual(1);
    expect(res[0].fst_ts).toBeNull();
    expect(res[0].lst_ts).toBeNull();
  });

  test("queryProverNodeTimeRangeStats invalid range", async () => {
    const now = new Date();
    const rg1 = {
      address: CONFIG.query.node_addresses[0],
      start: now,
      end: new Date(new Date().setMonth(now.getMonth() - 6)),
    };
    const res = await ZKH.queryProverNodeTimeRangeStats({ ranges: [rg1] });

    expect(res.length).toEqual(1);
    expect(res[0].fst_ts).toBeNull();
    expect(res[0].lst_ts).toBeNull();
  });

  test("queryProverNodeTimeRangeStats max range", async () => {
    const now = new Date();
    const ranges: ProverNodeTimeRange[] = [];
    for (let i = 0; i < 100; i++) {
      const rg1 = {
        address: CONFIG.query.node_addresses[0],
        start: new Date(now.getFullYear(), i % 12, now.getDate()),
        end: new Date(now.getFullYear(), (i + 1) % 12, now.getDate()),
      };
      ranges.push(rg1);
    }
    const res = await ZKH.queryProverNodeTimeRangeStats({ ranges: ranges });

    expect(res.length).toEqual(100);
    res.map((it) => {
      expect(it.fst_ts).toBeDefined();
      expect(it.lst_ts).toBeDefined();
    });
  });

  test("queryProverNodeTimeRangeStats greater than max range", async () => {
    const now = new Date();
    const ranges: ProverNodeTimeRange[] = [];
    for (let i = 0; i < 101; i++) {
      const rg1 = {
        address: CONFIG.query.node_addresses[0],
        start: new Date(now.getFullYear(), i % 12, now.getDate()),
        end: new Date(now.getFullYear(), (i + 1) % 12, now.getDate()),
      };
      ranges.push(rg1);
    }
    const consErrSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => { });
    const consLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => { });
    await expect(
      ZKH.queryProverNodeTimeRangeStats({ ranges: ranges })
    ).rejects.toThrow();
    consErrSpy.mockRestore();
    consLogSpy.mockRestore();
  });

  describe("task", () => {
    test("loadTasks by user_address", async () => {
      const res = await ZKH.loadTasks({
        user_address: USER_ADDRESS,
        md5: null,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].user_address).toEqual(USER_ADDRESS);
    });

    test("loadTasks by md5", async () => {
      const res = await ZKH.loadTasks({
        user_address: null,
        md5: CONFIG.query.md5,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].md5).toEqual(CONFIG.query.md5);
    });

    test("loadTasks by task_id", async () => {
      const res = await ZKH.loadTasks({
        user_address: null,
        md5: null,
        id: CONFIG.query.task_id,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0]._id.$oid).toEqual(CONFIG.query.task_id);
    });

    test("loadTasks by tasktype", async () => {
      const res = await ZKH.loadTasks({
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
      const res = await ZKH.loadTasks({
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
      const ids = Array(10).fill(CONFIG.query.task_id);
      const res = await ZKH.getTasksDetailFromIds(ids);
      expect(res.length).toBeGreaterThan(0);
      expect(res.length).toEqual(ids.length);
      expect(res[0]._id.$oid).toEqual(ids[0]);
    });

    test("getTaskDetailFromId", async () => {
      const res = await ZKH.getTaskDetailFromId(CONFIG.query.task_id);
      expect(res!._id.$oid).toEqual(CONFIG.query.task_id);
    });

    test("loadTaskList by empty args", async () => {
      const res = await ZKH.loadTaskList({
        user_address: null,
        md5: null,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
    });

    test("loadTaskList by user_address", async () => {
      const res = await ZKH.loadTaskList({
        user_address: USER_ADDRESS,
        md5: null,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].user_address).toEqual(USER_ADDRESS);
    });

    test("loadTaskList by md5", async () => {
      const res = await ZKH.loadTaskList({
        user_address: null,
        md5: CONFIG.query.md5,
        id: null,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0].md5).toEqual(CONFIG.query.md5);
    });

    test("loadTaskList by task_id", async () => {
      const res = await ZKH.loadTaskList({
        user_address: null,
        md5: null,
        id: CONFIG.query.task_id,
        tasktype: null,
        taskstatus: null,
      });
      checkPaginatedRes(res);
      expect(res.data[0]._id.$oid).toEqual(CONFIG.query.task_id);
    });

    test("loadTaskList by tasktype", async () => {
      const res = await ZKH.loadTaskList({
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
      const res = await ZKH.loadTaskList({
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
      const res = await ZKH.getTaskExternalHostTable({
        id: CONFIG.query.task_id,
      });
      expect(res.external_host_table.length).toBeGreaterThan(0);
    });
  });

  describe("auto_submit", () => {
    test("queryAutoSubmitProofs by empty args", async () => {
      const res = await ZKH.queryAutoSubmitProofs({});
      checkPaginatedRes(res);
    });

    test("queryAutoSubmitProofs by task_id", async () => {
      const task_id = CONFIG.auto_submit.task_id_in_auto_submit_batch;
      const res = await ZKH.queryAutoSubmitProofs({ task_id });
      checkPaginatedRes(res);
      expect(res.data[0].task_id).toEqual(task_id);
    });

    test("queryAutoSubmitProofs by status", async () => {
      const status = AutoSubmitProofStatus.Batched;
      const res = await ZKH.queryAutoSubmitProofs({ status });
      checkPaginatedRes(res);
      expect(res.data[0].status).toEqual(status);
    });

    test("queryAutoSubmitProofs by chain_id", async () => {
      const chain_id = CONFIG.details.chain_id;
      const res = await ZKH.queryAutoSubmitProofs({ chain_id });
      checkPaginatedRes(res);
      expect(res.data[0].auto_submit_network_chain_id).toEqual(chain_id);
    });

    test("queryRound1Info by empty args", async () => {
      const res = await ZKH.queryRound1Info({});
      checkPaginatedRes(res);
    });

    test("queryRound1Info by id", async () => {
      const id = CONFIG.auto_submit.round1_id;
      const res = await ZKH.queryRound1Info({ id });
      checkPaginatedRes(res);
      expect(res.data[0]._id.$oid).toEqual(id);
    });

    test("queryRound1Info by task_id", async () => {
      const task_id = CONFIG.auto_submit.task_id_in_auto_submit_batch;
      const res = await ZKH.queryRound1Info({ task_id });
      checkPaginatedRes(res);
      expect(res.data[0].task_ids).toContain(task_id);
    });

    test("queryRound1Info by status", async () => {
      const status = Round1Status.Batched;
      const res = await ZKH.queryRound1Info({ status });
      checkPaginatedRes(res);
      expect(res.data[0].status).toEqual(status);
    });

    test("queryRound1Info by chain_id", async () => {
      const chain_id = CONFIG.details.chain_id;
      const res = await ZKH.queryRound1Info({ chain_id });
      checkPaginatedRes(res);
      expect(res.data[0].auto_submit_network_chain_id).toEqual(chain_id);
    });

    test("queryRound2Info by empty args", async () => {
      const res = await ZKH.queryRound2Info({});
      checkPaginatedRes(res);
    });

    test("queryRound2Info by id", async () => {
      const id = CONFIG.auto_submit.round2_id;
      const res = await ZKH.queryRound2Info({ id });
      checkPaginatedRes(res);
      expect(res.data[0]._id.$oid).toEqual(id);
    });

    test("queryRound2Info by task_id", async () => {
      const task_id = CONFIG.auto_submit.task_id_in_auto_submit_batch;
      const res = await ZKH.queryRound2Info({ task_id });
      checkPaginatedRes(res);
      expect(res.data[0].task_ids).toContain(task_id);
    });

    test("queryRound2Info by status", async () => {
      const status = Round2Status.ProofRegistered;
      const res = await ZKH.queryRound2Info({ status });
      checkPaginatedRes(res);
      expect(res.data[0].status).toEqual(status);
    });

    test("queryRound2Info by chain_id", async () => {
      const chain_id = CONFIG.details.chain_id;
      const res = await ZKH.queryRound2Info({ chain_id });
      checkPaginatedRes(res);
      expect(res.data[0].auto_submit_network_chain_id).toEqual(chain_id);
    });
  });
});

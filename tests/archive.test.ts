import { ZkWasmServiceHelper } from "../dist/mjs/helper/task";
import { CONFIG } from "./config";

const ZKH = new ZkWasmServiceHelper(CONFIG.archive.server_url, "", "");

describe("Archive", () => {
  test("queryArchiveSummary", async () => {
    await ZKH.queryArchiveSummary();
  });

  test("queryTaskVolumeList", async () => {
    await ZKH.queryTaskVolumeList({});
  });

  test("queryAutoSubmitVolumeList", async () => {
    await ZKH.queryAutoSubmitVolumeList({});
  });

  test("queryArchivedTask", async () => {
    await ZKH.queryArchivedTask(CONFIG.archive.archived_task_id);
  });

  test("queryArchivedAutoSubmitNetworksByTaskId", async () => {
    await ZKH.queryArchivedAutoSubmitNetworksByTaskId(
      CONFIG.archive.archived_task_id,
    );
  });

  test("queryArchivedAutoSubmitInfoByTaskId", async () => {
    await ZKH.queryArchivedAutoSubmitInfoByTaskId(
      CONFIG.archive.archived_task_id,
      CONFIG.details.chain_id,
    );
  });

  test("queryAutoSubmitInfoByArchiveId", async () => {
    await ZKH.queryAutoSubmitInfoByArchiveId(
      CONFIG.archive.id,
      CONFIG.details.chain_id,
    );
  });

  test("queryArchiveServerConfig", async () => {
    await ZKH.queryArchiveServerConfig();
  });

  test("queryTaskVolume", async () => {
    await ZKH.queryTaskVolume(CONFIG.archive.archive_volume_name, {});
  });

  test("queryAutoSubmitVolume", async () => {
    await ZKH.queryAutoSubmitVolume(
      CONFIG.archive.archive_auto_submit_volume_name,
      {},
    );
  });

  test("queryArchive", async () => {
    // Note: serialize fails if dates are null but this doesn't occur for other fields.
    const now = new Date();
    const then = new Date(new Date().setDate(new Date().getMonth() - 1));
    await ZKH.queryArchive({
      task_id: null,
      md5: null,
      start_timestamp: then.toISOString(),
      end_timestamp: now.toISOString(),
      start: null,
      limit: null,
    });
  });

  test("queryArchive by task_id", async () => {
    const now = new Date();
    const then = new Date(new Date().setDate(new Date().getMonth() - 1));
    await ZKH.queryArchive({
      task_id: CONFIG.archive.archived_task_id,
      md5: null,
      start_timestamp: then.toISOString(),
      end_timestamp: now.toISOString(),
      start: null,
      limit: null,
    });
  });
});

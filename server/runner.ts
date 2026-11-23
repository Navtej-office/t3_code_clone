import type { Task, TaskStatus } from "./types";
import type { TaskStore } from "./store";
import type { EventLog} from "./eventLog";
import type { AgentAdapter } from "./adapter";
import { fakeAdapter } from "./fakeAdapter";

const adapters: Record<string, AgentAdapter> = { fake: fakeAdapter };

export function createRunner(store: TaskStore, log: EventLog) {
  function setStatus(id: string, status: TaskStatus) {
    store.update(id, { status });
    log.append(id, "status", status);
  }

  async function runTask(task: Task) {
    const adapter = adapters[task.agent];

    // no agent with this name: record why, mark failed, stop
    if (!adapter) {
      log.append(task.id, "error", `No adapter for agent "${task.agent}"`);
      setStatus(task.id, "failed");
      return;
    }

    setStatus(task.id, "running");
    try {
      await adapter.run(
        task,
        (type, data) => log.append(task.id, type, data),
        new AbortController().signal
      );
      setStatus(task.id, "done");
    } catch (err) {
      // the agent crashed: record the message, mark failed
      const message = err instanceof Error ? err.message : String(err);
      log.append(task.id, "error", message);
      setStatus(task.id, "failed");
    }
  }

  return { setStatus, runTask };
}
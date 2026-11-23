import { MemoryTaskStore } from "./store";
import { EventLog } from "./eventLog";
import { createRunner } from "./runner";
import type { Task } from "./types";

const store = new MemoryTaskStore();
const log = new EventLog();
const runner = createRunner(store, log);

const make = (id: string, agent: "fake" | "command"): Task => ({
  id,
  prompt: "hello",
  agent,
  status: "queued",
  createdAt: new Date().toISOString(),
});

const good = make("g1", "fake");
store.create(good);
const running = runner.runTask(good);
console.log("just after starting:", store.get("g1")?.status);
await running;
console.log("after finish:", store.get("g1")?.status);
console.log(log.list("g1").map((e) => `${e.seq} ${e.type}: ${e.data}`));

const bad = make("b1", "command");
store.create(bad);
await runner.runTask(bad);
console.log("bad task:", store.get("b1")?.status);
console.log(log.list("b1").map((e) => `${e.seq} ${e.type}: ${e.data}`));
import express from "express";
import cors from "cors";


import { CreateTaskSchema, type Task } from "./types";
import { EventLog } from "./eventLog";
import { createRunner } from "./runner";
import { MemoryTaskStore } from "./store";


const PORT = Number(process.env.PORT ?? 3000);
const WEB_ORIGINS = (
  process.env.WEB_ORIGINS ?? "http://localhost:3001,http://127.0.0.1:3001"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();
const log = new EventLog();



app.use(express.json());

app.use(
  cors({
    origin: WEB_ORIGINS,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const store = new MemoryTaskStore();
const runner = createRunner(store, log);

app.post("/api/tasks", (req, res) => {
  const parsed = CreateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "invalid input", issues: parsed.error.issues });
  }

  const task: Task = {
    id: crypto.randomUUID(),
    prompt: parsed.data.prompt,
    agent: parsed.data.agent,
    status: "queued",
    createdAt: new Date().toLocaleDateString(),
  };

  store.create(task);
  runner.runTask(task).catch(console.error);
  return res.status(201).json(task);
});

app.get("/api/tasks", (req, res) => {
  res.json(store.list());
});

app.get("/api/tasks/:id", (req, res) => {
  const task = store.get(req.params.id);
  if (!task) {
    return res.status(401).json({ error: "task not found" });
  }
  return res.status(200).json(task);
});

app.get("/api/tasks/:id/log", (req, res) => {
  const id = req.params.id;
  if (!store.get(id)) {
    return res.status(404).json({ error: "task not found" });
  }
  const raw = Number(req.query.after);
  const after = Number.isInteger(raw) && raw >= 0 ? raw : 0;
  return res.json(log.list(id, after));
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});

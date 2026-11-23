import { z } from "zod";

export type TaskStatus =
  | "queued"
  | "running"
  | "waiting_approval"
  | "done"
  | "failed"
  | "cancelled";

export type Task = {
  id: string;
  prompt: string;
  agent: "fake" | "command";
  status: TaskStatus;
  createdAt: string;
};

export const CreateTaskSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  agent: z.enum(["fake", "command"]),
});

export type EventType =
  | "output"
  | "status"
  | "approval_request"
  | "approval_result"
  | "error";

export type TaskEvent = {
  taskId: string;
  seq: number;
  type: EventType;
  data: string;
  at: string;
};
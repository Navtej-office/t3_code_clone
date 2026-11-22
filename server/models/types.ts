import {z} from "zod";

export type TaskStatus="queued"|"running"|"cancelled"|"failed"|"done"|"waiting_approval";

export type Task={
    id:string;
    prompt:string;
    agent:string;
    status:TaskStatus;
    createdAt:string;
}

export const CreateTaskSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  agent: z.enum(["fake", "command"]),
});
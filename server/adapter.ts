import type { EventType, Task } from "./types";



export type Emit = (type: EventType, data: string) => void;

export interface AgentAdapter {
  name: string;
  run(task: Task, emit: Emit, signal: AbortSignal): Promise<void>;
}
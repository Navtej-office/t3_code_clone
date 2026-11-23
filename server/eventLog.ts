import type { EventType, TaskEvent } from "./types";


export class EventLog {
  private events = new Map<string, TaskEvent[]>();

  append(taskId: string, type: EventType, data: string): TaskEvent {
    let list = this.events.get(taskId);
    if (!list) {
      list = [];
      this.events.set(taskId, list);
    }
    const event: TaskEvent = {
      taskId,
      seq: list.length + 1,
      type,
      data,
      at: new Date().toISOString(),
    };
    list.push(event);
    return event;
  }

  list(taskId: string, after = 0): TaskEvent[] {
    const list = this.events.get(taskId) ?? [];
    return list.slice(after);
  }
}
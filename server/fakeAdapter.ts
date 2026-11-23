import type { AgentAdapter } from "./adapter";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fakeAdapter: AgentAdapter = {
  name: "fake",
  async run(task, emit, signal) {
    const lines = [
      `Starting task: ${task.prompt}`,
      "Reading project files...",
      "Found 3 files to look at",
      "Thinking about the change...",
      "Writing the result...",
    ];

   for (const line of lines) {
  if (signal.aborted) return;
  emit("output", line);
  await sleep(500);
}
  },
};
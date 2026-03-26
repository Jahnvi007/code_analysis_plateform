import fs from "fs";
import path from "path";
import { spawn, execSync } from "child_process";
import { v4 as uuid } from "uuid";

const TIME_LIMIT_MS = 5000;
const MEMORY_LIMIT_KB = 256 * 1024; // 256 MB

/* 🔒 Sandbox: restrict Python built-ins */
function wrapPythonCode(userCode) {
  return `
__builtins__ = {
  'print': print,
  'input': input,
  'range': range,
  'len': len,
  'int': int,
  'float': float,
  'str': str,
  'list': list,
  'dict': dict,
  'set': set,
  'tuple': tuple,
  'enumerate': enumerate,
  'map': map,
  'filter': filter
}

${userCode}
`;
}

export const runPythonCode = (code, input) => {
  return new Promise((resolve) => {
    const jobId = uuid();
    const tempDir = "temp";
    const filePath = path.join(tempDir, `${jobId}.py`);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    /* ✅ WRITE SANDBOXED CODE */
    fs.writeFileSync(filePath, wrapPythonCode(code));

    const startTime = process.hrtime.bigint();

    const child = spawn("python", [filePath], {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let peakMemoryKB = 0;
    let killed = false;

    /* ⏱️ TIME LIMIT */
    const timeout = setTimeout(() => {
      killed = true;
      child.kill("SIGKILL");
    }, TIME_LIMIT_MS);

    /* 🧠 MEMORY MONITOR (Windows – accurate) */
    const memoryInterval = setInterval(() => {
      try {
        const output = execSync(
          `powershell -Command "(Get-Process -Id ${child.pid}).PeakWorkingSet64"`,
          { stdio: ["pipe", "pipe", "ignore"] }
        )
          .toString()
          .trim();npm 

        const raw = parseInt(output, 10);

if (!isNaN(raw) && raw > 0) {
  const memKB = Math.round(raw / 1024);
  peakMemoryKB = Math.max(peakMemoryKB, memKB);
}


        if (peakMemoryKB > MEMORY_LIMIT_KB) {
          killed = true;
          child.kill("SIGKILL");
        }
      } catch {
        // process exited
      }
    }, 50);

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", () => {
      clearTimeout(timeout);
      clearInterval(memoryInterval);

      fs.unlinkSync(filePath);

      const endTime = process.hrtime.bigint();
      const executionTimeMs = Number(endTime - startTime) / 1_000_000;

      if (killed && executionTimeMs >= TIME_LIMIT_MS) {
        return resolve({
          verdict: "Time Limit Exceeded",
          output: "",
          executionTimeMs,
          memoryUsedKB: peakMemoryKB
        });
      }

      if (killed && peakMemoryKB > MEMORY_LIMIT_KB) {
        return resolve({
          verdict: "Memory Limit Exceeded",
          output: "",
          executionTimeMs,
          memoryUsedKB: peakMemoryKB
        });
      }

      if (stderr) {
        return resolve({
          verdict: "Runtime Error",
          output: stderr,
          executionTimeMs,
          memoryUsedKB: peakMemoryKB
        });
      }

      resolve({
        verdict: "OK",
        output: stdout.trim(),
        executionTimeMs: Math.round(executionTimeMs * 100) / 100,
        memoryUsedKB: peakMemoryKB
      });
      if (isNaN(peakMemoryKB) || peakMemoryKB < 0) {
  peakMemoryKB = 0;
}

    });

  });
};

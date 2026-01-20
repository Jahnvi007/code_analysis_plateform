/* backend/src/utils/codeRunner.js */
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuid } from "uuid";

/**
 * BASIC Python code runner (NO metrics)
 * ⚠️ Do NOT use directly in controllers
 * Used internally / future Docker adapter
 */
export const runPython = (code, input = "") => {
  return new Promise((resolve) => {
    const jobId = uuid();
    const tempDir = "temp";
    const filePath = path.join(tempDir, `${jobId}.py`);

    // ensure temp directory
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // write python file
    fs.writeFileSync(filePath, code);

    const command = `python -u ${filePath}`;

    const child = exec(
      command,
      { timeout: 5000 },
      (error, stdout, stderr) => {
        // cleanup
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        if (error) {
          return resolve({
            success: false,
            output: stderr || error.message
          });
        }

        resolve({
          success: true,
          output: stdout.trim()
        });
      }
    );

    // pass input
    if (input) {
      child.stdin.write(input + "\n");
      child.stdin.end();
    }
  });
};

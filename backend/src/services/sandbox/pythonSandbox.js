// backend/src/services/sandbox/pythonSandbox.js

import { spawnSync } from "child_process";

/**
 * Validates Python code using AST inspection
 * Blocks dangerous constructs BEFORE execution
 */
export const validatePythonCode = (code) => {
  const pythonScript = `
import ast
import sys

code = sys.stdin.read()

FORBIDDEN_NODES = (
    ast.Import,
    ast.ImportFrom,
    ast.With,
    ast.Try,
    ast.Raise,
    ast.Global,
    ast.Nonlocal
)

FORBIDDEN_NAMES = {
    "eval", "exec", "open", "compile",
    "__import__", "globals", "locals",
    "getattr", "setattr", "delattr",
    "vars"  # we override input safely anyway
}

FORBIDDEN_ATTRS = {
    "system", "popen", "fork", "kill",
    "remove", "unlink", "rmdir",
    "walk", "listdir"
}

class SecurityVisitor(ast.NodeVisitor):
    def visit(self, node):
        if isinstance(node, FORBIDDEN_NODES):
            raise Exception(f"Forbidden syntax: {type(node).__name__}")

        # function calls
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in FORBIDDEN_NAMES:
                    raise Exception(f"Forbidden function: {node.func.id}")

        # attribute access (obj.attr)
        if isinstance(node, ast.Attribute):
            if node.attr in FORBIDDEN_ATTRS:
                raise Exception(f"Forbidden attribute: {node.attr}")

        self.generic_visit(node)

try:
    tree = ast.parse(code)
    SecurityVisitor().visit(tree)
    print("OK")
except Exception as e:
    print("BLOCKED:", e)
`;

  const result = spawnSync("python", ["-"], {
    input: pythonScript + "\n",
    encoding: "utf-8"
  });

  // Run validation
  const validation = spawnSync("python", ["-"], {
    input: pythonScript.replace("sys.stdin.read()", JSON.stringify(code)),
    encoding: "utf-8"
  });

  const output = validation.stdout.trim();

  if (output.startsWith("BLOCKED")) {
    return {
      allowed: false,
      reason: output
    };
  }

  return {
    allowed: true
  };
};

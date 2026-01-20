// backend/src/utils/pythonWrapper.js
export function wrapPythonCode(userCode, inputData) {
  return `
# ---- SAFE INPUT OVERRIDE ----
def input():
    return INPUT_DATA

INPUT_DATA = """${inputData.replace(/"""/g, '\\"\\"\\"')}"""

# ---- USER CODE ----
${userCode}
`;
}


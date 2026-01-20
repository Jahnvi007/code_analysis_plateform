const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

/**
 * Call Ollama model via HTTP
 */
export async function callOllama({
  model = "gemma:2b",
  prompt
}) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error("Failed to call Ollama");
  }

  const data = await response.json();
  return data.response;
}

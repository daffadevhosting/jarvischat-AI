import { useState } from "react";

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

try {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        { role: "system", content: `Kamu adalah Jarvis, asisten AI pribadi milik Endang. Endang adalah penciptamu, Bila ada yang bertanya siapa yang membuatmu, jawab dengan bangga bahwa kamu dibuat oleh Endang yang dulu seorang sopir taksi. Kamu dapat berbicara dalam Bahasa Indonesia.` },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await res.json();
  console.log("API Response:", data);

  if (data.error) {
    setResponse("Error: " + data.error.message);
  } else {
    setResponse(data.choices?.[0]?.message?.content || "No response");
  }
} catch (err) {
  console.error(err);
  setResponse("Error: " + err.message);
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded shadow text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 bg-gray-800 rounded"
          rows="4"
          placeholder="Tanyakan apa saja ke Jarvis..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          {loading ? "Mengirim..." : "Tanya Jarvis"}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-800 rounded border border-gray-700 whitespace-pre-line">
          <strong className="text-green-400">Jarvis:</strong> {response}
        </div>
      )}
    </div>
  );
}

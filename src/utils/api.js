// src/utils/api.js

export async function getJarvisResponse(messages) {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "Maaf, terjadi kesalahan pada sistem Jarvis.";
  } catch (err) {
    console.error("Groq API error:", err);
    return "⚠️ Error menghubungi Groq API.";
  }
}

import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { question, subject } = JSON.parse(event.body);

    const apiKey = process.env.VITE_GEMINI_API_KEY; // ✅ fixed

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: question }] }],
        }),
      }
    );

    const data = await res.json();

    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: aiResponse }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

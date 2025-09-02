import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const { question, subject } = body;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `Answer this ${subject} question: ${question}` }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    const aiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI failed to answer";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: aiResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

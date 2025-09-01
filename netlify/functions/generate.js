// netlify/functions/generate.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    // Parse frontend request
    const { subject, topic, mode, question } = JSON.parse(event.body);

    // Gemini API request
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { 
                  text: mode === "chat"
                    ? `You are a STEM tutor. Answer this question about ${subject}: ${question}`
                    : `Generate ${mode} for ${subject}, topic: ${topic}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Return result to frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        result: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
      })
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch AI response" })
    };
  }
}

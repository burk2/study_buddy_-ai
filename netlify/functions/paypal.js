// netlify/functions/paypal.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    // Get OAuth2 token from PayPal
    const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return { statusCode: 500, body: JSON.stringify({ error: "Failed to authenticate with PayPal" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ access_token: tokenData.access_token }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

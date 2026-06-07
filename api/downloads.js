// api/downloads.js
// Vercel serverless function — handles GET (fetch count) and POST (increment)
// Requires: Vercel KV (free tier) connected to your project in the Vercel dashboard

import { kv } from "@vercel/kv";

const KEY = "memo_downloads";
const SEED = 0; // starting count — set this to whatever you want

export default async function handler(req, res) {
  // Allow requests from your domain only
  res.setHeader("Access-Control-Allow-Origin", "https://meddisclosure.ai");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      // Return current count
      const count = await kv.get(KEY);
      return res.status(200).json({ count: count ?? SEED });
    }

    if (req.method === "POST") {
      // Atomically increment and return new value
      const next = await kv.incr(KEY);
      // If this is the first ever increment, add the seed offset
      const count = next === 1 ? await kv.incrby(KEY, SEED - 1) : next;
      return res.status(200).json({ count });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("KV error:", err);
    return res.status(500).json({ error: "Storage error" });
  }
}

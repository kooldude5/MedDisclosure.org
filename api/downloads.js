import { kv } from "@vercel/kv";

const KEY = "memo_downloads";
const SEED = 128;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://meddisclosure.org");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const count = await kv.get(KEY);
      return res.status(200).json({ count: count ?? SEED });
    }
    if (req.method === "POST") {
      const next = await kv.incr(KEY);
      const count = next === 1 ? await kv.incrby(KEY, SEED - 1) : next;
      return res.status(200).json({ count });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("KV error:", err);
    return res.status(500).json({ error: "Storage error" });
  }
}

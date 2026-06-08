import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const KEY = "provider_supporters";
const SEED = 847;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://meddisclosure.org");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const count = await redis.get(KEY);
      return res.status(200).json({ count: count ?? SEED });
    }
    if (req.method === "POST") {
      const exists = await redis.exists(KEY);
      if (!exists) await redis.set(KEY, SEED);
      const next = await redis.incr(KEY);
      return res.status(200).json({ count: next });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Redis error:", err);
    return res.status(500).json({ error: "Storage error" });
  }
}

// Proxies patient device lookup requests to Anthropic API
// Keeps your API key server-side, never exposed to the browser

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://meddisclosure.org");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `You are a medical AI transparency assistant helping a patient look up an FDA-cleared AI medical device. The patient searched for: "${query}". Step 1: Search the FDA's AI-enabled medical devices list at https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices to find a matching device. Step 2: Retrieve and read its 510(k) summary from the FDA database. Step 3: Do not narrate your search process, do not explain what you are doing, do not say what you found or didn't find along the way. Go silent until you have the answer, then write your response in exactly this format — two labeled paragraphs, plain prose only, no bullet points, no emojis, no markdown:

What is this device?
[One plain paragraph. Explain what the device does in simple everyday language, who made it, and when the FDA cleared it. Write like you're explaining it to a friend, not a doctor.]

Who was it trained on?
[One plain paragraph. State exactly what demographic information the manufacturer disclosed about the patients used to test or train this AI — age, sex, race, ethnicity, geography, dataset size. If any of this was not disclosed, say so plainly and note that this is the transparency gap MedDisclosure.org is working to fix.]

If no matching device is found, write two short plain paragraphs under the same headers explaining that and suggesting the patient ask their care provider for the exact device name or 510(k) number.`
        }]
      }),
    });

    const data = await response.json();
    const text = (data.content || [])
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ result: text });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return res.status(500).json({ error: "Lookup failed" });
  }
}

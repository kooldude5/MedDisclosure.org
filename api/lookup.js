export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://meddisclosure.org");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  const systemPrompt = `You are a medical AI transparency assistant helping a patient look up an FDA-cleared AI medical device. Do not narrate your search process. Go silent until you have the final answer, then respond in exactly this format — two labeled paragraphs, plain prose only, no bullet points, no emojis, no markdown:

What is this device?
[One plain paragraph in simple everyday language: what it does, who made it, when the FDA cleared it.]

Who was it trained on?
[One plain paragraph: exactly what demographic information the manufacturer disclosed — age, sex, race, ethnicity, geography, dataset size. If not disclosed, say so plainly and note this is the transparency gap MedDisclosure.org is working to fix.]`;

  try {
    // First call — may trigger web search tool use
    let messages = [{
      role: "user",
      content: `Look up this FDA-cleared AI medical device: "${query}". Search https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices and retrieve the 510(k) summary document.`
    }];

    let finalText = "";
    let attempts = 0;

    while (attempts < 5) {
      attempts++;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",

        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          system: systemPrompt,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Anthropic error:", JSON.stringify(data));
        return res.status(500).json({ error: "API error", detail: data });
      }

      // Collect any text blocks from this response
      const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
      if (textBlocks.length > 0) finalText = textBlocks.join("\n").trim();

      // If stop_reason is end_turn, we have the final answer
      if (data.stop_reason === "end_turn") break;

      // If stop_reason is tool_use, feed the result back and continue
      if (data.stop_reason === "tool_use") {
        messages.push({ role: "assistant", content: data.content });
        // Add placeholder tool results for each tool use block
        const toolResults = (data.content || [])
          .filter(b => b.type === "tool_use")
          .map(b => ({
            type: "tool_result",
            tool_use_id: b.id,
            content: "Search completed.",
          }));
        messages.push({ role: "user", content: toolResults });
      } else {
        break;
      }
    }

    if (!finalText) {
      return res.status(200).json({ result: "We couldn't find that device right now. Try the exact company name or 510(k) number from your paperwork." });
    }

    return res.status(200).json({ result: finalText });
  } catch (err) {
    console.error("Lookup error:", err);
    return res.status(500).json({ error: "Lookup failed" });
  }
}

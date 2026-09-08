import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

serve(async (req) => {
  const { journalContent } = await req.json();
  const prompt = `Create ONE gentle, non-punitive recognition-style multiple-choice question about a concrete detail (who/what/where) from this dementia patient's own journal entry. Never about feelings or opinions. Return ONLY this JSON shape, nothing else:
{"question": "...", "correct_answer": "...", "wrong_options": ["...", "..."]}

Journal entry:
"""${journalContent}"""`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text ?? "{}";
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return new Response(JSON.stringify(parsed), { headers: { "content-type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "parse_failed" }), { status: 500 });
  }
});
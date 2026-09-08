import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

serve(async (req) => {
  const { journalContent } = await req.json();
  const prompt = `Create ONE gentle, non-punitive recognition-style multiple-choice question about a concrete detail (who/what/where) from this dementia patient's own journal entry. Never about feelings or opinions. Return ONLY this JSON shape, nothing else:
{"question": "...", "correct_answer": "...", "wrong_options": ["...", "..."]}

Journal entry:
"""${journalContent}"""`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return new Response(JSON.stringify(parsed), { headers: { "content-type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "parse_failed" }), { status: 500 });
  }
});
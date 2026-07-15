import { Agent, run } from "@openai/agents";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_AGENT_MODEL || "gpt-5.6";

function offlineResult(prompt) {
  return `
OpenAI Agents Sales Coach offline agent run

User input:
${prompt}

Agent output:
Summary:
This starter is ready for an OpenAI Agents SDK workflow.

Plan:
- Define the specialist in app/api/run/route.js.
- Keep instructions narrow and auditable.
- Add tools only after the single-agent loop works.
- Add guardrails before side effects or high-stakes actions.

Production checklist:
- Authentication
- Rate limits
- Tracing
- Human escalation
- Persistent conversation state
`.trim();
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      demo: true,
      model: "offline-fallback",
      output: offlineResult(prompt),
    });
  }

  try {
    const agent = new Agent({
      name: "OpenAI Agents Sales Coach",
      model: MODEL,
      instructions: `
A sales coaching agent starter for objection handling, call prep, and follow-up planning.

Return with:
Summary
Analysis
Recommended Workflow
Risks
Next Steps

Stay practical, concise, and production-minded.
`.trim(),
    });

    const result = await run(agent, prompt);

    return Response.json({
      demo: false,
      model: MODEL,
      output: result.finalOutput,
      lastAgent: result.lastAgent?.name || "OpenAI Agents Sales Coach",
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Agent run failed." },
      { status: 500 },
    );
  }
}

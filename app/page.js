"use client";

import { useMemo, useState } from "react";

const starterPrompts = [
  "A sales coaching agent starter for objection handling, call prep, and follow-up planning.",
  "Create a production-ready workflow with risks, data flow, and owner handoffs.",
  "Generate a sample user journey and API contract for this starter.",
  "Give me a launch checklist and extension roadmap for this template."
];
const metrics = [
  "Server route",
  "Responsive UI",
  "Env setup"
];
const steps = [
  "Capture input",
  "Run server route",
  "Return structured output"
];
const chips = [
  "Agent workflow",
  "Next.js",
  "OpenAI",
  "Mobile ready"
];
const endpoint = "/api/run";

export default function Home() {
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const status = useMemo(() => {
    if (isRunning) return "Running";
    if (result?.demo) return "Local response";
    if (result) return "Completed";
    return "Ready";
  }, [isRunning, result]);

  async function submit(event) {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isRunning) return;

    setIsRunning(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Template run failed.");
      setResult(data);
    } catch (runError) {
      setError(runError.message);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f2ff] text-[#171023]">
      <section className="mx-auto min-h-screen w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-[1.25rem] border bg-white border-purple-950/10 p-5 lg:col-span-2"><p className="text-xs font-black uppercase opacity-50">Agent workflow</p><h1 className="mt-4 text-4xl font-black sm:text-6xl">OpenAI Agents Sales Coach</h1><p className="mt-4 leading-8 opacity-65">A sales coaching agent starter for objection handling, call prep, and follow-up planning.</p></div>
          {chips.map((chip) => <div className="rounded-[1.25rem] bg-[#efe4ff] p-5" key={chip}><p className="text-xs font-black uppercase opacity-45">Tag</p><p className="mt-6 text-xl font-black">{chip}</p></div>)}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-[1.25rem] border bg-white border-purple-950/10 p-5"><h2 className="font-black">Prompt cards</h2><div className="mt-4 grid gap-3">{starterPrompts.map((example) => (
                <button
                  key={example}
                  className="w-full border border-current/10 bg-white/45 px-3 py-3 text-left text-sm leading-6 opacity-80 transition hover:opacity-100"
                  onClick={() => setPrompt(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}</div></div>
          <div className="rounded-[1.25rem] border bg-white border-purple-950/10 p-5"><form className="space-y-3" onSubmit={submit}>
              <textarea
                className="min-h-44 w-full resize-y border border-current/10 bg-white/70 px-4 py-3 text-sm leading-7 outline-none placeholder:opacity-40 focus:border-current/30"
                onChange={(event) => setPrompt(event.target.value)}
                value={prompt}
              />
              <button
                className="min-h-12 w-full px-5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 bg-violet-700 text-white hover:bg-violet-800"
                disabled={isRunning || !prompt.trim()}
                type="submit"
              >
                {isRunning ? "Running..." : "Run agent"}
              </button>
            </form><div className="mt-5">{error ? <div className="border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-100">{error}</div> : null}
            {result ? (
              <article className="border border-current/10 bg-white/60 p-4 text-sm leading-7 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>Result</strong>
                  <span className="border border-current/10 px-2 py-1 text-xs opacity-60">{result.model || "local"}</span>
                </div>
                <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap bg-black/5 p-4 text-sm leading-7">
                  {result.output || result.clientSecret || JSON.stringify(result, null, 2)}
                </pre>
              </article>
            ) : null}</div></div>
        </div>
      </section>
    </main>
  );
}

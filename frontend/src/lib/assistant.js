// -----------------------------------------------------------------------------
// Portfolio assistant — DEMO MODE (scripted answers).
//
// To make it real, replace the body of askAssistant() with a call to your own
// RAG / agent backend, e.g.:
//
//   const res = await fetch('/api/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ question }),
//   });
//   return (await res.json()).answer;
// -----------------------------------------------------------------------------

const KB = [
  {
    keys: ['agentforge', 'agent forge', 'website builder'],
    answer:
      'AgentForge is an autonomous AI website builder. It converts natural-language requirements into structured, deployable web applications using specialized AI agents.',
  },
  {
    keys: ['debug', 'self-heal', 'self heal', 'healing'],
    answer:
      'The Self-Healing Debugger is an autonomous debugging and recovery system. It detects application errors, analyzes root causes, generates fixes, tests them in isolated environments and validates regressions.',
  },
  {
    keys: ['fingrow', 'fintech', 'finance'],
    answer:
      'FinGrow is an AI-powered FinTech platform — a full-stack financial platform that combines modern web engineering with intelligent financial workflows.',
  },
  {
    keys: ['tech', 'stack', 'skill', 'tools', 'language', 'framework'],
    answer:
      'Pourush works across Agentic AI (LangGraph, MCP, tool calling), Generative AI (RAG, vector databases, embeddings, LLMs), Machine Learning (Scikit-learn, TensorFlow, deep learning) and full-stack development (React, FastAPI, Node.js, Docker).',
  },
  {
    keys: ['leetcode', 'dsa', 'problems'],
    answer: 'Pourush has solved 850+ LeetCode problems, alongside his AI/ML and full-stack work.',
  },
  {
    keys: ['hire', 'contact', 'opportunit', 'available', 'job', 'intern'],
    answer:
      "Pourush is open to AI/ML opportunities. Use the “Get in Touch” button at the bottom of the page to reach him.",
  },
  {
    keys: ['who', 'about', 'pourush', 'yourself', 'introduce'],
    answer:
      'Pourush Kashyap is an AI & Agentic AI Engineer. He builds intelligent systems using Generative AI, LLMs, RAG, AI agents and modern software engineering.',
  },
];

const FALLBACK =
  "I'm running in demo mode with a small set of answers. Try asking about AgentForge, the Self-Healing Debugger, FinGrow, or the technologies Pourush uses.";

export async function askAssistant(question) {
  await new Promise((r) => setTimeout(r, 650));
  const q = question.toLowerCase();
  const hit = KB.find((item) => item.keys.some((k) => q.includes(k)));
  return hit ? hit.answer : FALLBACK;
}

// -----------------------------------------------------------------------------
// All copy for the site lives here. Edit this file — not the components.
// -----------------------------------------------------------------------------

export const PROFILE = {
  name: 'Pourush Kashyap',
  initials: 'PK',
  role: 'AI & Agentic AI Engineer',
  navTagline: 'AI & Agentic AI Developer',
  badge: 'Open to AI/ML opportunities',
  intro:
    'I build intelligent systems that turn complex problems into production-ready AI applications.',
  stack: ['AI Agents', 'RAG', 'LangGraph', 'MCP', 'Machine Learning', 'Full Stack'],
  email: 'you@example.com', // TODO: replace with your email
  resumeUrl: '/resume.pdf', // put resume.pdf in /public
};

export const SOCIALS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/' }, // TODO: your profile URL
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { id: 'leetcode', label: 'LeetCode', href: 'https://leetcode.com/' },
];

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/journey', label: 'Journey' },
  { to: '/education', label: 'Education' },
];

// Node 0 in the hero scene is the agent itself; these orbit around it.
export const CORE_NODE = {
  name: 'Pourush AI Agent',
  desc: 'The agent at the centre — wired to every tool and technique on this orbit.',
};

export const ORBIT_NODES = [
  { name: 'LangGraph', desc: 'Agent orchestration & stateful workflows' },
  { name: 'RAG', desc: 'Retrieval pipelines that ground LLMs in real data' },
  { name: 'MCP', desc: 'Model Context Protocol — connecting agents to tools' },
  { name: 'AI Agents', desc: 'Autonomous, tool-using, multi-step systems' },
  { name: 'LLMs', desc: 'Prompting, reasoning and evaluation of language models' },
  { name: 'Python', desc: 'The backbone for AI, data and backend work' },
];

export const WHAT_I_BUILD = [
  {
    n: '01',
    title: 'Agentic AI',
    text: 'Autonomous agents, multi-agent workflows and tool-using systems.',
    tags: ['LangGraph', 'MCP', 'Tool Calling', 'Agents'],
  },
  {
    n: '02',
    title: 'Generative AI',
    text: 'LLM-powered applications designed around retrieval, context and reasoning.',
    tags: ['RAG', 'Vector DB', 'Embeddings', 'LLMs'],
  },
  {
    n: '03',
    title: 'Machine Learning',
    text: 'Machine learning and deep learning systems for real-world problems.',
    tags: ['Scikit-learn', 'TensorFlow', 'Deep Learning'],
  },
  {
    n: '04',
    title: 'AI + Full Stack',
    text: 'Turning AI models into usable, scalable applications.',
    tags: ['React', 'FastAPI', 'Node.js', 'Docker'],
  },
];

export const FEATURED_PROJECTS = [
  {
    n: '01',
    name: 'AgentForge',
    kicker: 'Autonomous AI Website Builder',
    text: 'Converts natural-language requirements into structured, deployable web applications using specialized AI agents.',
    tags: ['Multi-agent', 'Code generation', 'Deployment'],
  },
  {
    n: '02',
    name: 'Self-Healing Debugger',
    kicker: 'Autonomous Debugging & Recovery System',
    text: 'Detects application errors, analyzes root causes, generates fixes, tests them in isolated environments and validates regressions.',
    tags: ['Root-cause analysis', 'Isolated testing', 'Regression checks'],
  },
  {
    n: '03',
    name: 'FinGrow',
    kicker: 'AI-Powered FinTech Platform',
    text: 'Full-stack financial platform combining modern web engineering with intelligent financial workflows.',
    tags: ['Full stack', 'FinTech', 'AI workflows'],
  },
];

export const SNAPSHOT = [
  { value: 850, suffix: '+', label: 'LeetCode problems', sub: 'Data structures & algorithms' },
  { text: 'AI / ML', label: 'Core focus', sub: 'Generative AI · LLMs · ML' },
  { text: 'Agentic AI', label: 'Specialisation', sub: 'LangGraph · MCP' },
  { text: 'Full Stack', label: 'Product engineering', sub: 'React · Python · Node' },
];

export const PROCESS = [
  { title: 'Research', text: 'Frame the problem, constraints and success criteria.' },
  { title: 'Architecture', text: 'Design agents, data flow and interfaces.' },
  { title: 'Build', text: 'Implement with clean, maintainable code.' },
  { title: 'Evaluate', text: 'Measure quality with evals, not guesswork.' },
  { title: 'Test', text: 'Unit, integration and regression checks.' },
  { title: 'Deploy', text: 'Ship, monitor and keep iterating.' },
];

export const ASSISTANT_PROMPTS = [
  'What is AgentForge?',
  'Explain your Self-Healing Debugger',
  'What technologies does Pourush use?',
];

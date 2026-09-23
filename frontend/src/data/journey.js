export const STAGES = [
  { n: '01', title: 'Full Stack Development', focus: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Tailwind'],
    story: 'I started by learning how to build complete web applications, from responsive interfaces to backend APIs and databases.',
    taught: 'How to structure applications, design APIs and connect different parts of a software system.' },
  { n: '02', title: 'Machine Learning', focus: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'Feature Engineering', 'Model Evaluation'],
    story: 'I moved from deterministic software toward systems that could learn patterns from data.',
    taught: 'Data preprocessing, model selection, training, evaluation and the importance of measuring model performance.',
    projects: ['FitGenius AI'] },
  { n: '03', title: 'Deep Learning', focus: ['Neural Networks', 'CNN', 'RNN', 'LSTM', 'TensorFlow'],
    story: 'I explored neural networks and learned how models can learn increasingly complex representations from data.',
    taught: 'Model architecture, training behavior, feature representations and evaluation.',
    projects: ['Crime Scene Detection', 'SilentSOS'] },
  { n: '04', title: 'Generative AI', focus: ['LLMs', 'Prompt Engineering', 'Embeddings', 'Gemini', 'LLM Applications'],
    story: 'My focus shifted from traditional predictive models toward systems capable of understanding and generating natural language.',
    taught: 'How to turn language models into useful application features.' },
  { n: '05', title: 'RAG', focus: ['Embeddings', 'FAISS', 'Chroma', 'Retrieval', 'Context', 'Document Processing'],
    flow: 'Documents → Chunking → Embeddings → Vector Store → Retriever → LLM → Grounded Answer',
    story: 'I started building systems that combine retrieval with language models.',
    taught: 'AI systems need access to the right context, not just a powerful model.',
    projects: ['PDF RAG'] },
  { n: '06', title: 'Agentic AI', focus: ['LangChain', 'LangGraph', 'Tools', 'Memory', 'MCP', 'Multi-Agent Systems'],
    flow: 'Planner → Agents → Tools · Memory · MCP → Result',
    story: 'I began exploring systems where LLMs can reason over tasks, use tools, maintain state and coordinate multiple steps.',
    taught: 'Orchestration, state and tool use matter as much as the model itself.' },
  { n: '07', title: 'Autonomous AI Systems', focus: ['Multi-Agent Architecture', 'AI Workflows', 'Self-Healing Systems', 'Evaluation', 'Sandboxing', 'Reliability'],
    story: 'My current focus is moving beyond individual AI features toward complete systems that can plan, execute, evaluate and recover from failures.',
    taught: 'Where the journey is heading — reliable, evaluated, self-recovering systems.',
    projects: ['AgentForge', 'Self-Healing Debugger'], current: true },
];

export const MILESTONES = [
  { big: 'CSE ’27', label: 'Computer Science', sub: 'B.Tech, CT University' },
  { count: 850, suffix: '+', label: 'LeetCode', sub: 'Consistent problem solving' },
  { big: 'Best Startup', label: 'Award', sub: 'Code Crafter 2.0' },
  { big: 'AI / Agentic', label: 'Focus', sub: 'Current direction' },
];

export const STACK_YEARS = [
  { year: '2023', items: ['JavaScript', 'React', 'Node', 'MongoDB'] },
  { year: '2024', items: ['Python', 'ML', 'Pandas', 'Scikit-learn'] },
  { year: '2025', items: ['TensorFlow', 'Deep Learning', 'LLMs', 'RAG'] },
  { year: '2026', items: ['LangGraph', 'MCP', 'Agents', 'Multi-Agent', 'Docker'] },
];

const K = (label, x, y, z, extra = {}) => ({ label, pos: [x, y, z], ...extra });
export const KNOWLEDGE = {
  nodes: [
    K('Python', -5, 0, 0, { kind: 'core', size: 0.7 }),
    K('ML', -2.9, 2.2, 0.5), K('Deep Learning', -2.9, 0.2, -0.5), K('GenAI', -2.9, -2, 0.5),
    K('FitGenius', -0.4, 2.7, -0.3, { kind: 'gem' }), K('Crime Scene', -0.4, 1.2, 0.6, { kind: 'gem' }), K('SilentSOS', -0.4, -0.2, -0.5, { kind: 'gem' }),
    K('RAG', -0.4, -1.5, 0.5), K('Agents', -0.4, -3, -0.4),
    K('PDF RAG', 2.6, -1.4, 0.2, { kind: 'gem' }), K('AgentForge', 2.6, -2.5, -0.5, { kind: 'gem' }), K('Self-Healing Debugger', 2.6, -3.6, 0.5, { kind: 'gem' }),
  ],
  edges: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 5], [2, 6], [3, 7], [3, 8], [7, 9], [8, 10], [8, 11]],
};

export const FOCUS_CARDS = [
  { title: 'Multi-Agent Systems', text: 'Designing systems where specialized agents collaborate on complex workflows.' },
  { title: 'MCP', text: 'Exploring standardized ways for AI systems to interact with tools and external context.' },
  { title: 'AI Evaluation', text: 'Understanding how to measure quality, reliability and behavior of AI systems.' },
  { title: 'Production AI', text: 'Moving from prototypes toward deployable, observable and reliable systems.' },
];

export const EQUATION = ['AI Research', 'System Design', 'Agentic AI', 'Software Engineering', 'Deployment'];

export const ROADMAP = [
  { title: 'Agentic AI', text: 'Deepening tool-using agents, LangGraph state machines and memory.', now: true },
  { title: 'AI Evaluation', text: 'Building repeatable evals to measure agent and RAG quality.' },
  { title: 'Production AI', text: 'Observability, deployment and reliability for AI services.' },
  { title: 'Multi-Agent Systems', text: 'Coordinating specialised agents on larger, longer workflows.' },
  { title: 'Autonomous Software', text: 'Systems that plan, execute, evaluate and recover on their own.' },
];

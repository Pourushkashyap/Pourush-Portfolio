const N = (label, x, y, z = 0, extra = {}) => ({ label, pos: [x, y, z], ...extra });

export const CATEGORIES = ['All', 'Agentic AI', 'Generative AI', 'Machine Learning', 'Full Stack'];

export const SYSTEM_TYPES = [
  { n: '01', title: 'Agentic AI', items: ['LangGraph', 'MCP', 'Multi-Agent', 'Tool Calling'] },
  { n: '02', title: 'Generative AI', items: ['RAG', 'LLMs', 'Embeddings', 'Vector Search'] },
  { n: '03', title: 'ML / Deep Learning', items: ['TensorFlow', 'Scikit-learn', 'Neural Networks'] },
  { n: '04', title: 'AI + Full Stack', items: ['React', 'FastAPI', 'Node.js', 'Docker'] },
];

export const PROJECTS = [
  { slug: 'agentforge', tier: 1, name: 'AgentForge', sub: 'Autonomous AI Website Builder', cats: ['Agentic AI', 'Generative AI'], tags: ['LangGraph', 'LLM', 'Docker'], viz: 'agents', text: 'Turns a plain-language idea into a planned, generated, tested and deployed web app using specialized agents.',Github:'' },
  { slug: 'self-healing-debugger', tier: 1, name: 'Self-Healing Debugger', sub: 'Autonomous debugging and self-recovery', cats: ['Agentic AI'], tags: ['LangGraph', 'FastAPI', 'Docker', 'AST', 'Agents'], viz: 'loop', text: 'Detects errors, finds root causes, generates fixes, tests them in a sandbox and validates regressions.',Github:'https://github.com/Pourushkashyap/Self-healing-Debugger' },
  { slug: 'fingrow', tier: 1, name: 'FinGrow', sub: 'AI-enabled peer-to-peer lending platform', cats: ['Full Stack', 'Machine Learning'], tags: ['React', 'Node', 'MongoDB', 'AI/ML'], viz: 'finance', text: 'Full-stack financial platform for peer-to-peer lending workflows with intelligent decision support.',Github:'https://github.com/Pourushkashyap/FinGrow' },
  { slug: 'fitgenius', tier: 2, name: 'FitGenius AI', sub: 'Personalised diet & workout recommendations', cats: ['Machine Learning', 'Full Stack'], tags: ['Python', 'Scikit-learn', 'Flask', 'React'], viz: 'pipeline', text: 'ML recommendation system that turns user data into tailored diet and workout plans.',Github:'https://github.com/Pourushkashyap/FitGenius-AI' },
  { slug: 'CodePilot-AI', tier: 2, name: 'CodePilot AI', sub: 'Computer vision for crime-scene analysis', cats: ['Machine Learning'], tags: ['YOLOv8', 'Flask', 'React', 'Computer Vision'], viz: 'vision', text: 'Object detection pipeline that identifies relevant items in crime-scene imagery.',Github:'https://github.com/Pourushkashyap/CodePilot-AI' },
  { slug: 'silentsos', tier: 2, name: 'SilentSOS', sub: 'Voice-based intelligent safety system', cats: ['Machine Learning', 'Full Stack'], tags: ['React Native', 'Python', 'MFCC', 'ML'], viz: 'audio', text: 'Mobile safety app that analyses voice features to trigger help when it matters.',Github:'https://github.com/Pourushkashyap/SilentSOS' },
  // { slug: 'instagram-clone', tier: 3, name: 'Instagram Clone', sub: 'Full-stack social app', cats: ['Full Stack'], tags: ['Full Stack'], viz: 'app' },
  // { slug: 'swiggy-clone', tier: 3, name: 'Swiggy Clone', sub: 'Food-ordering app', cats: ['Full Stack'], tags: ['Full Stack'], viz: 'app' },
  // { slug: 'netflix-clone', tier: 3, name: 'Netflix Clone', sub: 'Streaming UI', cats: ['Full Stack'], tags: ['Full Stack'], viz: 'app' },
  // { slug: 'portfolio', tier: 3, name: 'Portfolio', sub: 'This site — React, Tailwind, 3D', cats: ['Full Stack'], tags: ['React', 'Tailwind'], viz: 'app' },
];

/* ------------------------------ AgentForge ------------------------------ */
export const AGENTFORGE = {
  nodes: [
    N('User Idea', -5, 0.3, 0, { kind: 'gem', desc: 'A natural-language description of the website or app the user wants.' }),
    N('Analyzer', -3.9, -0.6, 0.7, { desc: 'Requirement Analyzer — turns the idea into structured, testable requirements.' }),
    N('Master Planner', -2.7, 0.5, -0.5, { size: 1.5, desc: 'Breaks the project into coordinated frontend, backend and infrastructure tasks.' }),
    N('Frontend', -1.4, 1.5, 0.8, { desc: 'Frontend Planner — generates the implementation plan for the frontend.' }),
    N('Backend', -1.4, 0, -0.6, { desc: 'Backend Planner — plans APIs, services and business logic.' }),
    N('Database', -1.4, -1.5, 0.7, { desc: 'Database Planner — designs the data models and storage layer.' }),
    N('Generators', 0.1, 0.3, 0, { size: 1.5, desc: 'Generator Agents — write the code for each planned component.' }),
    N('Docker', 1.5, -0.7, 0.7, { desc: 'Packages the generated application into a reproducible container.' }),
    N('Build / Test', 2.9, 0.5, -0.5, { desc: 'Builds the project and runs tests; failures feed back to the agents.' }),
    N('Deploy', 4.3, -0.3, 0.4, { kind: 'gem', desc: 'Ships the tested application so it is live and running.' }),
  ],
  edges: [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [3, 6], [4, 6], [5, 6], [6, 7], [7, 8], [8, 9]],
};

/* ----------------------- Project visuals (3D panels) ----------------------- */
export const DEBUGGER = {
  nodes: [
    N('Error', -3.2, 0.2, 0, { kind: 'gem', desc: 'A runtime error or failing test is detected.' }),
    N('Analyze', -1.6, 1.4, 0.6, { desc: 'Traces the failure to a root cause (e.g. via AST and stack analysis).' }),
    N('Generate Fix', 0.4, 1.6, -0.4, { size: 1.3, desc: 'An agent proposes a patch for the root cause.' }),
    N('Sandbox', 2.1, 0.9, 0.6, { desc: 'Applies the patch in an isolated environment.' }),
    N('Test', 2.1, -0.9, -0.5, { desc: 'Runs tests and regression checks against the patch.' }),
    N('Deploy', 3.9, -1.0, 0.3, { kind: 'gem', desc: 'Passing fixes are promoted.' }),
    N('Retry', 0, -1.6, 0.5, { desc: 'Failing fixes loop back to analysis with new information.' }),
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [6, 1]],
};

export const FINGROW = {
  nodes: [
    N('Borrower', -3, 0.2, 0, { kind: 'gem', desc: 'Requests a loan through the platform.' }),
    N('Risk Engine', -1, 0.9, 0.6, { size: 1.3, desc: 'AI/ML-assisted assessment of borrower risk.' }),
    N('Loan', 1, -0.3, -0.5, { desc: 'A structured, trackable loan record.' }),
    N('Investor', 3, 0.6, 0.4, { kind: 'gem', desc: 'Funds loans and follows repayment.' }),
  ],
  edges: [[0, 1], [1, 2], [2, 3]],
};

export const FITGENIUS = {
  nodes: [
    N('User Data', -3.6, 0, 0, { kind: 'gem', desc: 'Body metrics, goals and preferences.' }),
    N('Features', -1.8, 0.7, 0.5, { desc: 'Feature engineering on raw user data.' }),
    N('Model', 0, -0.4, -0.4, { size: 1.3, desc: 'Scikit-learn model trained on the features.' }),
    N('Prediction', 1.8, 0.6, 0.4, { desc: 'The model output for this user.' }),
    N('Plan', 3.6, -0.2, 0, { kind: 'gem', desc: 'A tailored diet and workout recommendation.' }),
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
};

/* ------------------------------ AI Systems Lab ------------------------------ */
export const LAB = {
  overview: {
    label: 'Overview',
    nodes: [
      N('Intelligence', 0, 2, 0, { kind: 'core', size: 0.9, desc: 'The shared foundation behind every system I build.' }),
      N('Agents', -3, 0.3, 0.3, { desc: 'Planning, tool-using, multi-step systems.' }),
      N('RAG', 0, 0.3, 0.8, { desc: 'Retrieval-grounded language-model applications.' }),
      N('ML', 3, 0.3, 0.3, { desc: 'Models trained on data for prediction.' }),
      N('LangGraph', -3, -1.2, -0.4, { desc: 'Stateful agent orchestration.' }),
      N('Vector DB', 0, -1.2, 0, { desc: 'Embedding search over documents.' }),
      N('Models', 3, -1.2, -0.4, { desc: 'Trained ML / DL models.' }),
      N('Applications', 0, -2.7, 0.2, { kind: 'gem', desc: 'Where it all becomes a product people use.' }),
    ],
    edges: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 5], [3, 6], [4, 7], [5, 7], [6, 7]],
  },
  agents: {
    label: 'Agents',
    nodes: [
      N('User', -4, 0, 0, { kind: 'gem', desc: 'Sends a goal or request.' }),
      N('Planner', -2.2, 0, 0.4, { size: 1.3, desc: 'Decomposes the goal into tasks.' }),
      N('Agent A', -0.3, 1.3, -0.4, { desc: 'A specialised worker agent.' }),
      N('Agent B', -0.3, -1.3, 0.6, { desc: 'Another specialised worker agent.' }),
      N('Tools', 1.8, 1.3, 0.3, { desc: 'APIs, code execution, search, MCP servers.' }),
      N('Memory', 1.8, -1.3, -0.4, { desc: 'Short- and long-term state shared across steps.' }),
      N('Result', 3.9, 0, 0, { kind: 'gem', desc: 'The final, validated output.' }),
    ],
    edges: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6]],
  },
  rag: {
    label: 'RAG',
    nodes: [
      N('Documents', -4.2, -0.4, 0, { kind: 'gem', desc: 'PDFs, web pages, notes — the knowledge source.' }),
      N('Chunking', -2.8, 0.7, 0.5, { desc: 'Splits documents into retrievable pieces.' }),
      N('Embeddings', -1.4, -0.5, -0.4, { desc: 'Turns text chunks into vectors.' }),
      N('Vector DB', 0, 0.7, 0.5, { size: 1.3, desc: 'FAISS / Chroma store for similarity search.' }),
      N('Retriever', 1.4, -0.5, -0.4, { desc: 'Finds the most relevant chunks for a query.' }),
      N('LLM', 2.8, 0.7, 0.5, { size: 1.3, desc: 'Generates an answer from the query plus retrieved context.' }),
      N('Answer', 4.2, -0.3, 0, { kind: 'gem', desc: 'A grounded, source-backed response.' }),
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
  ml: {
    label: 'ML',
    nodes: [
      N('Data', -3.8, 0, 0, { kind: 'gem', desc: 'Raw, real-world data.' }),
      N('Preprocessing', -2.3, 0.8, 0.5, { desc: 'Cleaning, encoding, scaling.' }),
      N('Features', -0.8, -0.6, -0.4, { desc: 'Feature engineering and selection.' }),
      N('Model', 0.8, 0.8, 0.5, { size: 1.3, desc: 'Training a Scikit-learn / TensorFlow model.' }),
      N('Evaluation', 2.3, -0.6, -0.4, { desc: 'Metrics, validation and error analysis.' }),
      N('Prediction', 3.8, 0.3, 0, { kind: 'gem', desc: 'Inference inside an application.' }),
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
};

export const HIGHLIGHTS = [
  { title: 'System Design', text: 'Designing multiple components that work together rather than isolated scripts.' },
  { title: 'AI Orchestration', text: 'Managing state, tools, memory and agent workflows.' },
  { title: 'Evaluation', text: 'Measuring whether an AI system actually performs its intended task.' },
  { title: 'Deployment', text: 'Moving AI applications from local development toward production.' },
  { title: 'Reliability', text: 'Handling failures, retries, validation and safe execution.' },
];

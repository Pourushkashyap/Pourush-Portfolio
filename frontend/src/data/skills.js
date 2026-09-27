export const AREAS = {
  Agents: ['LangGraph', 'LangChain', 'MCP', 'Tool Calling', 'Memory', 'Planning'],
  RAG: ['Embeddings', 'Vector Search', 'FAISS', 'Chroma', 'Retrieval', 'Context Compression'],
  ML: ['Scikit-learn', 'TensorFlow', 'Pandas', 'NumPy', 'Feature Engineering', 'Model Evaluation'],
  'Full Stack': ['React', 'FastAPI', 'Node.js', 'MongoDB', 'REST APIs', 'Tailwind CSS'],
  Deployment: ['Docker', 'Docker Compose', 'Git / GitHub', 'CI/CD', 'Cloud Deployment', 'Env Configuration'],
};

export const HERO_STACK = ['Python', 'C++', 'JavaScript', 'React', 'LangGraph', 'RAG', 'TensorFlow', 'FastAPI', 'Node.js', 'MongoDB', 'Docker'];

export const CORE = [
  { n: '01', title: 'AI & Agentic AI', text: 'Build intelligent workflows, AI agents and multi-step systems.', tags: ['LangGraph', 'LangChain', 'MCP', 'Tool Calling', 'Agents'] },
  { n: '02', title: 'Machine Learning', text: 'Build, train and evaluate ML/DL models for real-world applications.', tags: ['Scikit-learn', 'TensorFlow', 'Pandas', 'NumPy'] },
  { n: '03', title: 'Generative AI', text: 'Build LLM-powered applications with retrieval, embeddings and contextual knowledge.', tags: ['RAG', 'Embeddings', 'Vector DB', 'LLMs'] },
  { n: '04', title: 'Full-Stack Engineering', text: 'Turn AI capabilities into complete, usable applications.', tags: ['React', 'FastAPI', 'Node.js', 'MongoDB', 'Docker'] },
];

export const SECTIONS = [
  {
    id: 'agentic', n: '03', title: 'AI &', accent: 'Agentic AI',
    groups: [
      { title: 'AI Agents', items: ['LangGraph', 'LangChain', 'Agent Workflows', 'Multi-Agent Systems', 'Tool Calling', 'State Management', 'Memory', 'Planning'] },
      { title: 'Model Context Protocol', items: ['MCP', 'MCP Servers', 'Tool Integration', 'External Context', 'AI ↔ Tools'] },
      { title: 'AI Engineering', items: ['Prompt Engineering', 'Structured Outputs', 'AI Workflows', 'Agent Evaluation', 'Context Management', 'Error Handling'] },
    ],
  },
  {
    id: 'ml', n: '04', title: 'Machine Learning &', accent: 'Deep Learning',
    groups: [
      { title: 'Machine Learning', items: ['Supervised Learning', 'Unsupervised Learning', 'Regression', 'Classification', 'Feature Engineering', 'Model Evaluation', 'Data Preprocessing'] },
      { title: 'Deep Learning', items: ['Neural Networks', 'CNN', 'RNN', 'LSTM', 'Transfer Learning', 'Model Training'] },
      { title: 'Libraries', items: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Matplotlib'] },
    ],
  },
  {
    id: 'engineering', n: '06', title: 'Software', accent: 'Engineering',
    intro: 'An AI engineer who can actually ship software — not just notebooks.',
    groups: [
      { title: 'Frontend', items: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Vite', 'Zustand', 'Redux Toolkit', 'Axios'] },
      { title: 'Backend', items: ['Python', 'FastAPI', 'Flask', 'Node.js', 'Express.js', 'REST APIs', 'Authentication', 'API Integration'] },
      { title: 'Software Engineering', items: ['System Design', 'API Design', 'Git', 'GitHub', 'Debugging', 'Testing', 'Error Handling'] },
    ],
  },
];

export const DATA_SKILLS = {
  app: { title: 'Application data', items: ['MongoDB', 'PostgreSQL', 'MySQL'] },
  ai: { title: 'AI knowledge', items: ['FAISS', 'Chroma'] },
  data: { title: 'Data work', items: ['Pandas', 'NumPy', 'Data Cleaning', 'Feature Engineering'] },
};

export const DEVOPS = {
  tools: ['Docker', 'Docker Compose', 'Dockerfile', 'GitHub', 'CI/CD', 'Environment Configuration', 'Containerization', 'Cloud Deployment'],
  can: ['Containerize applications', 'Build reproducible environments', 'Run services with Docker Compose', 'Deploy backend / frontend systems', 'Configure environment variables', 'Debug deployment issues'],
};

export const WORKFLOW = [
  ['IDE', 'VS Code'],
  ['Version control', 'Git / GitHub'],
  ['Development', 'React / Python / Node'],
  ['Testing', 'API / Model / System testing'],
  ['Containerization', 'Docker'],
  ['Deployment', 'Cloud / Production'],
];

export const CONTRIBUTE = [
  { title: 'Build AI Agents', text: 'Design tool-using agents and multi-step workflows using LangGraph, LangChain and MCP.', tags: ['Agents', 'Planning', 'Tools', 'Memory', 'MCP'] },
  { title: 'Build RAG Applications', text: 'Develop document-based and knowledge-grounded AI applications.', tags: ['Document Processing', 'Embeddings', 'Vector Search', 'Retrieval', 'LLM'] },
  { title: 'Integrate AI Into Products', text: 'Connect AI models and agents to real web applications and APIs.', tags: ['React', 'FastAPI', 'Node.js', 'Python', 'REST APIs'] },
  { title: 'Build ML Solutions', text: 'Train and integrate machine learning models into application workflows.', tags: ['Preprocessing', 'Feature Engineering', 'Training', 'Evaluation', 'Inference'] },
  { title: 'Build & Deploy AI Systems', text: 'Package and deploy applications using containers and modern development workflows.', tags: ['Docker', 'Docker Compose', 'Git', 'Cloud'] },
];

export const ROLES = [
  { title: 'AI / ML Intern', items: ['ML models', 'Data preprocessing', 'Model evaluation', 'Python'] },
  { title: 'AI Engineering Intern', items: ['LLM applications', 'RAG', 'Agents', 'LangGraph'] },
  { title: 'Full-Stack AI', items: ['React', 'FastAPI / Node', 'Databases', 'AI integration'] },
];

export const PROFICIENCY = [
  { title: 'Core', sub: 'Technologies I use regularly', items: ['Python', 'C++', 'React', 'JavaScript', 'LangGraph', 'LangChain', 'RAG', 'MongoDB'] },
  { title: 'Working knowledge', sub: 'Comfortable building with', items: ['TensorFlow', 'FastAPI', 'Node.js', 'Docker', 'FAISS', 'Chroma', 'PostgreSQL'] },
  { title: 'Exploring', sub: 'Currently learning', items: ['MCP', 'AI Evaluation', 'Multi-Agent Systems', 'Production AI'] },
];

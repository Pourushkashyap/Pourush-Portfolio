// -----------------------------------------------------------------------------
// Case-study content for the Projects → detail pages.
// Written from what's already established about each project (data/projects.js).
// Swap in real screenshots, metrics and links (github/live) as they become available.
// -----------------------------------------------------------------------------

export const CASE_STUDIES = {
  /* ------------------------------- AgentForge ------------------------------- */
  agentforge: {
    tagline: "Natural language in. A deployed, working web app out.",
    overview:
      "AgentForge turns a plain-language product idea into a structured, generated and deployed web application. Instead of one model doing everything, the work is split across specialised agents that plan, build, test and ship the result — the same division of labour a small engineering team would use.",
    problem:
      "A single LLM call can produce a plausible-looking app, but it has no way to check its own architecture, split frontend from backend concerns, or recover when generated code fails to build. AgentForge exists to turn “generate some code” into a coordinated, verifiable build pipeline.",
    graph: "AGENTFORGE",
    workflow: [
      { title: "Requirement Analyzer", text: "Turns the free-text idea into structured, testable requirements." },
      { title: "Master Planner", text: "Breaks the project into coordinated frontend, backend and infrastructure tasks." },
      { title: "Frontend / Backend / Database Planners", text: "Three specialised planners design their slice of the system in parallel." },
      { title: "Generator Agents", text: "Write the actual code for each planned component." },
      { title: "Docker", text: "Packages the generated app into a reproducible container." },
      { title: "Build / Test", text: "Builds the project and runs tests; failures feed back to the generator agents." },
      { title: "Deploy", text: "Ships the tested application so it is live and running." },
    ],
    implementation: [
      { title: "Orchestration", text: "LangGraph coordinates the planner and generator agents as a stateful graph, not a single linear prompt chain." },
      { title: "Isolation", text: "Docker gives every generated project a clean, reproducible environment to build and test in." },
      { title: "Interfaces", text: "FastAPI exposes the pipeline so it can be triggered and monitored from a React front end." },
    ],
    challenges: [
      { title: "Keeping agents in sync", text: "Frontend, backend and database planners work in parallel but still have to agree on one contract (routes, schemas, types)." },
      { title: "Recovering from bad generations", text: "Generated code has to be buildable, not just plausible — failing builds need to route back to the right agent instead of failing the whole run." },
      { title: "Scope control", text: "Turning an open-ended idea into a bounded, shippable plan without the scope quietly expanding." },
    ],
    evaluation:
      "Success is measured at the pipeline level, not just “did the model respond”: does the generated project build, does it pass its own tests, and does it deploy without manual intervention.",
    future: [
      "Feedback loop from deployed-app errors back into the planning stage",
      "Support for extending an existing AgentForge-built app, not just generating new ones",
      "Pluggable planners for additional stacks beyond the current default",
    ],
  },

  /* --------------------------- Self-Healing Debugger -------------------------- */
  /* --------------------------- Self-Healing Debugger -------------------------- */
"self-healing-debugger": {
  tagline:
    "An autonomous debugging agent that detects, diagnoses, patches and validates Python bugs safely.",

  overview:
    "Self-Healing Debugger is a multi-agent AI debugging system built with LangGraph, FastAPI and React. It takes buggy Python code, executes it to capture the runtime failure, identifies the failing function using Python AST analysis, uses Gemini to diagnose the root cause and generate a structured patch, validates the patch statically, tests it inside an isolated sandbox, runs regression tests and finally applies the fix when it passes. High-risk changes can pause the workflow for explicit human approval before the original file is modified.",

  problem:
    "Traditional debugging requires developers to manually inspect a traceback, locate the failing code, understand the root cause, implement a fix and run tests. A simple LLM-generated fix is not enough because generated code can introduce new errors or unsafe changes. The goal of this system is to automate the debugging loop while keeping validation, isolation, retry limits and human approval between the AI-generated patch and the real source code.",

  graph: "DEBUGGER",

  workflow: [
    {
      title: "Run Project",
      text:
        "The system executes the submitted Python entry file and captures stdout, stderr and the process exit code."
    },
    {
      title: "Detect Error",
      text:
        "The runtime traceback is parsed into a structured error report containing the error type, message, file, line number, function and stack trace."
    },
    {
      title: "Extract Source Context",
      text:
        "Python's AST module locates the function containing the failing line and extracts its source code, parameters and called functions."
    },
    {
      title: "Diagnose Root Cause",
      text:
        "Gemini analyzes the structured error and source context to explain the root cause, failing statement and diagnosis confidence."
    },
    {
      title: "Retrieve Related Code",
      text:
        "An AST-based depth-first retriever follows functions called by the failing function, with bounded depth and cycle protection, to provide additional context."
    },
    {
      title: "Generate Patch",
      text:
        "Gemini generates a complete replacement for only the failing function while preserving its name and parameters."
    },
    {
      title: "Validate Patch",
      text:
        "The generated function is parsed with AST validation and checked for syntax errors, signature changes and dangerous operations before execution."
    },
    {
      title: "Sandbox Test",
      text:
        "The validated patch is applied to a temporary copy of the project and executed there so the original source remains untouched during testing."
    },
    {
      title: "Regression Analysis",
      text:
        "The system runs pytest when available and uses Gemini to decide whether the patch should pass, retry or fail."
    },
    {
      title: "Risk & Human Approval",
      text:
        "Changes targeting sensitive paths such as authentication, payment, login, password, token or security files are classified as high risk and require human approval."
    },
    {
      title: "Apply Patch",
      text:
        "Approved or low-risk fixes are written back to the original file after creating a .bak backup of the previous version."
    }
  ],

  implementation: [
    {
      title: "Agent Orchestration",
      text:
        "LangGraph implements the debugging workflow as a stateful graph with conditional routing between detection, diagnosis, retrieval, patching, validation, testing, risk assessment and approval."
    },
    {
      title: "LLM Reasoning",
      text:
        "Google Gemini 2.5 Flash is used with structured outputs for root-cause diagnosis, patch generation and final regression analysis."
    },
    {
      title: "AST-Based Code Analysis",
      text:
        "Python's built-in ast module is used to locate functions, inspect called functions, retrieve related source code and safely replace the target function instead of relying on regex-based code editing."
    },
    {
      title: "Patch Validation",
      text:
        "Generated patches must contain valid Python syntax, preserve the original function name and parameters, and avoid configured dangerous functions and APIs."
    },
    {
      title: "Sandbox Execution",
      text:
        "Each candidate patch is tested in a temporary copied project using subprocess execution with a timeout, preventing an unverified patch from directly modifying the working source."
    },
    {
      title: "Regression Testing",
      text:
        "After sandbox execution succeeds, the system runs the project's pytest suite when available and records passed, failed and skipped regression results."
    },
    {
      title: "Human-in-the-Loop",
      text:
        "LangGraph interrupt() pauses high-risk runs and preserves the graph state until the user explicitly approves or rejects the proposed patch."
    },
    {
      title: "Backend & Frontend",
      text:
        "FastAPI exposes /api/debug and /api/approve endpoints, while React and Tailwind CSS provide the code editor, pipeline trace, diagnosis, patch, test result and approval interface."
    }
  ],

  challenges: [
    {
      title: "Generating safe code changes",
      text:
        "An LLM-generated patch must not be trusted simply because it looks correct. The system therefore validates syntax, function identity, parameters and potentially dangerous operations before testing it."
    },
    {
      title: "Understanding code dependencies",
      text:
        "Diagnosing a function in isolation can miss information from helper functions. The AST retriever follows called functions recursively up to a bounded depth while avoiding cycles."
    },
    {
      title: "Testing without modifying the real project",
      text:
        "A generated patch can introduce new runtime failures. The system copies the project into a temporary sandbox and tests the candidate there before touching the original source."
    },
    {
      title: "Preventing endless repair loops",
      text:
        "Failed validation or testing can send the workflow back to patch generation, but the retry count is capped at three attempts to prevent uncontrolled loops."
    },
    {
      title: "Risk-based automation",
      text:
        "Not every file should be modified automatically. Sensitive file paths are classified as high risk and require an explicit human approval decision before the patch is applied."
    }
  ],

  evaluation:
    "The system evaluates a generated fix across multiple stages rather than accepting an LLM response directly. A candidate must pass static patch validation, execute successfully inside the sandbox and pass available regression tests before it can reach the risk and approval stage. The frontend exposes the detected error, diagnosis, confidence, proposed patch, sandbox result and final status so the debugging process is observable rather than a hidden model call.",

  future: [
    "Add multi-language debugging using tree-sitter and language-specific execution and error parsers.",
    "Add a behavior-preservation agent to detect fixes that stop the crash but unintentionally change the function's intended behavior.",
    "Add a multi-error loop that automatically re-runs error detection after a successful fix.",
    "Persist a complete audit history of errors, diagnoses, patches, approvals and test results.",
    "Add stronger project-level test discovery and test-quality analysis.",
    "Introduce confidence-based routing so uncertain fixes can be sent to human review even when the file itself is not classified as sensitive."
  ],
},

  /* --------------------------------- FinGrow --------------------------------- */
  /* --------------------------------- FinGrow --------------------------------- */
fingrow: {
  tagline:
    "A multi-service fintech platform combining P2P lending, KYC, financial analysis and market insights.",

  overview:
    "FinGrow is a full-stack fintech platform built around a peer-to-peer lending workflow. Users can create accounts, complete KYC verification, create or browse loan offers, and manage loan-related information through the application. The platform also includes a separate Python/Flask financial-analysis service that uses scikit-learn and Gemini to estimate savings and generate AI-assisted financial and investment insights. Additional modules provide financial calculators, goal planning, market visualisation, a chatbot and MetaMask wallet integration.",

  problem:
    "Traditional financial platforms often separate lending, identity verification, personal financial planning and market information across different tools. FinGrow brings these workflows into one application: borrowers can request loans and complete KYC, lenders can create loan offers, and users can analyse their finances and explore market information from the same platform.",

  graph: "FINGROW",

  workflow: [
    {
      title: "Authentication",
      text:
        "Users register and log in through the React application. The backend uses JWT-based authentication, cookies and bcrypt password hashing to protect user accounts."
    },
    {
      title: "KYC Verification",
      text:
        "Borrowers can complete a multi-step KYC flow covering basic information, PAN, Aadhaar and bank details. The verified information is stored in MongoDB."
    },
    {
      title: "Create Loan Offer",
      text:
        "Lenders can create loan offers by specifying the amount and interest rate. The Express API validates the request and stores the offer in MongoDB."
    },
    {
      title: "Find Loan Offers",
      text:
        "Borrowers can request a loan amount and retrieve matching available loan offers through the backend API."
    },
    {
      title: "Loan & Transaction Layer",
      text:
        "The backend contains separate models and APIs for loans and transactions, providing the foundation for tracking lender-borrower financial activity and repayment information."
    },
    {
      title: "Financial Analysis",
      text:
        "The React dashboard sends income and spending information to a separate Flask service, which calculates savings, uses linear regression for savings estimation and uses Gemini to generate financial insights and investment suggestions."
    },
    {
      title: "Market & Wallet Tools",
      text:
        "Users can explore market charts through TradingView-based widgets and interact with a MetaMask wallet through ethers.js for blockchain transactions."
    }
  ],

  implementation: [
    {
      title: "Frontend",
      text:
        "React + Vite powers the user interface, with React Router for navigation, Context API for authentication state, Tailwind CSS and component libraries for the UI, and Recharts/TradingView widgets for financial visualisation."
    },
    {
      title: "Backend",
      text:
        "Node.js and Express provide REST APIs for authentication, users, KYC, loan offers, loans and transaction-related operations."
    },
    {
      title: "Database",
      text:
        "MongoDB with Mongoose stores application data including users, KYC information, loan offers, loans and transactions."
    },
    {
      title: "Authentication & Security",
      text:
        "JWT is used for authentication, bcrypt is used for password hashing, and protected routes restrict access to authenticated application areas."
    },
    {
      title: "Financial AI Service",
      text:
        "A separate Flask/Python service processes financial inputs, calculates savings, applies a scikit-learn Linear Regression model for savings estimation and uses Gemini for AI-generated financial and investment suggestions."
    },
    {
      title: "External Integrations",
      text:
        "The platform integrates TradingView for market visualisation, Chatbase for the financial chatbot and ethers.js with MetaMask for wallet-based blockchain transactions."
    }
  ],

  challenges: [
    {
      title: "Connecting multiple services",
      text:
        "The platform combines a React frontend, Express/MongoDB backend and separate Flask AI service, so API contracts and data flow have to remain consistent across different technologies."
    },
    {
      title: "Secure authentication and KYC",
      text:
        "Authentication and sensitive KYC information require validation, protected routes, password hashing and controlled access to user-specific data."
    },
    {
      title: "Designing a two-sided lending workflow",
      text:
        "The application has different requirements for borrowers and lenders, including creating offers, finding suitable offers and maintaining loan-related information."
    },
    {
      title: "Integrating AI into a financial workflow",
      text:
        "The financial-analysis service combines deterministic calculations, a machine-learning prediction and Gemini-generated insights, requiring the outputs of each stage to be passed correctly to the frontend."
    },
    {
      title: "Managing external integrations",
      text:
        "Market visualisation, chatbot functionality and wallet transactions rely on external services, making their integration and error handling separate concerns from the core backend."
    }
  ],

  evaluation:
    "The project was evaluated primarily as a functional multi-service fintech application: authentication and protected routes work through the Express backend, KYC information can be collected and stored, lenders can create loan offers, borrowers can retrieve available offers, and the financial dashboard can send user financial data to the Flask service for savings analysis and AI-generated insights. The market, chatbot and wallet modules provide additional financial tooling. The current implementation provides the core building blocks for a complete P2P lending lifecycle, while some loan and transaction operations remain backend capabilities rather than a fully automated end-to-end disbursement and repayment flow.",

  future: [
    "Complete the lender-to-borrower transaction lifecycle by connecting loan confirmation directly to the transaction APIs.",
    "Add a production-grade repayment system with repayment schedules, payment processing and transaction history.",
    "Introduce a dedicated credit-risk model using verified borrower features rather than presenting the current financial-analysis service as a credit-risk engine.",
    "Add investor dashboards with portfolio-level loan, repayment and risk analytics.",
    "Strengthen KYC verification through integration with production identity and banking verification providers.",
    "Add notifications for loan offers, approvals, repayments and other important account events.",
    "Improve the financial ML pipeline with more training data, model evaluation metrics and model monitoring."
  ],
},

  /* -------------------------------- CodePilot AI ------------------------------- */
  "codepilot-ai": {
    tagline: "Ask a codebase a question, get an answer grounded in its actual code.",
    overview:
      "CodePilot AI is a multi-agent AI coding assistant built with FastAPI and LangGraph. It first indexes a codebase, then answers questions about that project through a routed agent workflow — an intent router decides whether a question needs code retrieval, project-level context, or just a casual response, rather than sending every question straight to a RAG retriever.",
    problem:
      "Understanding an unfamiliar codebase means tracing how files and dependencies connect, and most chat-based coding assistants treat every question the same way — running full retrieval even for a greeting or a high-level question, which is slow and often returns irrelevant context. CodePilot AI routes each question to the right strategy instead, keeping answers fast and grounded in the actual code.",
    graph: "CODEPILOT",
    workflow: [
      { title: "Repository ingestion", text: "A repository agent pulls in the project; a parser agent walks the source files." },
      { title: "Dependency graph", text: "A dependency graph agent maps relationships between files." },
      { title: "Chunk + embed", text: "Code is chunked and embedded, then stored with metadata and dependency relationships in the vector store." },
      { title: "Guardrails", text: "An input guardrail agent and an LLM guardrail screen each incoming question." },
      { title: "Intent routing", text: "An intent router agent classifies the question as specific, broad, or casual." },
      { title: "Retrieval & context", text: "Specific questions hit the retriever, with a retrieval guard and expanded-retry; broad questions pull project-overview context instead." },
      { title: "Answer + validation", text: "An answer agent drafts a response, which an answer validation agent checks before it's cached and returned." },
    ],
    implementation: [
      { title: "Orchestration", text: "LangGraph runs the query graph — guardrails, router, retrieval and answer agents — as a stateful graph rather than a linear prompt chain." },
      { title: "Backend", text: "FastAPI exposes /ask, /ask/stream (SSE) and /ingest, calling execute_query() to run the LangGraph query graph." },
      { title: "Frontend", text: "React + Vite chat interface with project history, file browsing and code display." },
      { title: "Storage", text: "A vector store holds code chunks, embeddings, metadata and dependency relationships from the indexing pipeline." },
    ],
    challenges: [
      { title: "Avoiding unnecessary retrieval", text: "Casual and broad questions are routed away from the RAG path so simple questions don't pay the full retrieval cost." },
      { title: "Retrieval completeness", text: "A single retrieval pass isn't always enough — a retrieval guard checks sufficiency and triggers an expanded retry when it isn't." },
      { title: "Answer grounding", text: "An answer has to be validated against the retrieved context before it's cached, not just returned as soon as it's generated." },
    ],
    evaluation:
      "Evaluated on whether specific code questions are actually answered from the right retrieved context, and whether cached, validated answers stay accurate as the underlying codebase changes.",
    future: [
      "Multi-repo indexing for questions that span more than one project",
      "Streaming intermediate reasoning steps to the UI, not just the final answer",
      "A feedback signal from answer ratings back into cache invalidation",
    ],
  },

  /* -------------------------------- FitGenius -------------------------------- */
  fitgenius: {
    tagline: "Turning user data into a plan tailored to one person.",
    overview:
      "FitGenius AI is a personalised diet and workout recommendation system. It takes a user’s data — body metrics, goals and preferences — and produces a tailored plan through a standard ML feature → model → prediction pipeline.",
    problem:
      "Generic diet and workout plans ignore individual variation. FitGenius’s job is to turn structured user data into a recommendation that actually reflects that one person’s inputs.",
    viz: "pipeline",
    workflow: [
      { title: "User Data", text: "Body metrics, goals and preferences are collected." },
      { title: "Features", text: "Feature engineering on the raw user data." },
      { title: "Model", text: "A Scikit-learn model trained on the engineered features." },
      { title: "Prediction", text: "The model’s output for this specific user." },
      { title: "Plan", text: "Translated into a tailored diet and workout recommendation." },
    ],
    implementation: [
      { title: "Modeling", text: "Python and Scikit-learn for feature engineering, training and inference." },
      { title: "Serving", text: "Flask exposes the model as an API the frontend can call." },
      { title: "Frontend", text: "React for the user-facing data entry and recommendation views." },
    ],
    challenges: [
      { title: "Feature quality", text: "The recommendation is only as good as the features engineered from raw user input." },
      { title: "Personalisation vs. generalisation", text: "The model needs to generalise across users while still feeling tailored to each one." },
    ],
    evaluation:
      "Judged on whether the pipeline produces a coherent, personalised plan end to end from a given set of user inputs.",
    future: [
      "Feedback loop from plan adherence back into the model",
      "Broader input signals (e.g. activity history) for better personalisation",
    ],
  },

  /* ---------------------------------- SilentSOS --------------------------------- */
  /* ---------------------------------- SilentSOS --------------------------------- */
silentsos: {
  tagline:
    "A discreet mobile safety system that detects potential distress from voice and triggers an SOS workflow.",

  overview:
    "SilentSOS is a React Native and Expo-based personal safety application disguised as a calculator. Behind the calculator interface, the app can activate a hidden safety configuration, continuously capture short audio samples, send them to a Python/TensorFlow inference service and detect potential danger from vocal characteristics. When danger is detected, the system captures emergency audio, obtains the device's GPS location and sends an SOS alert with a Google Maps location link and audio attachment to trusted contacts. The backend also stores alert records and supports nearby NGO lookup and real-time Socket.IO updates.",

  problem:
    "In a threatening situation, opening a conventional safety app or manually sending an emergency message may not be practical or discreet. SilentSOS addresses this by hiding the safety controls behind a calculator interface and providing a background listening workflow that can detect potential distress from short audio samples and automatically trigger an emergency alert.",

  viz: "audio",

  workflow: [
    {
      title: "Discreet Calculator Interface",
      text:
        "The application opens as a normal calculator. A secret numeric sequence can reveal the hidden emergency configuration instead of exposing the safety functionality directly."
    },
    {
      title: "Secure Emergency Setup",
      text:
        "The hidden setup screen is protected by a PIN and allows trusted email contacts, a cancellation code and emergency settings to be configured and stored using Expo SecureStore."
    },
    {
      title: "Smart Listening",
      text:
        "When activated, the background listening service records a short audio clip approximately every five seconds and sends each clip to the ML prediction endpoint."
    },
    {
      title: "Audio Preprocessing",
      text:
        "The Python ML service converts incoming audio to 16 kHz mono WAV when necessary and processes it with librosa."
    },
    {
      title: "Feature Extraction",
      text:
        "The inference pipeline extracts 40 MFCC features along with pitch, zero-crossing rate and RMS energy to form a 43-dimensional audio feature vector."
    },
    {
      title: "AI Danger Detection",
      text:
        "The TensorFlow stress model processes the feature vector and returns a danger confidence. A confidence above the configured 0.6 threshold is treated as a potential danger event."
    },
    {
      title: "Emergency Alert",
      text:
        "When danger is detected, the app records an additional emergency audio clip, obtains the current GPS coordinates and sends the alert payload to the Node.js backend."
    },
    {
      title: "Alert Processing",
      text:
        "The Express backend receives the multipart audio request, converts the recording to WAV with FFmpeg, validates the trusted contacts and processes the emergency event."
    },
    {
      title: "Notify & Record",
      text:
        "The backend sends SOS emails containing the emergency message, Google Maps location and audio attachment, records the alert in MongoDB and emits a Socket.IO location update."
    },
    {
      title: "Emergency Support",
      text:
        "The backend can locate nearby NGOs using MongoDB geospatial queries, allowing the system to identify nearby support organisations around the reported coordinates."
    }
  ],

  implementation: [
    {
      title: "Mobile Application",
      text:
        "React Native with Expo and Expo Router provides the calculator interface, hidden setup screen, audio capture, location access, secure settings and smart-listening workflow."
    },
    {
      title: "Audio Capture",
      text:
        "expo-av records short audio clips from the device microphone. The background service manages repeated recording cycles and retries the ML request once when a network request fails."
    },
    {
      title: "ML Pipeline",
      text:
        "Python, TensorFlow and librosa power the audio classification service. The pipeline extracts MFCC, pitch, zero-crossing rate and energy features before passing the resulting 43-dimensional vector into the stress model."
    },
    {
      title: "Stress Model",
      text:
        "The training pipeline uses a Bidirectional LSTM architecture with dropout and dense layers. Class weighting and early stopping are used during training, and the trained model is exported as stress_model.h5."
    },
    {
      title: "Backend API",
      text:
        "Node.js and Express receive emergency alerts through a multipart API, process uploaded audio, communicate with the ML service, send notifications and persist alert information."
    },
    {
      title: "Location & Geospatial Search",
      text:
        "Expo Location obtains the device's coordinates, while MongoDB 2dsphere indexes support nearest-NGO searches based on the reported GPS position."
    },
    {
      title: "Notifications",
      text:
        "Nodemailer sends emergency emails through Gmail, including the emergency message, Google Maps location and recorded audio attachment."
    },
    {
      title: "Real-Time Communication",
      text:
        "Socket.IO provides a real-time channel for device-specific location updates during an alert."
    },
    {
      title: "Security & Reliability",
      text:
        "The backend uses Helmet, CORS and rate limiting, while the mobile application stores settings and the device identifier through Expo SecureStore."
    }
  ],

  challenges: [
    {
      title: "Discreet emergency interaction",
      text:
        "The safety system needs to remain hidden during normal use while still providing a reliable way to access configuration and activate monitoring."
    },
    {
      title: "Reliable audio processing",
      text:
        "Mobile recordings can arrive in different formats, so the backend and ML service convert audio to a consistent 16 kHz mono WAV representation before feature extraction."
    },
    {
      title: "Real-time monitoring over a network",
      text:
        "The mobile listener repeatedly uploads short audio clips, so network failures and partially written recordings have to be handled without stopping the monitoring loop."
    },
    {
      title: "Safe automated alerting",
      text:
        "A false positive can unnecessarily trigger an emergency notification, while a missed detection can prevent the alert workflow from starting. The system therefore uses a configurable confidence threshold and an explicit alert pipeline."
    },
    {
      title: "Coordinating multiple services",
      text:
        "The application spans a React Native client, Node.js backend, MongoDB database and Python/TensorFlow ML server, requiring consistent API payloads and error handling between services."
    },
    {
      title: "Emergency data handling",
      text:
        "Audio recordings and GPS coordinates are sensitive emergency information, so the backend processes the files, attaches them to notifications, stores alert metadata and removes temporary audio files after processing."
    }
  ],

  evaluation:
    "The system is evaluated as an end-to-end emergency detection pipeline rather than only as an ML model. The ML service reports a danger confidence and applies a 0.6 detection threshold, while the application verifies that the detected event can progress through audio capture, GPS acquisition, backend processing, email notification and alert persistence. The ML repository also includes evaluation code using classification reports and confusion matrices for the stress model. The current mobile repository keeps some on-device ML helper functions as stubs, while the active smart-listening flow uses the separate Flask/TensorFlow inference service.",

  future: [
    "Move validated audio inference closer to the device to reduce network latency and improve privacy.",
    "Replace placeholder client-side feature extraction and ML inference helpers with the trained TensorFlow.js models already included in the project.",
    "Add a stronger multimodal threat model combining vocal stress, keyword detection, motion and contextual signals.",
    "Improve the keyword-detection pipeline and integrate it directly into the final danger score.",
    "Add a more robust background execution strategy for continuous monitoring on Android and iOS.",
    "Replace development/local-network endpoints with secure production APIs and HTTPS.",
    "Add SMS and automated emergency-service escalation through production Twilio integration.",
    "Add a real cloud audio-storage workflow instead of the current placeholder S3 upload implementation.",
    "Build a dedicated alert dashboard for trusted contacts or emergency organisations to monitor active incidents in real time."
  ],
},

  /* ------------------------------- Full-stack builds ------------------------------ */
  // "instagram-clone": {
  //   tagline: "A full-stack clone built to practise core social-app patterns.",
  //   overview: "A full-stack Instagram clone covering the core patterns of a social app: authentication, a post feed, likes and a responsive UI.",
  //   viz: "app",
  // },
  // "swiggy-clone": {
  //   tagline: "A full-stack clone built around a food-ordering flow.",
  //   overview: "A full-stack Swiggy clone covering restaurant listings, cart management and an ordering flow end to end.",
  //   viz: "app",
  // },
  // "netflix-clone": {
  //   tagline: "A full-stack clone focused on a streaming-style browsing UI.",
  //   overview: "A full-stack Netflix clone focused on a content grid, browsing UI and responsive layout patterns.",
  //   viz: "app",
  // },
  portfolio: {
    tagline: "This site — the one you're looking at right now.",
    overview: "This portfolio itself: React and Tailwind CSS, with canvas-drawn 3D scenes (no Three.js dependency), a scroll-driven pipeline visualisation, and a demo AI assistant wired into the Contact and Home pages.",
    implementation: [
      { title: "Frontend", text: "React 18 + Vite, styled with Tailwind CSS." },
      { title: "3D scenes", text: "A small canvas-based 3D engine (rotate → project → painter's-algorithm sort) — no external 3D library." },
      { title: "Assistant", text: "A scripted demo assistant, structured so it can be swapped for a real RAG/agent backend." },
    ],
    viz: "app",
  },
};
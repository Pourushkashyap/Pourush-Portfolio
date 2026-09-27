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
  "self-healing-debugger": {
    tagline: "From a stack trace to a validated fix — without a human in the loop.",
    overview:
      "The Self-Healing Debugger is an autonomous debugging and recovery system. It watches for application errors, traces them to a root cause, generates a candidate fix, and proves the fix works in an isolated sandbox before it is ever promoted.",
    problem:
      "Most “AI debugging” stops at suggesting a fix. The harder — and more useful — problem is verifying that the fix actually resolves the issue without breaking anything else, and doing that safely, automatically and repeatedly.",
    graph: "DEBUGGER",
    workflow: [
      { title: "Error", text: "A runtime error or failing test is detected." },
      { title: "Analyze", text: "Traces the failure to a root cause using stack and AST analysis." },
      { title: "Generate Fix", text: "An agent proposes a patch targeted at that root cause." },
      { title: "Sandbox", text: "The patch is applied in an isolated environment — never directly on the working codebase." },
      { title: "Test", text: "Runs tests and regression checks against the patched sandbox." },
      { title: "Deploy or Retry", text: "Passing fixes are promoted; failing ones loop back to analysis with the new information." },
    ],
    implementation: [
      { title: "Root-cause analysis", text: "AST-level inspection locates the failure precisely instead of pattern-matching on the error string." },
      { title: "Sandboxed execution", text: "Docker isolates every candidate fix so a bad patch can never touch the real environment." },
      { title: "Orchestration", text: "LangGraph drives the analyze → fix → test → retry loop as an explicit state machine, so retries are bounded and traceable." },
    ],
    challenges: [
      { title: "Safety first", text: "A fix is only ever applied inside a sandbox — the loop is designed so an untested patch can never reach production." },
      { title: "Avoiding infinite retries", text: "Failed fixes need to feed useful information back into the next attempt, not just retry blindly." },
      { title: "Regression validation", text: "A fix that resolves the original error but breaks something else has to count as a failure, not a success." },
    ],
    evaluation:
      "A fix only counts as successful if it passes the full test suite in the sandbox — not just the one failing case it was written for.",
    future: [
      "Wider language / framework coverage for root-cause analysis",
      "Confidence scoring so low-confidence fixes are flagged for human review instead of auto-promoted",
      "Historical memory of past fixes to speed up similar future failures",
    ],
  },

  /* --------------------------------- FinGrow --------------------------------- */
  fingrow: {
    tagline: "A full-stack lending platform with an AI-assisted risk layer.",
    overview:
      "FinGrow is a full-stack, AI-enabled peer-to-peer lending platform. Borrowers request loans, an AI/ML-assisted risk engine assesses them, and investors fund and track the resulting loans — combining modern web engineering with an intelligent financial workflow.",
    problem:
      "Peer-to-peer lending needs a trustworthy way to translate a loan request into a risk signal investors can actually use, wrapped in an application that both sides can use for the full lifecycle of a loan.",
    graph: "FINGROW",
    workflow: [
      { title: "Borrower", text: "Requests a loan through the platform." },
      { title: "Risk Engine", text: "AI/ML-assisted assessment of borrower risk." },
      { title: "Loan", text: "A structured, trackable loan record is created." },
      { title: "Investor", text: "Funds the loan and follows repayment over time." },
    ],
    implementation: [
      { title: "Frontend", text: "React for borrower and investor-facing flows." },
      { title: "Backend", text: "Node.js APIs for accounts, loans and transactions." },
      { title: "Data", text: "MongoDB for the application data behind loans, users and risk assessments." },
    ],
    challenges: [
      { title: "Two-sided trust", text: "The platform has to be legible to both borrowers and investors, who care about different information." },
      { title: "Risk transparency", text: "The risk engine’s output needs to be something an investor can reason about, not a black-box score." },
    ],
    evaluation:
      "Evaluated as a working end-to-end flow: a borrower can request a loan, get a risk assessment, and an investor can fund and track it through the app.",
    future: [
      "Richer risk features and model iteration",
      "Repayment analytics and default-risk monitoring over time",
      "Notifications and reporting for investors",
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

  /* --------------------------- Crime Scene Detection -------------------------- */
  "crime-scene-detection": {
    tagline: "Object detection applied to crime-scene imagery.",
    overview:
      "A computer-vision system that analyses crime-scene imagery to identify relevant objects, built around a YOLOv8 detection pipeline with a Flask API and React front end.",
    problem:
      "Manually reviewing crime-scene imagery for relevant objects is slow and inconsistent. An object-detection pipeline can surface candidates faster, for a human to confirm.",
    viz: "vision",
    workflow: [
      { title: "Image input", text: "Crime-scene imagery is submitted to the system." },
      { title: "Detection", text: "A YOLOv8 model runs object detection over the image." },
      { title: "Annotation", text: "Detected objects are boxed and labelled with confidence scores." },
      { title: "Review", text: "Results are served to the frontend for human review." },
    ],
    implementation: [
      { title: "Detection model", text: "YOLOv8 for real-time object detection." },
      { title: "Serving", text: "Flask API wraps the model for inference requests." },
      { title: "Frontend", text: "React interface for uploading images and reviewing detections." },
    ],
    challenges: [
      { title: "Precision matters", text: "False positives and false negatives both carry real cost in this domain, so detection confidence has to be surfaced, not hidden." },
      { title: "Image variability", text: "Crime-scene photos vary widely in lighting, angle and quality." },
    ],
    evaluation:
      "Evaluated on standard detection metrics (precision/recall against labelled test imagery) rather than end-user judgement alone.",
    future: [
      "Expanded and rebalanced training data",
      "Confidence-based triage so low-confidence detections are flagged for closer review",
    ],
  },

  /* ---------------------------------- SilentSOS --------------------------------- */
  silentsos: {
    tagline: "A phone that can hear when something is wrong.",
    overview:
      "SilentSOS is a voice-based intelligent safety system. It analyses voice features on-device to detect signs of distress and can trigger help discreetly — built as a React Native app with a Python/ML backend.",
    problem:
      "In an unsafe situation, reaching for a phone and typing for help isn’t always possible. SilentSOS’s goal is to recognise distress from voice alone and act on it.",
    viz: "audio",
    workflow: [
      { title: "Audio capture", text: "The app listens for voice input." },
      { title: "Feature extraction", text: "MFCC (Mel-frequency cepstral coefficients) extract features from the audio signal." },
      { title: "Classification", text: "An ML model classifies the features for signs of distress." },
      { title: "Trigger", text: "A positive detection discreetly triggers the safety workflow." },
    ],
    implementation: [
      { title: "Mobile app", text: "React Native for a cross-platform mobile experience." },
      { title: "Signal processing", text: "MFCC feature extraction on captured audio." },
      { title: "Classification", text: "A Python ML model trained to recognise distress signals." },
    ],
    challenges: [
      { title: "False positives", text: "A safety trigger has to be reliable enough not to fire on ordinary speech or background noise." },
      { title: "Discretion", text: "The system needs to work without drawing attention in a situation where that matters." },
      { title: "On-device constraints", text: "Voice processing has to run within a mobile app’s resource limits." },
    ],
    evaluation:
      "Evaluated on classification accuracy over labelled voice samples, alongside real-world responsiveness of the trigger flow.",
    future: [
      "Expanded and more diverse training data for the distress classifier",
      "On-device model optimisation for faster, more private inference",
    ],
  },

  /* ------------------------------- Full-stack builds ------------------------------ */
  "instagram-clone": {
    tagline: "A full-stack clone built to practise core social-app patterns.",
    overview: "A full-stack Instagram clone covering the core patterns of a social app: authentication, a post feed, likes and a responsive UI.",
    viz: "app",
  },
  "swiggy-clone": {
    tagline: "A full-stack clone built around a food-ordering flow.",
    overview: "A full-stack Swiggy clone covering restaurant listings, cart management and an ordering flow end to end.",
    viz: "app",
  },
  "netflix-clone": {
    tagline: "A full-stack clone focused on a streaming-style browsing UI.",
    overview: "A full-stack Netflix clone focused on a content grid, browsing UI and responsive layout patterns.",
    viz: "app",
  },
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

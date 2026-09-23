const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const ArrowRightIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRightIcon = (p) => (
  <svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const DownloadIcon = (p) => (
  <svg {...base} {...p}><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
);
export const SunIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const MoonIcon = (p) => (
  <svg {...base} {...p}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" /></svg>
);
export const SparkIcon = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10Z" /></svg>
);
export const MenuIcon = (p) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const SendIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12 20 4l-4 16-4-6-7-2Z" /></svg>
);
export const GithubIcon = (p) => (
  <svg {...base} {...p}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
);
export const LinkedinIcon = (p) => (
  <svg {...base} {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>
);
export const CodeIcon = (p) => (
  <svg {...base} {...p}><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>
);

export const SOCIAL_ICONS = { github: GithubIcon, linkedin: LinkedinIcon, leetcode: CodeIcon };

export const MailIcon = (p) => (<svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
export const PhoneIcon = (p) => (<svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>);
export const PinIcon = (p) => (<svg {...base} {...p}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>);
export const AgentIcon = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="3" /><circle cx="5" cy="5" r="1.8" /><circle cx="19" cy="6" r="1.8" /><circle cx="18" cy="19" r="1.8" /><circle cx="6" cy="18" r="1.8" /><path d="m6.3 6.3 3.6 3.6M17.6 7.5l-3.5 3M16.7 17.6l-3.2-3.2M7.4 16.7l2.5-2.5" /></svg>);
export const LayersIcon = (p) => (<svg {...base} {...p}><path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5" /></svg>);
export const ChartIcon = (p) => (<svg {...base} {...p}><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" /></svg>);
export const StackIcon = (p) => (<svg {...base} {...p}><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></svg>);
export const CheckIcon = (p) => (<svg {...base} {...p}><path d="m5 12 5 5 9-10" /></svg>);
export const ChatIcon = (p) => (<svg {...base} {...p}><path d="M4 5h16v11H9l-5 4V5Z" /></svg>);

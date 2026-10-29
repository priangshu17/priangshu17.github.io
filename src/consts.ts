// Site-wide constants. Edit these to make the site yours.

export const SITE = {
  name: 'Priangshu Paul',
  // Short label used in the masthead eyebrow.
  tagline: 'ML Engineering / Experiment Log',
  url: 'https://priangshu17.github.io',
  description:
    'ML engineering under real constraints. I build experiments around fine-tuning, attention and inference, then document what the measurements show.',
};

// Contact / social links.
//   - `github` is your public profile (already correct).
//   - CONFIRM `email` and `linkedin` before publishing. Empty links are hidden.
//   - `resume` is an optional public file path (e.g. '/priangshu-paul-resume.pdf'),
//     left empty until you approve the exact file.
export const CONTACT = {
  github: 'https://github.com/priangshu17',
  email: 'priangshupaul77@gmail.com',
  phone: '+91 6009463281', // displayed as-is; linked as a tel: with spaces stripped
  linkedin: '', // add your reviewed LinkedIn URL when ready, e.g. https://www.linkedin.com/in/...
  resume: '',
};

// Current role — the "Now" section. Metrics are taken from your own CV;
// keep only what you're willing to stand behind publicly.
export const NOW = {
  role: 'Machine Learning Engineer',
  company: 'Nuroen.AI',
  companyUrl: '', // optional — add the company URL to link it
  period: 'July 2026 — present',
  location: 'Bangalore, India',
  lede:
    'Post-training and serving large language models — from a 32B fine-tune to a real-time voice stack.',
  items: [
    {
      label: 'LLM post-training',
      status: '',
      body: 'Fine-tuned Qwen3-32B end-to-end (full-parameter SFT) on 8×A100-80GB with FSDP ZeRO-3 and an 8-bit optimizer at 54% MFU, and built the evaluation harness that benchmarked it against the base model across 10+ tasks — instruction-following up 24 points (IFEval 0.34 → 0.58) and tool-calling up 4 points.',
    },
    {
      label: 'Data & retrieval',
      status: '',
      body: 'Engineered a 2M+ sample, 8-domain training corpus with two-pass (n-gram + embedding) decontamination and a 1.13M-chunk RAG knowledge base on an HNSW vector index — grounding outputs at 0.94 faithfulness and raising refusal accuracy 16 points (0.57 → 0.73).',
    },
    {
      label: 'Real-time voice AI',
      status: 'In progress',
      body: 'Building a real-time, multilingual voice agent (streaming speech-to-text → LLM → text-to-speech; 10 languages, full-duplex with barge-in) that serves the fine-tuned model as its LLM. Load-tested on a single H100 to 32–64 concurrent sessions at 4 s p95 (LLM 67–147 ms), with a horizontally-scaled session/STT tier designed to reach 1000+ concurrent.',
    },
  ],
};

// Primary navigation. `Notes` is intentionally omitted until that page has content.
export const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
];

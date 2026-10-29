---
order: 4
title: Does speculative decoding pay off on a 6 GB GPU?
shortTitle: Speculative decoding, measured
question: With a KV-cache-optimised speculative decoder, does drafting with a small model actually speed up a larger one on consumer hardware?
summary: A faithful, KV-cache-optimised speculative decoder for encoder–decoder transformers, benchmarked for speedup, acceptance rate and output fidelity against draft length γ.
cardResult: On this consumer-GPU setup speculative decoding was slower than baseline (speedup 0.59 → 0.32 as γ grows); acceptance fell and divergence rose — overhead dominated.
status: Implementation + benchmark
role: Sole author — baseline, speculative decoder, KV-cache optimisation and benchmark harness.
lastReviewed: '2026-10-29'
repoName: Speculative-Decoding-A-KV-Cache-Optimized-Implementation-using-PyTorch-Hugging-Face
repoUrl: https://github.com/priangshu17/Speculative-Decoding-A-KV-Cache-Optimized-Implementation-using-PyTorch-Hugging-Face
commit: d9b8d49
tags: ['Inference', 'Speculative decoding', 'KV-cache', 'Benchmark']

setup:
  - { label: 'GPU / VRAM', value: 'RTX 4050, 6 GB' }
  - { label: 'Architecture', value: 'encoder–decoder (T5 / BART-style)' }
  - { label: 'Models', value: 'large target Mp · small proposal Mq' }
  - { label: 'Decoding', value: 'single-token steps with past_key_values' }
  - { label: 'Variable', value: 'draft length γ ∈ {1, 2, 4}' }
  - { label: 'Acceptance', value: 'u ≤ p(x)/q(x), else sample max(0, p−q)' }
  - { label: 'Metrics', value: 'speedup · acceptance α · JS divergence' }

method:
  - A baseline autoregressive decoder (Mp) and a KV-cache-optimised speculative decoder — a small proposal model Mq drafts γ tokens and Mp validates them in one pass with the paper's acceptance rule (accept if u ≤ p(x)/q(x), otherwise sample from the normalised residual max(0, p−q)). Both models take single-token forward passes reusing past_key_values, keeping memory constant per step so it runs on a 6 GB GPU.
  - The experiment sweeps the draft length γ ∈ {1, 2, 4}, logging wall-clock speedup over the baseline, the empirical acceptance rate α, and the JS divergence between speculative and Mp-only outputs.

resultsLead: In this controlled consumer-GPU setup the speculative decoder did not beat the baseline — measured speedup stayed below 1× and fell as γ grew (0.59 → 0.50 → 0.32), while acceptance dropped and output divergence rose.

figures:
  - figNo: 'Fig. 1'
    src: '/figures/specdec/speedup.png'
    alt: 'Line plot of speedup against gamma; speedup decreases from about 0.59 at gamma 1 to about 0.32 at gamma 4, staying below 1 throughout.'
    caption: 'Speedup vs γ. Speedup stays below 1× (0.59 at γ=1 down to 0.32 at γ=4) — speculative decoding was slower than plain autoregressive decoding here, and more so at longer draft lengths.'
  - figNo: 'Fig. 2'
    src: '/figures/specdec/alpha.png'
    alt: 'Line plot of empirical acceptance rate against gamma, falling from about 0.45 at gamma 1 to about 0.13 at gamma 4.'
    caption: 'Empirical acceptance rate α vs γ. Acceptance falls from ~0.45 to ~0.13 as γ grows — the small proposal model''s longer drafts are accepted less often.'
  - figNo: 'Fig. 3'
    src: '/figures/specdec/js.png'
    alt: 'Line plot of average JS divergence against gamma, rising from about 0.56 at gamma 1 to about 0.62 at gamma 4.'
    caption: 'Average JS divergence vs γ. Divergence from the Mp-only distribution rises with γ (≈0.56 → 0.62).'

findings:
  - 'Measured speedup was below 1× at every γ and decreased with draft length (0.59 → 0.32) — drafting and verification overhead outweighed the saved target passes.'
  - "Acceptance rate α fell from ~0.45 (γ=1) to ~0.13 (γ=4): longer drafts from the small proposal model are accepted less often."
  - 'JS divergence from Mp-only outputs grew with γ (~0.56 → ~0.62).'

interpretation:
  - "Speculative decoding only pays off when the target model dominates cost and the draft's acceptance is high — the regime where you skip many expensive Mp passes. On this small-model, 6 GB setup neither held: acceptance was low and Mp wasn't expensive enough relative to the per-step overhead, so more drafting (higher γ) made it worse, not better."
  - This is the method's mechanism stated honestly — the speedup is conditional, and measuring it on modest hardware shows the conditions failing rather than a generic win.

limitations:
  - A single consumer GPU and small encoder–decoder models — the published speedups come from settings where the target model is far larger than the draft (e.g. T5-XXL), which this setup does not reproduce.
  - γ was swept over {1, 2, 4} only, with no tuning of the Mp/Mq size ratio — the factor that largely decides whether speculative decoding helps.
  - Fidelity is summarised by JS divergence; acceptance and speedup are per-run on one hardware configuration.

surprised:
  label: What surprised me
  body: That more drafting made it slower. I expected a modest win; instead higher γ lowered acceptance and raised overhead — which is exactly why the size ratio between target and draft, not the decoder itself, is the thing that matters.

reproduce:
  commands:
    - 'python -m venv .venv'
    - 'source .venv/bin/activate   # Windows: .venv\Scripts\activate'
    - 'pip install -e .'
    - 'python experiments/run_experiment.py'
  data: 'Encoder–decoder models (T5 / BART-style) and prompts are configured in experiments/run_experiment.py.'
  rawResults: 'Plots (speedup.png, alpha.png, js.png) and a results CSV are written to results_kvcache/.'

papers:
  - title: 'Fast Inference from Transformers via Speculative Decoding'
    authors: 'Leviathan, Kalman & Matias — 2023'
    url: 'https://arxiv.org/abs/2211.17192'
---

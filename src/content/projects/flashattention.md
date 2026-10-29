---
order: 2
title: Where does FlashAttention actually win?
shortTitle: Attention, measured
question: At what sequence lengths, and for what reason, does FlashAttention outperform standard attention implementations?
summary: A controlled benchmark of Naive, SDPA and FlashAttention across runtime, memory and throughput as sequence length grows.
cardResult: Naive memory grows quadratically; FlashAttention scales near-linearly — ~65 MB vs ~2.2 GB at length 4,096.
status: Benchmark
role: Sole author — implementations, harness and analysis.
lastReviewed: '2026-10-29'
repoName: flashattention-benchmark
repoUrl: https://github.com/priangshu17/flashattention-benchmark
commit: 217bbc4
tags: ['Attention', 'Kernels', 'Scaling', 'Benchmark']

setup:
  - { label: 'Model', value: 'single Transformer block (attention-only)' }
  - { label: 'Backends', value: 'Naive · PyTorch SDPA · FlashAttention v2' }
  - { label: 'Variable', value: 'sequence length (sweep to ~4,096)' }
  - { label: 'Fixed', value: 'batch size · embed dim · head count' }
  - { label: 'Precision', value: 'Naive / SDPA FP32 · FlashAttention FP16' }
  - { label: 'Device', value: 'single NVIDIA GPU' }
  - { label: 'Inputs', value: 'random post-embedding hidden states' }
  - { label: 'Metrics', value: 'CUDA-synced runtime · peak memory · throughput' }

method:
  - A minimal, attention-dominated Transformer block (QKV projections, residual, LayerNorm; no MLP or dropout) with a swappable backend isolates the attention kernel. Inputs are random hidden-state tensors because kernel performance depends on shape, dtype and memory access patterns, not token semantics.
  - Sequence length is swept with batch size, embedding dimension and head count held fixed. Each run uses a fresh model instance to avoid CUDA memory contamination, with warm-up runs and CUDA synchronisation for accurate timing.
  - Backends are compared on peak allocated memory, runtime and token throughput.

resultsLead: Naive attention's memory grows quadratically with sequence length and becomes impractical within a few thousand tokens; FlashAttention scales near-linearly, which is what makes long contexts runnable at all.

figures:
  - figNo: 'Fig. 1'
    src: '/figures/flashattention/memory_vs_seq_len.png'
    alt: 'Peak allocated memory in MB against sequence length for naive, sdpa and flash backends. Naive rises steeply and quadratically to about 2,200 MB at length 4,096, while sdpa and flash stay low and nearly flat.'
    caption: 'Peak allocated memory vs sequence length. Naive attention reaches ~2,200 MB at length 4,096; SDPA stays near 135 MB and FlashAttention near 65 MB — the quadratic-vs-linear gap in one plot.'
  - figNo: 'Fig. 2'
    src: '/figures/flashattention/runtime_vs_seq_len.png'
    alt: 'Runtime against sequence length for the three attention backends, with naive attention growing fastest and FlashAttention scaling best at larger lengths.'
    caption: 'Runtime vs sequence length. The runtime advantage follows from the memory behaviour — FlashAttention pulls ahead at medium-to-large lengths.'
  - figNo: 'Fig. 3'
    src: '/figures/flashattention/throughput_vs_seq_len.png'
    alt: 'Token throughput against sequence length for the three backends, with FlashAttention sustaining higher throughput as length grows.'
    caption: 'Token throughput vs sequence length. FlashAttention sustains throughput as context grows, where naive attention collapses.'

findings:
  - Naive attention shows quadratic memory growth (O(T²)) and becomes impractical at moderate sequence lengths.
  - SDPA is substantially better than naive attention but still exhibits increasing memory pressure as length grows.
  - FlashAttention scales near-linearly in memory with superior runtime and throughput at medium-to-large lengths, at a slight overhead for very short sequences from kernel setup costs.

interpretation:
  - FlashAttention's primary advantage is memory scaling, not a constant-factor speedup. By never materialising the full T×T attention matrix it changes the asymptotics, and the runtime and throughput gains follow from that.
  - At short sequence lengths the tiled kernel's setup cost can make it marginally slower. The win is specifically a long-context one.

limitations:
  - The baselines run in FP32 while FlashAttention runs in FP16, so this is an implementation-realistic comparison rather than a same-dtype control. The precision difference is reported, not corrected for.
  - Raw CSV outputs are hardware-dependent and intentionally not version-controlled; the committed plots are the reference.
  - A single GPU and an attention-only block — no full model, MLP or training loop.

surprised:
  label: What I'd test next
  body: A same-dtype sweep (FP16 across all three backends) to separate the memory-layout win from the precision win, plus a causal-mask variant — the current sweep is non-causal.

reproduce:
  commands:
    - 'python -m venv .venv'
    - 'source .venv/bin/activate   # Windows: .venv\Scripts\activate'
    - 'pip install -r requirements.txt'
    - 'python scripts/run_seq_len_sweep.py'
  data: 'No external dataset — inputs are randomly generated hidden-state tensors.'
  rawResults: 'Raw CSVs are not version-controlled (hardware-dependent); committed plots in results/ and analysis in notebooks/analysis.ipynb are the reference.'

papers:
  - title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness'
    authors: 'Dao, Fu, Ermon, Rudra & Ré — 2022'
    url: 'https://arxiv.org/abs/2205.14135'
  - title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning'
    authors: 'Dao — 2023'
    url: 'https://arxiv.org/abs/2307.08691'
---

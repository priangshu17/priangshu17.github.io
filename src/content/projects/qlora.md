---
order: 1
title: Fine-tuning a 7B model under a 6 GB memory budget.
shortTitle: Fine-tuning under a memory budget
question: What can you actually fine-tune on a small consumer GPU, and what does the memory budget cost you?
summary: A controlled efficiency study of FP16 LoRA versus NF4 QLoRA across wall-clock time, memory and perplexity.
cardResult: NF4 QLoRA trains in 2–3 h within 5–10 GB; FP16 LoRA needs ~31 h and 15–16 GB it does not have.
status: Experiment
role: Sole author — experimental pipeline, runs and analysis.
lastReviewed: '2026-10-29'
repoName: Efficient-QLoRA-Fine-Tuning-on-Consumer-Hardware
repoUrl: https://github.com/priangshu17/Efficient-QLoRA-Fine-Tuning-on-Consumer-Hardware
commit: e87a65f
tags: ['Fine-tuning', 'Quantization', 'LoRA', 'Efficiency']

setup:
  - { label: 'GPU / VRAM', value: 'RTX 4050, 6 GB' }
  - { label: 'OS', value: 'Windows (consumer)' }
  - { label: 'Model', value: 'Mistral-7B' }
  - { label: 'Dataset', value: 'GSM8K (fixed splits)' }
  - { label: 'Compared', value: 'FP16 LoRA vs NF4 QLoRA' }
  - { label: 'LoRA ranks', value: 'r = 8, 16, 32' }
  - { label: 'Metrics', value: 'wall-clock time · peak memory · val. perplexity' }
  - { label: 'Configs', value: 'configs/qlora/*.yaml' }

method:
  - A single consumer GPU (RTX 4050, 6 GB VRAM), with identical data splits, tokenization and training schedule across every run so that time, memory and perplexity are directly comparable.
  - Configurations compared are FP16 LoRA against NF4 QLoRA at LoRA ranks r = 8, 16 and 32, each driven by a YAML config under configs/qlora/.
  - Efficiency is measured by wall-clock training time and peak allocated memory; quality by validation perplexity on the held-out split.

resultsLead: On a 6 GB GPU, NF4 QLoRA trains a 7B-scale model in 2–3 hours within 5–10 GB of memory, at perplexity comparable to an FP16 LoRA run that needs roughly 31 hours and 15–16 GB it does not physically have.

figures:
  - figNo: 'Fig. 1'
    src: '/figures/qlora/perplexity_vs_time.png'
    alt: 'Scatter plot of validation perplexity against training time in hours. fp16_lora sits near 1.485 perplexity at about 31 hours; nf4_r8, nf4_r16 and nf4_r32 cluster between 2 and 3 hours with perplexity from about 1.483 down to 1.464.'
    caption: 'Validation perplexity vs training time. The FP16 LoRA run sits near 1.485 perplexity after ~31 h; all NF4 runs finish in 2–3 h, with nf4_r32 reaching the lowest perplexity (~1.464). Lower is better on both axes.'
  - figNo: 'Fig. 2'
    src: '/figures/qlora/memory_vs_time.png'
    alt: 'Plot of peak allocated memory against training time, separating the FP16 configuration at high memory and time from the NF4 configurations at low memory and time.'
    caption: 'Peak allocated memory vs training time. FP16 LoRA needs ~15–16 GB — beyond the 6 GB GPU — forcing host–device paging and a ~31 h run, while NF4 configurations stay within ~5–10 GB and complete in 2–3 h.'
  - figNo: 'Fig. 3'
    src: '/figures/qlora/nf4_rank_vs_perplexity.png'
    alt: 'Validation perplexity against LoRA rank for the NF4 configurations, improving from r=8 to r=16 then flattening toward r=32.'
    caption: 'Validation perplexity vs LoRA rank (NF4 only). Perplexity improves markedly from r=8 to r=16, then only marginally to r=32 — a clear knee at r=16.'

findings:
  - FP16 fine-tuning of a 7B-scale model is infeasible on a 6 GB GPU — memory oversubscription forces host–device paging and a pathological ~31-hour run.
  - NF4 QLoRA stays within 5–10 GB and finishes in 2–3 hours — an order-of-magnitude reduction in wall-clock time at comparable perplexity.
  - LoRA rank shows diminishing returns; r=16 is the most cost-effective point, balancing representational capacity against training time.

interpretation:
  - On constrained hardware the decisive variable is not a few points of perplexity but whether the run fits in memory at all. FP16 technically completes, but only by paging to host memory, which turns a few-hour job into a day-long one.
  - Within NF4, capacity helps up to a point. Moving r=8 → r=16 buys a real perplexity gain; r=16 → r=32 costs similar time for marginal return. r=16 is where capacity and cost meet.

limitations:
  - Energy and carbon were not directly measured — consumer Windows GPU telemetry was unreliable — so wall-clock time and peak memory stand in as efficiency proxies.
  - Results are specific to one 6 GB GPU; the FP16 feasibility cliff moves with available VRAM.
  - A single training schedule and dataset (GSM8K); run-to-run variation was not formally characterised.

surprised:
  label: What surprised me
  body: That the FP16 run finished at all. The result that stayed with me wasn't the perplexity gap — it was watching a "standard" precision setting degrade into ~31 hours of paging on hardware where NF4 simply worked.

reproduce:
  commands:
    - 'python -m venv .venv'
    - '.venv\Scripts\activate   # Windows  (use: source .venv/bin/activate on Linux/macOS)'
    - 'pip install -r requirements.txt'
    - 'python -m experiments.run_experiment'
    - 'python scripts/plot_results.py'
  data: 'GSM8K preprocessed splits are committed under data/processed/.'
  rawResults: 'Aggregated metrics live in results/processed/summary.csv with discussion in results/results.md. Per-run metrics.json files are not all version-controlled.'
---

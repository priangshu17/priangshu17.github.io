---
order: 3
title: How close does LoRA get to full fine-tuning?
shortTitle: LoRA vs full fine-tuning
question: On the same model and training budget, how closely does parameter-efficient LoRA match full fine-tuning — and where does it fall short?
summary: A controlled perplexity comparison of full fine-tuning against LoRA (r=8, r=32) on GPT-2 Small.
cardResult: Full fine-tuning reaches 13.97 perplexity (~125M trainable); LoRA closes the gap as rank grows (r=8 ~25.7 → r=32 ~21.9) but doesn't match it.
status: Experiment
role: Sole author — training, evaluation and analysis.
lastReviewed: '2026-10-29'
repoName: LoRA-vs-Full-Fine-Tuning--A-Controlled-Perplexity-Study-on-GPT-2
repoUrl: https://github.com/priangshu17/LoRA-vs-Full-Fine-Tuning--A-Controlled-Perplexity-Study-on-GPT-2
commit: f3c1ab6
tags: ['Fine-tuning', 'LoRA', 'PEFT', 'Perplexity']

setup:
  - { label: 'GPU / VRAM', value: 'Consumer, 6 GB' }
  - { label: 'Model', value: 'GPT-2 Small (124M)' }
  - { label: 'Objective', value: 'Causal language modeling' }
  - { label: 'Dataset', value: 'OpenAssistant (OASST1), assistant responses' }
  - { label: 'Full FT', value: 'all params · AdamW · FP16' }
  - { label: 'LoRA targets', value: 'c_attn, c_proj' }
  - { label: 'LoRA ranks', value: 'r = 8, 32 (<5% params)' }
  - { label: 'Metric', value: 'perplexity (held-out)' }

method:
  - GPT-2 Small under a causal-LM objective, fine-tuned two ways on the same OASST1 assistant data and training budget — full fine-tuning (all ~125M parameters, AdamW, FP16) and LoRA adapters on the attention projections (c_attn, c_proj) at ranks r=8 and r=32, which train under 5% of the parameters.
  - GPT-2 Medium full fine-tuning exceeded the 6 GB GPU, so GPT-2 Small was used to keep the comparison reproducible and fair.
  - Both are evaluated by perplexity on a held-out split, with learning-rate scaling tuned per method.

resultsLead: Full fine-tuning reaches 13.97 perplexity; LoRA narrows the gap as rank increases — r=8 at ~25.7, r=32 at ~21.9 — but does not fully match full fine-tuning under an identical budget.

figures: []

findings:
  - 'Full fine-tuning (~125M trainable params) — 13.97 perplexity, the reference point.'
  - 'LoRA r=8 (~1M trainable, <1%) — ~25.7 perplexity; low rank underfits the instruction-following data.'
  - 'LoRA r=32 (~3.2M trainable) — ~21.9 perplexity; a substantial gain over r=8, but still short of full fine-tuning.'
  - 'Learning-rate scaling is critical for LoRA to optimise well.'

interpretation:
  - "LoRA's gap here is a capacity story — at r=8 the low-rank update can't express enough of the adaptation, and most of the improvement comes from simply giving it more rank. What LoRA buys is memory and optimiser-state savings, not a free match in quality."
  - On this small model and budget LoRA trails full fine-tuning, but does so while training under 5% of the parameters. The practitioner's question is whether that quality gap is worth the memory it saves.

limitations:
  - GPT-2 Small (124M) was used because GPT-2 Medium full fine-tuning didn't fit in 6 GB — the gap can look different at larger scale, where LoRA is usually most favourable.
  - A single dataset (OASST1 assistant responses) and training budget; perplexity is the only quality metric — no downstream-task evaluation.
  - Only two LoRA ranks and one target-module set were swept.

surprised:
  label: What surprised me
  body: How much of LoRA's quality was just rank. The r=8 → r=32 jump mattered far more than I expected, which reframed the exercise from "LoRA vs full fine-tuning" into "how much rank do you actually need".

reproduce:
  commands:
    - 'python -m venv venv'
    - 'source venv/bin/activate   # Windows: venv\Scripts\activate'
    - 'pip install -r requirements.txt'
    - 'python data/prepare_oasst.py'
    - 'python training/train_full_ft.py'
    - 'python training/train_lora.py'
    - 'python evaluation/perplexity.py'
  data: 'OpenAssistant (OASST1), assistant responses only, prepared by data/prepare_oasst.py.'
  rawResults: 'Checkpoints and processed datasets are intentionally excluded for size and reproducibility; perplexity is computed by evaluation/perplexity.py.'

papers:
  - title: 'LoRA: Low-Rank Adaptation of Large Language Models'
    authors: 'Hu et al. — 2021'
    url: 'https://arxiv.org/abs/2106.09685'
---

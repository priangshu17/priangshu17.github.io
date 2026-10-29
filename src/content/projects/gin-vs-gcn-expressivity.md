---
order: 5
title: Can you see a GNN's expressive power in its embeddings?
shortTitle: Graph expressivity — GIN vs GCN
question: Do the theoretical expressivity differences between GIN and GCN show up in the graph embeddings they learn on MUTAG?
summary: A controlled comparison of GIN (sum aggregation) and GCN (mean aggregation) on MUTAG graph classification, with PCA of the learned graph-level embeddings.
cardResult: GIN's sum aggregation yields more structured, better-separated graph embeddings than GCN's mean aggregation — the WL-expressivity gap made visible.
status: Experiment
role: Sole author — models, training and embedding analysis.
lastReviewed: '2026-10-29'
repoName: Understanding-Graph-Expressivity-GIN-vs-GCN-on-the-MUTAG-Dataset
repoUrl: https://github.com/priangshu17/Understanding-Graph-Expressivity-GIN-vs-GCN-on-the-MUTAG-Dataset
commit: 85a70b6
tags: ['Graph neural networks', 'Expressivity', 'Representation', 'MUTAG']

setup:
  - { label: 'Dataset', value: 'MUTAG (molecular graph classification)' }
  - { label: 'Task', value: 'mutagenic vs non-mutagenic' }
  - { label: 'GCN', value: 'mean aggregation · 2 conv layers' }
  - { label: 'GIN', value: 'sum aggregation + MLPs (injective)' }
  - { label: 'Pooling', value: 'global sum pooling (both)' }
  - { label: 'Framework', value: 'PyTorch Geometric' }
  - { label: 'Analysis', value: 'pre-classifier embeddings → PCA to 2D' }

method:
  - Two GNNs trained under identical conditions on MUTAG — a GCN using mean-normalised neighbourhood aggregation and a GIN using sum aggregation with MLPs (provably injective, matching the 1-WL test). Both use global sum pooling for the graph-level representation.
  - Beyond accuracy, graph-level embeddings are extracted before the classifier and reduced to 2D with PCA to inspect how well each model separates the two classes.

resultsLead: The expressivity difference is visible in the embeddings — GIN's sum aggregation produces a more structured, better-separated 2D layout of the two classes than GCN's mean aggregation, consistent with the theory that sum is injective over neighbourhoods where mean is not.

figures:
  - figNo: 'Fig. 1'
    src: '/figures/gin-gcn/gin_embedding.png'
    alt: 'PCA scatter of GIN graph embeddings on MUTAG coloured by class; points show visible structure with partial separation of the two classes.'
    caption: 'GIN graph embeddings (MUTAG), PCA to 2D. The two classes form more distinct structure, with the mutagenic class spread along a recognisable band.'
  - figNo: 'Fig. 2'
    src: '/figures/gin-gcn/gcn_embedding.png'
    alt: 'PCA scatter of GCN graph embeddings on MUTAG coloured by class; the two classes overlap substantially near a common region.'
    caption: 'GCN graph embeddings (MUTAG), PCA to 2D. Classes overlap more and collapse toward a common region — weaker separation than GIN.'

findings:
  - "GIN's embeddings show more structure and clearer partial separation of the two MUTAG classes."
  - "GCN's embeddings collapse toward a common region with more class overlap — the signature of mean aggregation losing multiset information."
  - "The qualitative gap matches Xu et al.: sum aggregation (GIN) is injective over neighbourhoods and as expressive as the 1-WL test, while mean (GCN) is not."

interpretation:
  - "Expressive power isn't only an accuracy number — it shows up in the geometry of the representation. GIN keeps structural distinctions that GCN's mean aggregation averages away, and PCA of the pre-classifier embeddings makes that difference legible on a small, interpretable dataset."
  - MUTAG is small, so separation is partial for both models; the point is the relative structure, not a clean decision boundary.

limitations:
  - MUTAG is a small benchmark (~188 graphs); embedding separation is partial, and PCA is a linear 2D projection that understates higher-dimensional structure.
  - The comparison is qualitative on embeddings; training/test accuracy is computed but not framed as a leaderboard result.
  - Two architectures under one hyperparameter setting — not a broad sweep.

surprised:
  label: What I'd test next
  body: A WL-test alignment check — colouring the embeddings by 1-WL refinement classes to test directly whether GIN's separation tracks WL distinctions, rather than inferring it from class colours alone.

reproduce:
  commands:
    - 'python -m venv .venv'
    - 'source .venv/bin/activate   # Windows: .venv\Scripts\activate'
    - 'pip install torch torch-geometric matplotlib scikit-learn'
    - '# run the project notebook to train GIN and GCN and export the PCA embedding plots'
  data: "MUTAG via PyTorch Geometric's TUDataset (downloaded automatically)."
  rawResults: 'Embedding plots (GIN_Graph_Embedding.png, GCN_Graph_Embedding.png) are committed; the analysis runs in the notebook.'

papers:
  - title: 'How Powerful are Graph Neural Networks?'
    authors: 'Xu, Hu, Leskovec & Jegelka — ICLR 2019'
    url: 'https://arxiv.org/abs/1810.00826'
---

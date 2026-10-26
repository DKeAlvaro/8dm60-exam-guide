# 3 · Omics models

## Subtitles

1. scRNA-seq counts and technical variation
2. scVI’s probabilistic representation
3. scGPT and gene-context embeddings
4. Zero-shot foundation-model benchmarks
5. CPA and compositional generalization
6. GEARS and biological graphs
7. Perturbation metrics and simple baselines

## Milestones

- [ ] Map five scRNA-seq challenges to scVI components.
- [ ] Separate gene identity, expression, and cellular context.
- [ ] Name exactly what is held out in a generalization claim.
- [ ] Compare CPA and GEARS on unseen interventions.
- [ ] Evaluate treatment effects against a No-Change baseline.

## Possible exam questions

### OPEN · Q1 — How does scVI address sparsity/excess zeros, library size, batch effects, biological noise, and scalability? {#l3q1 data-source="lecture-03-bz-questions.md — Problem 1"}

<div class="response" markdown></div>

### OPEN · Q2 — Why is treating a cell as an ordered sentence of gene identities inappropriate? Give two biologically meaningful input changes. {#l3q2 data-source="lecture-03-bz-questions.md — Problem 2"}

<div class="response" markdown></div>

### OPEN · Q3 — If TP53 has the same expression in two cell contexts, do its initial and post-Transformer embeddings differ? What does self-attention add? {#l3q3 data-source="lecture-03-bz-questions.md — Problem 3"}

<div class="response" markdown></div>

### OPEN · Q4 — How do frozen scGPT zero-shot embeddings compare with dataset-fitted scVI for batch integration and biological conservation? What changes under batch–biology confounding? {#l3q4 data-source="lecture-03-bz-questions.md — Problem 4"}

<div class="response" markdown></div>

### OPEN · Q5 — Can standard CPA predict a completely unseen drug? What happens to basal state and counterfactual combinations if adversarial weight is zero? {#l3q5 data-source="lecture-03-bz-questions.md — Problem 5"}

<div class="response" markdown></div>

### OPEN · Q6 — Why does GEARS need both gene co-expression and perturbation graphs to predict an unseen gene knockout? {#l3q6 data-source="lecture-03-bz-questions.md — Problem 6"}

<div class="response" markdown></div>

### OPEN · Q7 — Only 50 of 10,000 genes change; model MSE is 0.05 and No-Change is 0.06. Why is global MSE misleading, and what should replace it? {#l3q7 data-source="lecture-03-bz-questions.md — Problem 7"}

<div class="response" markdown></div>

# 3 · Omics models

<div class="meta"><span class="hot">Lecture 3</span><span>~20 min</span><span>Single cells</span></div>

<p class="lead">Single-cell RNA sequencing counts, for each cell, how many mRNA molecules of each gene it contains. The table is huge, sparse and noisy, so the job is to turn it into a useful vector and to predict what a drug or a gene knockout will do.</p>

## In plain words

- **The data.** Rows are cells, columns are ~20,000 genes, values are counts. Most values are zero.
- **Why it is noisy.** Some zeros are real (the gene is off), some are technical (the molecule was missed). Cells are also sequenced to different depths, and batches differ by machine, day or lab.
- **scVI.** A probabilistic model (VAE) that compresses a cell into a low-dimensional vector while explicitly modelling zeros, library size and batch.
- **scGPT.** A Transformer over genes, learning from millions of cells. It gives general-purpose cell embeddings, but does not necessarily beat a model fitted to your dataset.
- **Perturbations (CPA, GEARS).** Predict how gene expression changes after a drug or a knockout, including combinations never observed.

## Core ideas in one table

| Term | Plain meaning |
| --- | --- |
| scRNA-seq | Counts of mRNA per gene per cell. |
| Sparsity / excess zeros | Most counts are zero, partly technical. |
| Library size | Total counts per cell; varies with sequencing depth. |
| Batch effect | Technical differences between experimental batches. |
| ZINB | Zero-inflated negative binomial: a gate for extra zeros plus a count distribution. |
| VAE / latent $z$ | Compress each cell to a few numbers, then reconstruct its counts. |
| Zero-shot | Use a pretrained model on new data without fitting it. |
| Perturbation | A drug, a knockout, or a combination applied to cells. |
| No-Change baseline | Predict that expression stays the same; a suspiciously strong baseline. |
| Masked gene prediction | Hide a gene's value and predict it from the others — scGPT's training task. |

## Exam questions

### Q1 — How does scVI handle the five challenges?

**Answer.** (1) **Sparsity/excess zeros:** a zero-inflated negative binomial likelihood — a dropout gate for extra zeros plus a negative binomial for counts. (2) **Varying library size:** the observed total count enters the mean as an explicit scaling factor. (3) **Batch effects:** batch is a covariate fed to the encoder and decoder, so the latent $z$ is pushed to capture biology. (4) **Biological noise:** a probabilistic latent variable sampled from a prior, with dispersion, instead of a single point estimate. (5) **Scalability:** amortised inference with an encoder network and mini-batch gradient descent, rather than optimising parameters per cell.

### Q2 — Why is a cell not a sentence of genes?

**Answer.** Gene order is arbitrary and the number of expressed genes varies per cell, so positional information is meaningless and the "sentence" length is not fixed. A cell is a **set of genes with expression values**, and using gene identity alone throws away the magnitudes and the zeros. Two fixes: embed **gene identity plus expression value** (normalised), and make the architecture **order-invariant** (no positional embeddings, attention over a set).

### Q3 — TP53 with the same expression in two cells?

**Answer.** The **initial** embeddings are identical: same gene identity and same expression value. The **post-Transformer** embeddings differ, because self-attention mixes TP53 with the other genes expressed in that cell. That is the point: a gene's representation becomes **context-dependent**, capturing gene–gene interactions and cell state.

### Q4 — Frozen scGPT versus dataset-fitted scVI?

**Answer.** Expect the **dataset-fitted scVI** to integrate batches better and often preserve biology better; a zero-shot foundation model was not trained on this dataset and tends to carry its batch structure. The exception is **batch–biology confounding** (e.g. cancer and normal in different batches): aggressive batch removal can delete the signal you want, so a model that removes less may preserve more biology — at the cost of leaving batch in. Decide by measuring biological conservation (cell-type separation, marker recovery), not by assuming integration always helps.

### Q5 — Can CPA predict a completely unseen drug?

**Answer.** Not with standard CPA: each perturbation is a **learned embedding**, so a drug absent from training has no embedding. Generalisation needs a perturbation representation that transfers — chemical structure/fingerprint features, or training on mechanism classes. If the **adversarial weight is zero**, the basal state is no longer forced to be perturbation-invariant, so it can absorb drug information; the clean split between "cell state" and "drug effect" breaks and counterfactual predictions for unseen combinations become unreliable.

### Q6 — Why does GEARS need the perturbation graph $G_\text{pert}$?

**Answer.** $G_\text{gene}$ encodes which genes are co-expressed; $G_\text{pert}$ encodes which perturbations have **similar downstream effects**. GEARS propagates information over $G_\text{pert}$ so the effect of an unobserved knockout can be borrowed from perturbations with similar effects. Using only $G_\text{gene}$ relates perturbations through co-expression, which is a different relationship, so a never-perturbed gene cannot borrow strength and its predicted knockout collapses to something arbitrary or average.

### Q7 — MSE 0.05 vs No-Change 0.06 with 50/10,000 genes changing?

**Answer.** Predicting "no change" is already correct for ~99.5% of entries, so global MSE is dominated by unchanged genes and hides whether the model learned the treatment effect. Evaluate on **differentially expressed genes** (top-k by effect size), use per-gene standardised errors or delta/correlation between predicted and observed effects, and report MSE on changed genes separately. The 0.05 versus 0.06 gap may be clinically meaningless.

!!! tip "If you remember one thing"
    In omics, always ask **what is held out**: a cell, a batch, a perturbation, or a drug never seen. That word decides whether the claim is generalisation or memorisation.

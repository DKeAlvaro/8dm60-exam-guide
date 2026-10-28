# 2 · Vision models

<div class="meta"><span class="hot">Lecture 2</span><span>~15 min</span><span>Images as vectors</span></div>

<p class="lead">A computer cannot see pixels as meaning, so a vision model turns an image into a vector. Different training tricks make that vector useful for different jobs.</p>

## In plain words

- **Self-supervised (DINO).** Take two cropped views of the same image. A *student* network predicts what a slowly-updated *teacher* network says. No labels needed.
- **Contrastive (CLIP).** Show pairs of image and text. Pull matching pairs together in vector space and push mismatched pairs apart. Afterwards you can classify an image by comparing it with text prompts.
- **Generative (LLaVA).** A vision encoder feeds into a language model through a **projection**, so the model can write sentences about the image.
- **Two ways to use a frozen encoder.** A **linear probe** trains only a small classifier on top; **fine-tuning** changes the encoder too. They test different things.
- **Retrieval versus generation.** Retrieval picks an existing report; generation writes a new one.

## Core ideas in one table

| Term | Plain meaning |
| --- | --- |
| Augmented views | Two altered versions of one image (crop, colour, blur). |
| EMA teacher | Teacher weights are a slow moving average of the student. |
| Linear probe | Fit only $W,b$ on fixed features $z=f_\theta(x)$; $\theta$ frozen. |
| Fine-tuning | Update the encoder as well. |
| Contrastive loss | Matching image–text pairs should be more similar than mismatched ones. |
| Softmax over prompts | Normalises scores **across the candidate prompts**, not over diseases. |
| Projection layer | Learned map from image space into the language model's embedding space. |
| External validation | Testing on independently collected data from outside the development source. |

## Exam questions

### Q1 — Teacher momentum $m$: 0, 0.9, 0.999, 1?

**Answer.** $m=0$: the teacher *is* the student, so the target moves every step and training can oscillate or collapse. $m=0.9$: a short memory (about 10 steps), only mild stability. $m=0.999$: a long memory (about 1000 steps), stable targets that prevent collapse — the useful regime. $m=1$: a frozen random teacher; stable but useless, because the student learns to match meaningless initial features. A slow teacher works like an **ensemble of past students**, giving low-variance targets.

### Q2 — What breaks if DINOv2's feature-spread regulariser is removed?

**Answer.** The model can satisfy the matching objective by putting many images/patches in a narrow region — **dimensional collapse / feature crowding**. Neighbours stop being informative even if total collapse is avoided. To test feature usefulness compare **effective rank** of the feature matrix, the distribution of pairwise and kNN distances, linear-probe accuracy, patch-level segmentation probes, and clustering quality.

### Q3 — Encoder A 78/86, encoder B 84/85: which wins?

**Answer.** Frozen probe: **B** (84 vs 78). Fine-tuned: **A** (86 vs 85). The rankings differ because a probe measures only how **linearly separable** the existing features are, while fine-tuning can reshape them. The table cannot establish statistical significance (one split, no confidence intervals), behaviour on external data or other tasks, overfitting, or compute cost.

### Q4 — Adding a third CLIP prompt changes 0.90?

**Answer.** Yes. Softmax normalises over the **candidate set**, so a new prompt changes the denominator and takes probability mass from the others, even if "abnormal" keeps the same similarity. The 0.90 is a **relative score within that prompt list**, not the probability that the patient has the disease; a calibrated probability needs calibration on held-out data with a fixed, clinically defined prompt set.

### Q5 — Two identical captions in one CLIP batch?

**Answer.** No. For each image both texts are equally similar, so the model cannot put all probability on its own copy — the best it can do is split it, and the gradients conflict. Fix by deduplicating the batch, constructing batches with unique texts, or using a multiple-positive contrastive loss that treats all identical texts as positives.

### Q6 — CLIP vector into a frozen text-only LLM?

**Answer.** No, not directly. Matching vector length is irrelevant: the CLIP embedding has a different scale and distribution from the LLM's token embeddings, so it is out of distribution and the LLM has never learned to read it. You need a trained **projection** into the embedding space plus alignment/instruction tuning on image–text pairs; usually the image becomes several tokens, not one.

### Q7 — Image quality control: frozen encoder + head, or instruction-tuned VLM?

**Answer.** The frozen encoder plus small head is cheap, fast, deterministic and easy to calibrate, monitor and validate, but it cannot explain itself or answer new questions. The VLM is flexible and needs no new labels, but it is expensive, slower, prompt-sensitive, harder to calibrate and to audit. If both reach the target accuracy, choose on cost and latency, calibration (ECE), per-class recall, robustness to shift, prompt stability and auditability — plus external validation, subgroup performance and error severity.

### Q8 — Why use different augmented views?

**Answer.** They are related observations of the same content, so the model learns representations that stay **consistent** across irrelevant changes (invariance) without labels.

### Q9 — Purpose of a contrastive image–text objective?

**Answer.** To make the embeddings of matching image–text pairs more similar than those of mismatched pairs.

### Q10 — Retrieval versus generation of reports?

**Answer.** Retrieval selects an **existing** report; generation predicts a **new sequence of tokens**.

### Q11 — What does a linear probe fit?

**Answer.** Only $W$ and $b$ in $p = \mathrm{softmax}(Wz+b)$; the encoder parameters $\theta$ are frozen.

### Q12 — What makes validation external?

**Answer.** The evaluation data were collected **independently, outside the development source** (another site, period or population). A random held-out subset of the same dataset is internal validation.

!!! tip "If you remember one thing"
    A softmax over prompts is a **ranking among the prompts you typed**, never a disease probability. Say that in any CLIP question.

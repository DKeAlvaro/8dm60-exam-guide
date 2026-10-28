# Past exercises · worked answers

<div class="meta"><span class="hot">Highest yield</span><span>BZ guided self-study</span><span>Exam-style</span></div>

<p class="lead">Every guided self-study (BZ) problem from lectures 1–4 and 6, with a model answer. These are the closest thing to the open exam questions: same style, same expected reasoning. Read the question, say your answer out loud, then check.</p>

!!! tip "How to use this in two hours"
    Do not read top to bottom. Pick the lecture you remember least, cover the answer, attempt it in 60 seconds, then read. The exam rewards **structured reasoning**, not definitions: name the mechanism → say what it does → say the consequence.

## Lecture 1 · Language models

### Problem 1 — Lower loss, more factual errors

A model drafts patient letters. A has lower average next-token loss than B, but more often writes "normal" when the report says "pending".

**Answer.**

1. Next-token loss is an average over all tokens, and most tokens are shared boilerplate. Result statements are rare and have several plausible wordings, so errors there barely move the average. Loss is also measured with **teacher forcing** (the reference prefix is given), while generation feeds the model its own output, so errors compound (**exposure bias**). A lower average loss only establishes that A assigns slightly higher likelihood to observed tokens on average under teacher forcing — it says nothing about factual consistency on the clinically important, rare tokens.
2. Greedy decoding does not solve it. The problem is in the learned distribution and the evaluation target, not the sampling. Greedy can even make it worse: the most probable continuation after "Result" may be the frequent phrase "was normal", and greedy removes the chance of sampling the correct rare token. It can also produce degenerate repetition.
3. Clinician assessment: sample held-out reports **stratified** to include pending results, abnormal values and rare findings, not just the common ones. Each clinician sees the source report and the two generated letters in random order, blinded to which model produced which (or rates them independently). They mark every factual claim as supported / contradicted / unsupported, plus a severity. Primary outcome: proportion of letters with at least one **clinically significant** factual error; secondary: errors per letter. Compare paired by report (McNemar), report confidence intervals, and measure inter-rater agreement. This controls for report difficulty.

### Problem 2 — Position vectors before vs after the Transformer

Reports: `left opacity right clear` → left; `left clear right opacity` → right. Architecture A adds position vectors before the Transformer, B after.

**Answer.**

- **A works.** Positions are injected at the input, so every token embedding already carries "which side am I on". Attention compares content and position jointly, and the classifier receives an averaged representation in which the opacity token is tagged left or right. The two reports produce different averaged vectors.
- **B fails.** Without positional information, self-attention is **permutation-equivariant**: it sees the same multiset of token embeddings for both reports. Adding position vectors after the Transformer only adds the same fixed pattern to both, and the average over positions is identical for both inputs ($\frac14\sum_i h_i + \frac14\sum_i p_i$). The classifier gets exactly the same vector, so it cannot distinguish left from right.
- General point: positional information must enter **before** any operation that mixes tokens; averaging afterwards cannot recover an order that was never encoded.

### Problem 3 — Causal mask only in layer 2

Tokens `finding → is → absent`. Layer 1 is full attention, layer 2 is causal. Claim: at "is", layer 2 cannot use "absent".

**Answer.** The claim is **wrong**. The causal mask in layer 2 only restricts attention *within* layer 2. The input to layer 2 at position "is" is the layer-1 output, and layer 1 attended to **all** positions, including "absent". So the representation of "is" already contains information about "absent" before the mask is applied. The model can predict "absent" from a representation that has seen the answer — **target leakage**. Masking must be causal from the first layer (or at every layer) for a decoder-only model to be valid.

### Problem 4 — Guidelines that change several times per year

**Answer.** Use **retrieval-augmented generation**, not fine-tuning on history. Index the current guidelines with document ID, section and version. At request time, use the patient characteristics to retrieve the applicable sections, put them in the prompt with their version metadata, and require the answer to cite the supporting document and version (or abstain if nothing relevant is retrieved). Re-index when guidelines change; the model weights never need to change.

Fine-tuning on historical examples is insufficient because the guidelines change several times a year (the weights encode a frozen snapshot and cannot cite a version), rare patient groups are underrepresented so the model cannot learn their rules, and fine-tuning does not prevent confident hallucination.

A way the system can still fail: retrieval selects the wrong or an outdated section (bad chunking, embedding miss, version not filtered), the prompt contains conflicting sections, or the patient characteristics used for retrieval are incomplete, so the model produces a recommendation that is correctly cited but not applicable. Mitigation: version filtering, multiple retrievals, and abstain when no passage matches.

### Problem 5 — LoRA adapters: per department vs pooled

Per-department adapters give 90/90/90; pooled gives 94/82/80 (A has 800 eval letters, B and C only 100 each).

**Answer.**

1. Do **not** adopt pooled on the aggregate number alone. The aggregate is dominated by department A (800 of 1000 letters), and this is a **Simpson-style** aggregation: pooling helps A but costs B and C eight to ten points — a large, clinically relevant regression in exactly the departments with less data. Next action: report results **stratified by department** with confidence intervals, test whether B/C drops are significant, inspect the errors (does pooled ignore departmental instruction style?), and require no subgroup degradation as an acceptance criterion. Then decide between per-department adapters or a pooled adapter plus department-specific adapters.
2. LoRA keeps the base weights frozen and learns a low-rank update $\Delta W = BA$ per layer. Store **one** copy of the base model plus three small adapter sets and swap/route by department at inference (multi-adapter serving); memory is shared, and only the adapters differ.

## Lecture 2 · Vision models

### Problem 1 — Teacher momentum $m$

**Answer.**

- $m=0$: the teacher is replaced by the student after every step. There is no stable target; the teacher chases the student and the objective can collapse or oscillate.
- $m=0.9$: an exponential moving average with a horizon of about 10 steps. The teacher follows quickly, giving only mild stability.
- $m=0.999$: horizon about 1000 steps. The teacher changes slowly, providing consistent targets and preventing a fast student–teacher feedback loop that collapses representations. This is the useful regime.
- $m=1$: the teacher is frozen at initialisation. It is stable but useless — the student is trained to match random/initial features, which encodes no knowledge.

A slowly changing teacher is useful because it acts like an **ensemble of past student checkpoints**, giving stable, low-variance targets that avoid collapse and make self-supervised learning work without labels.

### Problem 2 — Removing feature-spread regularisation from DINOv2

**Answer.** Without the spread regulariser (KoLeo-style), the matching objective can be satisfied by mapping many images/patches into a narrow region of feature space: **dimensional collapse / feature crowding**. Local neighbours become uninformative even if global collapse is prevented by centering and sharpening. Patch features in particular lose the diversity needed for segmentation and dense tasks.

Compare between runs: the **effective rank / singular-value spectrum** of the feature matrix, the distribution of pairwise distances (and kNN distance), linear-probe accuracy on image-level labels, patch-level segmentation/dense probes, clustering quality, and attention-map diversity. Matching loss alone is not sufficient: it can be low while features are collapsed or uniformly spread without semantic structure; you need downstream probes and spread diagnostics.

### Problem 3 — Frozen linear probe vs fine-tuning

Encoder A: 78% frozen, 86% fine-tuned. Encoder B: 84% frozen, 85% fine-tuned.

**Answer.** Frozen + linear head favours **B** (84 vs 78). Fine-tuning favours **A** (86 vs 85). The rankings differ because a linear probe only measures how **linearly separable** the existing features are, whereas fine-tuning can reshape the representation; A's features may be less linearly accessible but more adaptable (better initialisation for the task), while B may already be near its ceiling.

The table alone cannot establish: whether the differences are statistically significant (one split, no CIs), whether they hold on external data or other tasks, whether A's fine-tuned gain is overfitting, or the cost/compute difference. A single 1-point gap is well within noise.

### Problem 4 — Softmax scores and a third description

**Answer.** Yes, the score for "abnormal" can change even if its similarity is unchanged, because softmax normalises over the **candidate set**: adding "pneumonia" changes the denominator and takes probability mass from every existing option. The 0.90 is a **relative score within the prompt set**, not a calibrated probability of disease. Reporting it as a patient probability is misleading; you would need calibration on held-out data for a fixed, clinically defined candidate set.

### Problem 5 — Two identical captions in a CLIP batch

**Answer.** No. Both images have the same positive text vector, so for image 1 the two identical texts are indistinguishable in the softmax: it cannot assign all probability to its own copy while assigning none to the other, because their similarities are equal. The best it can do is split the mass between them (e.g. 0.5/0.5), and gradients from the two rows conflict.

Fix: deduplicate the batch, or use a contrastive objective that treats **all identical texts as positives** (multiple-positive / debiased contrastive loss), or construct batches so that no two texts are identical.

### Problem 6 — CLIP vector into a frozen text-only LM

**Answer.** Search: using frozen CLIP for text–image retrieval is reasonable zero-shot, but validate on the archive (domain shift, prompt wording, threshold).

Explanations: **matching the vector length is not enough**. The CLIP embedding lives in a different space, with a different scale and distribution, from the LM's token embeddings; the LM has never learned to interpret it, so it is out-of-distribution and the model will ignore or misread it. You need a learned **projection** (linear/MLP) mapping image features into the LM embedding space, trained on image–text pairs, plus instruction tuning so the LM learns to use visual tokens. Often the image is mapped to several tokens, not one.

### Problem 7 — Small head on frozen encoder vs instruction-tuned VLM

**Answer.**

- **A (frozen encoder + small head):** cheap, fast, deterministic, easy to calibrate, monitor and validate; needs representative labels; cannot explain or handle new questions.
- **B (instruction-tuned VLM):** flexible, can explain and follow new instructions, no new labels; but expensive, slower, prompt-sensitive, harder to calibrate, more failure modes, harder to audit.

If both meet accuracy, choose on **cost/latency at the fixed inference budget**, calibration (ECE), per-class recall, robustness to shift, stability across prompt wording, and auditability. Additional measurements: external validation set, subgroup performance, calibration curve, inference cost per image, and error severity analysis.

### Bonus B1 — Adding "ultrasound" to a frozen CLIP classifier

**Answer.** Add the text description(s) for ultrasound; CLIP compares the image embedding with the new text embedding, so **no retraining is required to produce a prediction**. What must be checked: that ultrasound images are actually closer to the ultrasound prompt than to X-ray/CT/MRI prompts (validate on labelled ultrasound images), prompt wording, confusion with other modalities, and that thresholds/calibration still hold. Zero-shot performance for a new class is not guaranteed just because the class was added.

### Bonus B2 — More captions vs specific question–answer pairs

**Answer.** Specific question–answer pairs address the behaviour more directly: they teach **instruction following and question-conditioned answering**, which caption alignment does not. More image–caption pairs only improve broad descriptive alignment. Limitation of the QA option: it does not by itself fix hallucination or factual grounding, and it may not generalise to questions outside the collected distribution.

### Bonus B3 — Retrieval-augmented visual assistant

**Answer.** Design a **within-image, paired comparison**: the same assistant with and without retrieved captions, on the same held-out images, stratified by radiologist-rated difficulty. Radiologists are blinded to condition and assess factual correctness, completeness, hallucinated findings, and whether the output is influenced by captions that do not match the image. To separate useful context from retrieved-caption errors: check whether claims match the retrieved captions but not the image (attribution/overlap analysis), and include a condition with deliberately **wrong** retrieved captions to see whether the assistant copies them. Keep retrieval only if it improves accuracy on difficult images without increasing caption-induced errors.

## Lecture 3 · Omics models

### Problem 1 — How scVI addresses five challenges

**Answer.**

1. **Sparsity / excess zeros** — zero-inflated negative binomial (ZINB) likelihood: a dropout gate models excess zeros, the NB component models counts and overdispersion.
2. **Varying sequencing depth** — the observed library size $l_i$ enters the NB mean as an explicit scaling factor, so the latent representation is normalised for depth.
3. **Batch effects** — batch is a categorical covariate fed to the encoder and decoder (conditional VAE), so the model learns batch-specific parameters while $z$ captures biology.
4. **Biological/transcriptional noise** — a probabilistic latent variable with a prior (VAE), sampled stochastically, plus NB dispersion; inference is amortised rather than per-cell.
5. **Scalability** — amortised variational inference with an encoder network + mini-batch SGD on GPU, instead of optimising per-cell parameters.

### Problem 2 — Genes as a sentence

**Answer.** scRNA-seq is a **set of genes with expression values**, not an ordered sequence: gene order is arbitrary, so positional embeddings are meaningless, and the list length/set varies per cell. Feeding gene identity alone also discards the expression magnitude and the zero pattern.

Two changes: (1) embed **gene identity + expression value** (e.g. $h_i = \text{emb}_g(g_i) + \text{emb}_x(x_i)$, with values normalised/log-transformed); (2) make the architecture **order-invariant** (no positional embeddings; set-transformer/attention without position, or rank-based ordering), and normalise for library size.

### Problem 3 — TP53 in two cells

**Answer.** Initial embedding: **identical**, because the gene identity and expression value are the same. Post-Transformer: **different**, because self-attention mixes TP53 with the other genes expressed in that cell; in a stressed cancer cell the co-expressed context (stress, proliferation, immune programmes) differs, so TP53's contextualised representation changes. That is the biological capability: a gene's representation becomes **context-dependent**, capturing gene–gene interactions and cell state rather than a fixed dictionary meaning.

### Problem 4 — Zero-shot foundation model vs scVI on a new dataset

**Answer.** Based on Kedzierska et al., expect the **dataset-fitted model (scVI)** to integrate the batches better and often preserve biological variation better than zero-shot foundation-model embeddings, which were not trained on this dataset and tend to carry batch structure. Zero-shot embeddings are convenient but not automatically better.

If batch is **strongly confounded with biology** (cancer vs normal in different batches), aggressive batch integration can remove the biological signal it is supposed to preserve. Then a zero-shot representation that has not been optimised to remove this dataset's batch effect may retain more biology and could be preferable — at the cost of leaving batch structure in. The right response is to evaluate both on biological conservation metrics (e.g. cell-type separation, marker recovery), not to assume integration is always good.

### Problem 5 — CPA and a novel drug

**Answer.** Standard CPA represents each perturbation by a **learned embedding**, so a drug never seen in training has no embedding and cannot be predicted zero-shot. To generalise you need a perturbation representation that transfers to unseen drugs (chemical structure/fingerprint encoder, or a model trained on mechanism classes).

If the adversarial perturbation discriminator weight is zero, the basal state $z_\text{basal}$ is no longer forced to be **perturbation-invariant**: it can absorb perturbation information, so the model stops cleanly separating "cell state" from "drug effect". Counterfactual predictions for unseen drug combinations then become unreliable, because the decomposition that makes them meaningful is no longer enforced.

### Problem 6 — Why GEARS needs $G_\text{pert}$

**Answer.** $G_\text{gene}$ encodes **gene co-expression**: which genes are expressed together. $G_\text{pert}$ encodes **similarity between perturbations**: which perturbations have similar downstream effects (e.g. same pathway/complex). GEARS propagates information over $G_\text{pert}$ so that the embedding of an unobserved knockout can be inferred from perturbations with similar effects.

If you use $G_\text{gene}$ for perturbation message passing, you relate perturbations through gene co-expression, which is not the same relationship; a never-perturbed gene cannot borrow strength from biologically similar perturbations, so zero-shot prediction of its knockout effect collapses to something like an average or is arbitrary.

### Problem 7 — Low global MSE with a No-Change baseline

**Answer.**

1. About 50 of 10,000 genes change per treatment, so predicting the control state is correct for ~99.5% of entries; the global MSE is dominated by the vast unchanged majority.
2. The neural network can achieve a low global MSE by predicting close to control almost everywhere; its errors on the few changed genes contribute almost nothing to the average, so global MSE hides whether it learned treatment-specific effects. The improvement 0.06 → 0.05 may be clinically irrelevant.
3. Evaluate only on **differentially expressed genes** (top-k by effect size), use per-gene standardised errors or delta/correlation metrics (predicted vs observed effect sizes), report MSE on changed genes separately, and use ranking metrics. Feature selection should focus on genes with real treatment effects rather than all 10,000.

## Lecture 4 · Models for hospital data

### Problem 1 — Aggregation destroys information

**Answer.**

1. No difference: both patients have mean systolic pressure 100 mmHg, so the row is identical; the trend (recovering vs deteriorating) is lost.
2. The ten chunk embeddings are averaged, so the one chunk with "new pleural effusion" contributes 1/10 of the text vector; mean pooling dilutes sparse but critical findings, and a chunk-level clinical embedding may not preserve the detail/negation strongly enough.
3. Vital signs: keep **trend features** (slope, min, max, last value, time since abnormal) instead of only the mean — new problem: more features, collinearity and missingness, higher overfitting risk. Text: keep per-chunk embeddings or use attention/max pooling, or retrieve salient sentences — new problem: much higher dimensionality, more data needed, and attention weights are harder to interpret/validate.

### Problem 2 — Metrics under class balancing

**Answer.**

1. **Sensitivity, specificity and AUROC** can carry over, because they are conditional on the true class (or threshold-free) and do not depend on prevalence. **Precision and accuracy cannot**: they depend on the prevalence, which was changed by undersampling.
2. At 10% prevalence: $\text{PPV} = \frac{0.7 \times 0.1}{0.7 \times 0.1 + 0.3 \times 0.9} = \frac{0.07}{0.34} \approx 0.21$. So about **2 in 10** alarms, not 7.
3. Build the test set with the **real prevalence** (no undersampling; if you must balance for training, reweight or recalibrate for evaluation). Ask additionally for a calibration curve, decision-curve/net benefit, and external validation at another site.

### Problem 3 — Treatment paradox in septic shock labels

**Answer.**

1. A fluid bolus is given because of early signs of sepsis. Treated patients who never develop shock are labelled negative, so the model learns "bolus → low risk". Patients who resemble those treated negatives then get **underestimated** risk — confounding by indication / treatment paradox.
2. Removing all bolus patients fixes that bias but creates **selection bias**: you remove a clinically important subgroup, change the case mix, and the model is no longer applicable to the patients most likely to be treated; you also lose information about the effect of treatment.
3. Treated patients who never developed shock are "cured" by the intervention: including them in evaluation would count the treatment's success (or the model's missed opportunity) as model performance. Excluding them makes the reported performance apply only to untreated/selected patients; it does not tell you how the model performs in the full deployed population, and it cannot estimate the causal effect of the alert.

### Problem 4 — Bidirectional LSTM reused for hourly alerts

**Answer.**

1. For the 24-hour mortality model, the prediction is made at hour 24 using the completed 24-hour window, so reading forwards and backwards uses no information from after the prediction time. Bidirectionality is acceptable.
2. No, "dataset shift" is not sufficient. At hour $t$ the bidirectional network reads the **whole stay**, including future hours: retrospective AUROC is inflated by **future information leakage**. Other causes: retrospective vs prospective differences in data capture, missingness, alert-response behaviour, case mix, and clinician workflow changes.
3. Feed **causal inputs**: truncate the sequence at each prediction hour and use a causal/unidirectional model, or train on snapshots with only data available at that hour. Evaluate retrospectively on hourly snapshots (predict at $t$, label $t$ to $t+12$), excluding post-event data, and simulate deployment conditions; then a prospective silent trial.

### Problem 5 — Discrimination vs calibration for ICU comparison

**Answer.**

1. AUROC favours **A** (0.91 vs 0.88): better discrimination. Average predicted risk favours **B** for calibration (8.5% vs observed 8%; A predicts 19%, overestimating). In the 30–40% band, A predicts 12% observed (overestimates) while B's 33% is close. So A ranks better, B is calibrated better.
2. 200 patients × 8% = 16 deaths. Model A predicts 19% × 200 = **38 deaths**. O/E = 16/38 ≈ **0.42**, suggesting this ICU performs much better than expected — or, more likely, that model A overestimates risk.
3. Use **B** (or recalibrate A on held-out data with Platt/isotonic scaling) for O/E comparison, because O/E requires calibration. The table alone cannot establish whether O/E differences reflect quality of care vs **case-mix differences** (risk adjustment), statistical uncertainty, or subgroup calibration.

### Problem 6 — Adding X-rays: 0.90 on a selected 1,500

**Answer.**

1. Not justified. The 0.90 is measured only in the 1,500 patients who had a chest X-ray in the first 24 hours, and those patients have **14% mortality vs 7%** overall — a sicker, selected group. The +0.04 cannot be attributed to X-rays for all patients; it is confounded by indication/selection.
2. At hospital K: no free-text notes, so the notes path is unavailable (structured-only performance, ~0.86 or worse); every ICU patient has an admission X-ray, but the model was trained on selected X-ray patients, so applying the X-ray path to everyone is a different distribution. Expect a performance drop and calibration shift, plus different missing-modality behaviour.
3. Before use: external validation at K, stratified by available modality, calibration, robustness to missing notes, case-mix comparison, and a prospective silent trial with monitoring.

### Problem 7 — Age and false-positive rates

**Answer.**

1. Older patients have higher baseline mortality and comorbidity, so a fixed threshold flags more of them; age is a strong predictor correlated with frailty and atypical presentation. The higher FPR may partly reflect genuine risk, but the disparity is still a fairness problem.
2. Removing age is unlikely to fix it: the model can reconstruct age from **proxies** (diagnoses, labs, procedures, notes), so the disparity persists while performance drops and the model becomes less transparent. It treats a symptom, not the cause.
3. Alternative: subgroup-aware calibration / equalised-odds post-processing, reweighting or more training data for older groups, and auditing subgroup calibration and net benefit. Measure FPR/TPR by group, calibration curves, and clinical net benefit; involve clinicians in setting acceptable trade-offs.

### Bonus B1 — Random split vs temporal + patient split

**Answer.** Team 2's 0.81 is the better estimate of live performance in 2027. Two separate reasons for the gap: (1) Team 1's random split leaks **patients** across splits — repeat admissions of the same patient appear in train and test — and ignores time; (2) Team 2's split reflects **temporal drift** and future deployment, and excludes patients seen in training. Before going live: calibration, subgroup performance, monitoring/drift plan, and consistency of the data pipeline.

### Bonus B2 — Missing lactate and a new protocol

**Answer.** The "was measured" feature is a proxy for **clinician concern**, which is legitimate information available at prediction time — but it is fragile: it encodes a workflow decision, not physiology. After the protocol, lactate is measured for everyone, so the feature becomes constant and loses its predictive power; the lactate distribution also shifts (more normal values), breaking the learned association. Expect miscalibration and a performance drop.

Handling: monitor and retrain/recalibrate after the protocol change, version the model, and replace workflow-artefact features with explicit clinical-concern variables if possible; validate prospectively before relying on it.

## Lecture 6 · Agentic AI

### Problem 1 — Tool description in the prompt

**Answer.** No. Describing the tool only makes the model able to produce a correctly formatted request; it does not establish that the request is executed, that arguments are valid, that the result is parsed and fed back, or that the tool behaves correctly on real inputs. You need an **end-to-end test**: actual invocation, schema validation, failure/error handling, and evaluation of final outputs against ground truth across representative cases.

### Problem 2 — Predefined workflow vs agent

**Answer.** Choose the **predefined workflow**. The possible paths are known in advance: quality fail → replace; incomplete measurements → human review. The deciding question is whether the possible paths can be enumerated, not whether the system branches or uses an LLM. An agent adds non-determinism, cost, latency and validation burden with no benefit when the decision logic is fixed. A workflow with explicit branches and human-review steps is easier to validate, monitor and audit.

### Problem 3 — Parallelization vs orchestrator-workers

**Answer.** A → **predefined parallelization**: the three summaries are independent and defined before execution. B → **orchestrator-workers**: which reviews/analyses are relevant depends on the case, so decomposition must happen at runtime. The architectural difference that matters is whether subtasks are fixed in advance or chosen by the orchestrator. Orchestration adds coordination cost: extra LLM calls and latency, error propagation, non-determinism, harder evaluation, and a synthesizer that must reconcile outputs — justified only when the task genuinely cannot be decomposed in advance.

### Problem 4 — Evaluator–optimizer criteria

**Answer.** **Direct checks against source records** (deterministic): every requested finding present; values and units preserved exactly; chronology/order correct; no fabricated values. **Judgement of text** (needs a judge): clarity, clinical coherence, no unsupported claims, appropriate emphasis.

Accept only when all deterministic checks pass **and** the judge scores above a threshold with no new unsupported claims. Use a revision limit as a fallback, but record "revision limit reached" as a **failure**, distinct from acceptance; log the acceptance reason. Beware evaluator drift and self-preference, so keep a held-out human-rated set to validate the evaluator itself.

### Problem 5 — AI-SCE-style evaluation of workflow vs agent

**Answer.** Include situations with missing information, inconsistent records (conflicting medications/labs), ambiguous findings, and routine controls. Record every tool call, query, step taken, tokens/time, and whether missing information was identified and inconsistencies resolved. Compare outcomes (correctness/completeness vs ground truth), process quality (evidence attribution, unnecessary queries, appropriate escalation), and resource use (calls, latency, cost).

To distinguish a well-supported summary from an **accidentally correct** one: require each statement to cite its source record, score unsupported-but-correct statements as failures, and inject known inconsistencies so you can check detection. Use paired cases and blinded graders.

## Pattern summary

| If the question says… | Reach for… |
| --- | --- |
| "lower loss but worse facts" | teacher forcing vs generation, loss dominated by common tokens, evaluate the rare critical facts |
| "position added before/after" | permutation equivariance; positional info must enter before mixing; averaging destroys order |
| "mask in layer 2 only" | leakage through earlier full-attention layer; masking must be causal everywhere |
| "guidelines change / cite the source" | RAG + versioned index + citation/abstain, not fine-tuning |
| "per-group vs pooled" | stratified metrics, Simpson-style aggregation, subgroup regression |
| "momentum / EMA teacher" | stability vs plasticity; slow teacher avoids collapse |
| "frozen probe vs fine-tune" | linear separability vs adaptability; a single split cannot establish significance |
| "softmax over descriptions" | relative score, not calibrated probability |
| "identical texts in batch" | contrastive conflict, multiple positives / dedup |
| "vector length matches" | projection + alignment training needed |
| "unseen drug / unperturbed gene" | categorical perturbation embedding cannot extrapolate; graph prior transfers |
| "global MSE low" | dominated by unchanged genes; evaluate DE genes/deltas |
| "mean of readings" | trend information lost; keep slope/min/max |
| "balanced test set, 10% prevalence" | PPV = sens·prev / (sens·prev + (1−spec)(1−prev)) |
| "AUROC 0.95 retrospective, 0.71 live" | future leakage, not just dataset shift |
| "O/E comparison between ICUs" | needs calibration, not just AUROC; risk adjustment |
| "remove age to be fair" | proxies remain; subgroup calibration/equalised odds |
| "tool described in prompt" | description ≠ execution; end-to-end test |
| "all exceptions known" | workflow, not agent |
| "subtasks fixed vs case-dependent" | parallelization vs orchestrator-workers |

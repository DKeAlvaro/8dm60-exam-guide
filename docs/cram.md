# Cram sheet · 30 minutes

<div class="meta"><span class="hot">Read this first</span><span>One page</span><span>Then stop</span></div>

<p class="lead">Everything that fits on one screen per topic. If you only have 30 minutes, read this page and the MCQ key. The longer pages are backup.</p>

## 10 multiple-choice answers

| Question cue | Answer |
| --- | --- |
| Autoregressive targets | Each observed token, given the preceding context |
| $p_i$ in $e(x_i)+p_i$ | Position of the token |
| Self-attention | Q, K, V from the **same** sequence |
| Zero-shot vs few-shot | No demonstrations vs demonstrations (weights frozen in both) |
| LoRA shapes | $B\in\mathbb{R}^{d\times r}$, $A\in\mathbb{R}^{r\times k}$ |
| Augmented views | Related observations → consistent representations |
| Contrastive image–text | Matching pairs higher similarity than mismatched |
| Retrieval vs generation | Select an existing report vs predict tokens |
| Linear probe | Fit $W,b$; freeze $\theta$ |
| External validation | Independent data from outside the development source |
| ReAct observation | Returned by the **tool executed by the program** |
| ReAct itself | Interleave reasoning and actions |
| ReAct few-shot | Example trajectories in context, weights fixed |
| Search helps hallucination | Supplies evidence for later reasoning |
| Workflow vs agent | Predefined paths vs LLM directs process/tools |
| Extract → draft → translate | Prompt chaining |
| Classify → specialist handler | **Routing** (not parallelization) |
| Static MCQ benchmark misses | Deciding what to request next |
| Agent-based modelling | Simulates actions/interactions of participants |
| Simulation success → next | Real-world clinical studies + post-deployment monitoring |

## 6 formulas

$$\text{PPV} = \frac{\text{sens}\cdot p}{\text{sens}\cdot p + (1-\text{spec})(1-p)} \qquad \text{NPV} = \frac{\text{spec}(1-p)}{\text{spec}(1-p)+(1-\text{sens})p}$$

$$O/E = \frac{\text{observed deaths}}{\text{mean predicted risk}\times n}$$

- $TP=\text{sens}\times P$, $FN=(1-\text{sens})P$, $FP=(1-\text{spec})N$, $TN=\text{spec}\cdot N$.
- Calibration = predicted vs observed; discrimination = AUROC. O/E needs calibration.
- Softmax over $k$ candidates: a score is **relative**, not a calibrated probability.
- Mean of readings loses trend: keep slope, min, max, last value.

## 6 open-question templates

1. **"Lower loss but worse facts"** → loss averages over common tokens; teacher forcing vs own output; evaluate rare critical facts with blinded clinicians.
2. **"Novel perturbation/drug"** → categorical embedding cannot extrapolate; need structure/feature encoder or graph prior.
3. **"Biased/leaky evaluation"** → say the specific leakage (future data, patient overlap, balancing, treatment paradox), then the fix (causal inputs, patient-level temporal split, real prevalence, exclude treated negatives).
4. **"Deployment decision"** → intended use → unit of output → local validation → operating point (who bears FP vs FN) → monitoring + exit plan → economics.
5. **"Workflow or agent?"** → can the paths be enumerated in advance? Yes → workflow; no → agent/orchestrator. Not "does it use an LLM".
6. **"Evaluate an LLM system"** → build a test set with injected errors/missing data; measure outcome, process (evidence attribution, unnecessary steps) and cost; distinguish supported from accidentally correct.

## 5 rules that earn points

1. **Name the mechanism, then the consequence.** "Attention is permutation-equivariant, therefore both reports give the same averaged vector."
2. **Always separate discrimination from calibration.** AUROC is threshold-free; decisions need a threshold and calibration.
3. **Say whose error it is.** False positive vs false negative, and who signs off.
4. **State what a result cannot establish.** One split, one site, no CIs → no significance, no transportability.
5. **For any model claim, ask: was the reference standard independent of the model?** Anchoring and "zero discrepancies" are not validation.

## The one-line answer to most essay questions

> The model's score is only a ranking; the clinical decision needs an operating point, calibration, validation on the local case mix, and a named owner for the residual risk.

# Your project · 15%

<div class="meta"><span class="hot">Poster + code</span><span>15% of the grade</span><span>Be specific</span></div>

<p class="lead">These questions are about your poster and code, so the answers are yours. Below is the shape of a good answer and the terms you must be able to define on the spot.</p>

## Terms you must know

| Term | Plain meaning |
| --- | --- |
| Baseline | The simplest reference result you must beat (majority class, logistic regression, no-change). |
| Leakage | Information in training/test that you would not have at prediction time, or that encodes the answer. |
| Internal validation | Held-out data from the same dataset. |
| External validation | Data collected independently, another site, period or population. |
| Calibration | Predicted risk versus observed risk. |
| Confidence interval | A range that expresses uncertainty around an estimate; overlapping intervals mean the difference may be noise. |
| Ablation | Remove one component and measure what changes, to show it mattered. |
| Reproducibility | Somebody else can rerun your code on the raw inputs and get your numbers. |

## How to answer any project question

1. **Claim first.** "We tested whether X predicts Y."
2. **Number second.** Effect size or metric, with an interval if you have one.
3. **Limitation third.** Name it before the examiner does.
4. **Point to the code.** "Figure 2 comes from notebook 3, cell 12, seed 42."

!!! warning "Three answers that lose points"
    "The model is better" with no baseline. "We got 0.9 accuracy" on imbalanced classes. "Random split" without mentioning patient overlap.

## Questions to rehearse out loud

### What is your research question, and which result answers it?

Say the population, the input and the outcome in one sentence, then point to the exact panel that tests it. If the question changed during the project, say so and why.

### Why these data, labels and splits? Where could leakage enter?

Say why the dataset fits the question, how the label was defined, and how the split was made. Then name the concrete leakage risk: same patient on both sides, future data, duplicates, preprocessing fitted on the full set.

### Why this model and baseline? What would a simpler alternative test?

Justify the model by data type and size. Name the baseline and what a simpler model would isolate: is the gain from the architecture or just from more parameters?

### Which preprocessing and training choices matter most?

Pick two or three and say what changes if you flip them: normalisation, class imbalance, augmentation, learning rate, early stopping, seed variance. "We tuned until it worked" is not an answer.

### What does each metric measure, and what do your numbers establish?

Separate discrimination (AUROC) from calibration, and both from the operating point. Say what the number does **not** establish: one split, one site, no intervals means no claim of significance or transportability.

### How does the code reproduce each figure and table?

For each panel: input file, script or notebook, command, output. Mention the environment, seeds and any manual step. If something is not reproducible, say it — that is a limitation, not a disqualification.

### Where does your approach fail, and what would you test next?

Name the **main** failure mode, the strongest limitation (data, labels, evaluation, compute), and the **one** next experiment that would be decisive. An honest limitation scores better than a confident overclaim.

!!! tip "If you remember one thing"
    Every poster claim should survive: "compared to what, measured how, on whom?"

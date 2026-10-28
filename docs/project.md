# Your project · 15%

<div class="meta"><span class="hot">Poster + code</span><span>15% of the grade</span><span>Be specific</span></div>

<p class="lead">These questions are about <em>your</em> poster and code, so nobody can answer them for you. What follows is the shape of a good answer: one claim, one number, one limitation.</p>

## How to answer any project question

1. **Start with the claim, not the method.** "We tested whether X predicts Y."
2. **Give the number.** Effect size, metric, confidence interval if you have one.
3. **Name the limitation before they do.** It shows you understand it.
4. **Point to the code.** "This figure comes from `notebook X`, cell Y, seed 42."

!!! warning "The three answers that lose points"
    "The model is better" without a baseline. "We got 0.9 accuracy" when the classes are imbalanced. "We used a random train/test split" without mentioning patient overlap.

## Exam questions

### Q1 — What is your research question, and which result answers it?

**How to answer.** One sentence with a population, an input, an outcome. Then the exact figure or table on the poster that tests it. If the question changed during the project, say so and why.

### Q2 — Why these data, labels and splits? Where could leakage enter?

**How to answer.** Say why the dataset fits the question, how labels were defined, and how the split was made. Name the leakage risk concretely: same patient in train and test, future data, duplicates, preprocessing fitted on the full set. Then say what you did about it.

### Q3 — Why this model and baseline? What would a simpler alternative test?

**How to answer.** Justify the model by the data type and size. Name the baseline (majority class, logistic regression, no-change) and what a simpler model would isolate — e.g. whether the gain comes from the architecture or just from more parameters.

### Q4 — Which preprocessing, training and hyperparameter choices matter most?

**How to answer.** Pick two or three decisions and say what changes if you flip them. Mention normalisation, class imbalance, augmentation, learning rate, early stopping and seed variance. "We tuned until it worked" is not an answer.

### Q5 — What does each metric measure, and what do your numbers establish?

**How to answer.** Separate discrimination (AUROC) from calibration, and both from the operating point. Say what your number does **not** establish: one split, one site, no confidence intervals means no claim of significance or transportability. For imbalanced data report per-class recall and PPV at a stated prevalence.

### Q6 — How does the code reproduce each poster figure and table?

**How to answer.** For each panel: input file, script or notebook, command, output. Mention the environment, random seeds and any manual step. If something is not reproducible, say it plainly — that is a limitation, not a disqualification.

### Q7 — Where does your approach fail, what is the strongest limitation, and what next?

**How to answer.** Name the **main** failure mode (not a list of generic ones), the strongest limitation (data, labels, evaluation, compute), and the **one** next experiment that would be decisive. Be honest: a well-understood limitation scores better than a confident overclaim.

!!! tip "If you remember one thing"
    Every claim on your poster should survive the question "compared to what, measured how, on whom?"

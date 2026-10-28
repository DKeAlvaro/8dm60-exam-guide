# 4 · Models for hospital data

<div class="meta"><span class="hot">Lecture 4</span><span>~18 min</span><span>Read → answer → check</span></div>

<p class="lead">Hospital records are messy measurements over time. This page defines the data, the metrics, and the four ways a model can look better than it is.</p>

## 0. The nine questions for any prediction paper

The lecture's framework for interrogating a clinical prediction model — use it to structure an open answer:

| | Question | What it asks |
| --- | --- | --- |
| Q1 | Task | What is the clinical prediction task? |
| Q2 | Data | What patient data are available to the model? |
| Q3 | Representation | How is the patient represented? |
| Q4 | Captured / lost | What does the representation capture, and lose? |
| Q5 | Architecture | How does the architecture reflect the data structure? |
| Q6 | Training | How is it trained, and is that appropriate? |
| Q7 | Evaluation | How is performance measured, on whom, with which metrics? |
| Q8 | Bias and failure | Where are the sources of bias, uncertainty and failure? |
| Q9 | Generalization | Is there evidence it works beyond the training data? |

!!! question "Check yourself"
    A paper predicts 30-day readmission from a random split of one hospital's EHR. Which of the nine questions does it answer well, and which one does it fail?

??? success "Answer"
    It can answer Q1–Q7 for that hospital. Q8 needs the bias analysis (selection, treatment, missingness, leakage). Q9 fails: a random split of the same source is internal validation only — no external cohort, no prospective cases, so transportability is unsupported.

## 1. What hospital data are

**Explanation.** An **EHR** (electronic health record) stores, per patient: **demographics**, **vitals** (heart rate, blood pressure — measured repeatedly), **labs** (blood tests, e.g. lactate), **notes** (free text written by clinicians), medications, procedures and images. A **patient representation** is the vector a model uses: **static** (one row per patient), **longitudinal** (a sequence over time) or **multimodal** (text + numbers + images combined).

!!! question "Check yourself"
    Give one thing a static representation can express and one thing it cannot.

??? success "Answer"
    It can express, for example, the mean systolic pressure or the admission diagnosis. It cannot express the **trend** (improving versus deteriorating) or the timing of an event, because the sequence has been collapsed into one row.

## 2. Aggregation destroys information

**Explanation.** **Aggregation** replaces many values with one: a mean, a max, or an averaged embedding. It is convenient (fixed-size input) but lossy. For text, each chunk is embedded separately and the chunks are pooled; **mean pooling** gives every chunk the same weight, so one critical sentence is diluted.

!!! question "Check yourself"
    Two patients both have mean systolic pressure 100 mmHg; one is recovering, one deteriorating. What is lost, and how would you keep it (at what cost)?

??? success "Answer"
    The **trend** is lost: both rows are identical. Keep trend features instead of only the mean — slope, minimum, maximum, last value, time since an abnormal value. Costs: more features, collinearity and missingness, higher overfitting risk, and more data needed. For notes, keep per-chunk embeddings or use attention/max pooling, at the cost of higher dimensionality and harder interpretation.

## 3. Metrics: who is flagged, and does prevalence matter?

**Explanation.** **Prevalence** $p$ is the fraction of patients who truly have the outcome. **Sensitivity** = of the true positives, the fraction detected. **Specificity** = of the true negatives, the fraction correctly cleared. **PPV (precision)** = of the flagged patients, the fraction truly positive. **NPV** = of the unflagged, the fraction truly negative. Sensitivity and specificity are properties of the test; PPV and NPV also depend on how common the disease is.

$$\text{PPV} = \frac{\text{sens}\cdot p}{\text{sens}\cdot p + (1-\text{spec})(1-p)}$$

!!! question "Check yourself"
    A balanced test set gives sensitivity = specificity = precision = 0.70. In the real ward prevalence is 10%. Which numbers carry over, and what is PPV now?

??? success "Answer"
    Sensitivity (0.70), specificity (0.70) and AUROC carry over, because they are conditional on the true class or threshold-free. Precision does not: at 10% prevalence, PPV = 0.07 / (0.07 + 0.27) = 0.07/0.34 ≈ **0.21** — about 2 in 10 alarms, not 7.

## 4. Labels are not always biology

**Explanation.** A label records what happened, which includes what clinicians did. **Confounding by indication** (the **treatment paradox**): a treatment is given because the patient looked sick; if the treatment works, the patient is labelled "no shock", and the model learns "treatment → low risk". **Selection bias** is a distortion caused by which patients end up in the data.

!!! question "Check yourself"
    Septic-shock labels come from a study where fluid boluses were given early. Why does the model underestimate risk in patients who resemble the treated ones? Would removing treated patients fix it?

??? success "Answer"
    Treated patients who never developed shock are labelled negative, so the model associates a bolus with low risk and underestimates similar patients later (treatment paradox). Removing them fixes that association but creates selection bias: you drop a clinically important subgroup, change the case mix, and the model no longer applies to the patients most likely to be treated.

## 5. Leakage: using the future

**Explanation.** **Leakage** means the model has access to information it will not have at prediction time (or that already contains the answer). A **temporal split** trains on the past and tests on the future. A **patient-level split** keeps all admissions of one patient in the same side, preventing **patient overlap**.

!!! question "Check yourself"
    A bidirectional LSTM predicts 24-hour mortality from the first 24 hours and works well. The same model is reused for an alert at hour 6. What is wrong?

??? success "Answer"
    A bidirectional model reads the **whole stay**, including hours after the prediction time, so at hour 6 it sees future data — **future leakage** that inflates retrospective performance. Fix by truncating the sequence at each prediction hour and using causal/unidirectional inputs, then validating on hourly snapshots and a prospective silent trial.

## 6. Discrimination is not calibration

**Explanation.** **AUROC (discrimination)** is the probability that a random positive is ranked above a random negative; it is **threshold-free**. **Calibration** compares predicted risk with observed risk across the whole range. The **O/E ratio** = observed events ÷ expected events, where expected = mean predicted risk × number of patients.

$$O/E = \frac{\text{observed deaths}}{\text{mean predicted risk} \times n}$$

!!! question "Check yourself"
    Model A: AUROC 0.91, mean predicted risk 19%. Model B: AUROC 0.88, mean risk 8.5%. True mortality is 8% in 200 patients. Which model is better, and what is A's O/E?

??? success "Answer"
    A **discriminates** better; B is **calibrated** (8.5% vs 8%). In 200 patients, 16 deaths are observed; A predicts 0.19 × 200 = 38, so O/E = 16/38 ≈ **0.42** — A overestimates risk badly. For O/E comparisons use B, or recalibrate A (Platt/isotonic) on held-out data.

## 7. Dataset shift and missing modalities

**Explanation.** **Dataset shift** means the deployed data differ from training: different patients, scanners, protocols, or available modalities. A model trained with notes and X-rays cannot be assumed to work where notes do not exist. **Missingness** can itself carry information: "lactate was measured" often means a clinician was worried.

!!! question "Check yourself"
    Adding X-rays raises AUROC only in the 1,500 patients who had one in the first 24 hours (14% mortality vs 7% overall). Can you claim multimodal benefit for all patients?

??? success "Answer"
    No: that subgroup is **selected by indication** and sicker, so the gain is confounded. At a hospital without notes, the notes path is unavailable, and applying the X-ray path to everyone is a different distribution — expect a performance and calibration drop. Claim benefit only after external validation stratified by available modality, plus calibration and a silent trial.

## 8. Fairness is not fixed by deleting a variable

**Explanation.** A **proxy** is a variable correlated with a protected attribute (age, sex, ethnicity) even when that attribute is removed — diagnoses, labs, procedures all encode age. **Subgroup calibration** means calibration holds within each group; **equalised odds** means sensitivity and false-positive rate are equal across groups.

!!! question "Check yourself"
    False-positive rates rise with age. If you remove age from the features, does the disparity disappear?

??? success "Answer"
    Usually not: the model reconstructs age from **proxies**, so the disparity persists (and performance drops, with less transparency). Use subgroup-aware calibration or equalised-odds post-processing, reweighting or more data for older patients, and audit FPR/TPR by group, calibration curves and net benefit — with clinicians setting the acceptable trade-off.

!!! tip "If you remember one thing"
    AUROC ranks patients. It does not choose a threshold, count false positives, or tell you whether "20%" means 20 out of 100.

# 4 · Models for hospital data

<div class="meta"><span class="hot">Lecture 4</span><span>~15 min</span><span>EHR and metrics</span></div>

<p class="lead">Hospital data are messy records over time: vitals, labs, notes, images. Turning them into one vector per patient is convenient and lossy, and the metrics that look good on a balanced test set can be misleading in a real ward.</p>

## In plain words

- **Patient representation.** Static (one row per patient), longitudinal (a sequence over time), or multimodal (text + numbers + images combined).
- **Aggregation loses time.** The mean of a vital sign cannot tell a patient who is recovering from one who is deteriorating.
- **Prevalence matters.** Sensitivity and specificity are properties of the test; precision (PPV) also depends on how common the disease is.
- **Labels are treatments.** If a patient got a drug because they looked sick, "no shock later" partly reflects the drug, not the patient's baseline risk.
- **Leakage.** Using data from after the prediction moment (future lab values, the whole stay) inflates performance.
- **Calibration.** AUROC says who is ranked higher; calibration says whether "20% risk" really means 20 out of 100.

## Core ideas in one table

| Term | Plain meaning |
| --- | --- |
| AUROC / discrimination | Chance a random positive scores above a random negative. Threshold-free. |
| Calibration | Predicted risk versus observed risk; a calibration curve or O/E ratio. |
| PPV / precision | Of the flagged patients, how many truly have the disease. Depends on prevalence. |
| NPV | Of the unflagged patients, how many are truly negative. |
| O/E ratio | Observed deaths ÷ expected deaths (mean predicted risk × n). |
| Treatment paradox | Treatment lowers risk, so treated patients look "negative" and the model learns the wrong association. |
| Temporal leakage | Using information from the future relative to the prediction time. |
| Dataset shift | The deployed population or data pipeline differs from training. |
| Missingness as signal | "Was the lab measured?" often encodes clinician concern, not physiology. |

Key formulas:

$$\text{PPV} = \frac{\text{sens}\cdot p}{\text{sens}\cdot p + (1-\text{spec})(1-p)} \qquad \text{NPV} = \frac{\text{spec}(1-p)}{\text{spec}(1-p)+(1-\text{sens})p}$$

$$O/E = \frac{\text{observed deaths}}{\text{mean predicted risk} \times n}$$

## Exam questions

### Q1 — What is lost by averaging vitals and note embeddings?

**Answer.** Averaging a vital-sign sequence makes a recovering patient and a deteriorating one identical if they share the same mean — the **trend** disappears. Averaging ten note-chunk embeddings dilutes a single critical finding ("new pleural effusion") to one tenth of the vector. Fixes: keep trend features (slope, min, max, last value, time since abnormal) and per-chunk or attention/max pooling for text. Costs: more features and collinearity, higher overfitting risk, higher dimensionality, more data needed, and attention weights that are harder to interpret.

### Q2 — Balanced test set, sensitivity = specificity = precision = 0.70, real prevalence 10%?

**Answer.** Sensitivity, specificity and AUROC **transfer**, because they are conditional on the true class or threshold-free. Precision and accuracy **do not**: they depend on prevalence. At 10% prevalence, $\text{PPV} = \frac{0.7 \times 0.1}{0.7 \times 0.1 + 0.3 \times 0.9} = \frac{0.07}{0.34} \approx 0.21$ — about 2 in 10 alarms, not 7. Evaluate on a test set with the real prevalence and ask for calibration and net benefit.

### Q3 — Treated septic-shock patients labelled negative?

**Answer.** Treatment was given because of early signs, and treated patients who never develop shock are recorded negative, so the model learns "bolus → low risk" (**confounding by indication / treatment paradox**) and underestimates risk in similar patients. Removing treated patients fixes that bias but creates **selection bias**: you drop a clinically important subgroup, change the case mix, and the model no longer applies to the patients most likely to be treated.

### Q4 — Bidirectional LSTM at hour 24 but not for hourly alerts?

**Answer.** At hour 24 the prediction uses the completed 24-hour window, so reading backwards uses no future information — acceptable. For an alert at hour $t$, a bidirectional model reads the **whole stay**, including hours after $t$: retrospective performance is inflated by **future leakage**, not merely dataset shift. Train and evaluate on causal snapshots truncated at each hour (or unidirectional models), excluding post-event data, then run a prospective silent trial.

### Q5 — Model A AUROC 0.91 / mean risk 19%; B 0.88 / 8.5%; true mortality 8%?

**Answer.** **A discriminates better** (0.91 vs 0.88), but **B is calibrated** (8.5% predicted vs 8% observed). For 200 patients: 16 deaths observed; A predicts $0.19 \times 200 = 38$, so $O/E = 16/38 \approx 0.42$ — A massively overestimates risk. Use B (or recalibrate A) for O/E comparison, since O/E requires calibration. The table alone cannot separate quality of care from case-mix differences or statistical uncertainty.

### Q6 — X-ray subgroup AUROC 0.90 on 1,500 selected patients?

**Answer.** Not justified for everyone. The 0.90 comes from patients who had a chest X-ray in the first 24 hours, and they have **14% mortality versus 7%** overall — a sicker, selected group, so the gain is confounded by indication. At a hospital without free-text notes the notes path is unavailable, and applying the X-ray path to all patients is a different distribution: expect a performance and calibration drop. Before use: external validation stratified by available modality, calibration, and a silent trial.

### Q7 — False-positive rates rise with age: remove age?

**Answer.** Removing age is unlikely to fix it, because the model reconstructs age from **proxies** (diagnoses, labs, procedures, notes), so the disparity persists while performance drops. Use subgroup-aware calibration or equalised-odds post-processing, reweighting or more training data for older patients, and audit **FPR/TPR by group**, calibration curves and net benefit, with clinicians deciding the acceptable trade-off.

!!! tip "If you remember one thing"
    AUROC tells you **who ranks higher**. It does not tell you the threshold, the false-positive count, or whether "20%" means 20%. Those are three separate questions.

# 4 · Models for hospital data

## Subtitles

1. Static, longitudinal, and multimodal patient representations
2. Information loss in EHR representations
3. Prevalence, discrimination, and precision
4. Labels, treatment, and selection bias
5. Temporal leakage and live-use evaluation
6. Calibration and expected outcomes
7. Dataset shift, missingness, and fairness

## Milestones

- [ ] Find what an aggregation or representation throws away.
- [ ] Move sensitivity, specificity, and precision across prevalence.
- [ ] Diagnose treatment, label, missingness, and leakage bias.
- [ ] Separate AUROC, calibration, and observed/expected ratios.
- [ ] Design patient-level, temporal, external, and subgroup tests.

## Possible exam questions

### OPEN · Q1 — What is lost when vital-sign sequences become stay-level means and note chunks become one averaged embedding? Propose fixes and their costs. {#l4q1 data-source="lecture-04-bz-questions.md — Problem 1"}

<div class="response" markdown></div>

### OPEN · Q2 — A balanced test gives sensitivity = specificity = precision = 0.70. At 10% prevalence, which metrics transfer and what is the approximate precision? {#l4q2 data-source="lecture-04-bz-questions.md — Problem 2"}

<div class="response" markdown></div>

### OPEN · Q3 — How do treated septic-shock negatives bias risk estimates? What happens if treated patients are removed from training or evaluation? {#l4q3 data-source="lecture-04-bz-questions.md — Problem 3"}

<div class="response" markdown></div>

### OPEN · Q4 — Why can a bidirectional LSTM work at hour 24 but fail for hourly alerts? How should retrospective training and evaluation mimic live use? {#l4q4 data-source="lecture-04-bz-questions.md — Problem 4"}

<div class="response" markdown></div>

### OPEN · Q5 — Model A: AUROC 0.91, mean risk 19%; B: 0.88, 8.5%; true mortality 8%. Which is calibrated, and what O/E ratio follows for 200 patients? {#l4q5 data-source="lecture-04-bz-questions.md — Problem 5"}

<div class="response" markdown></div>

### OPEN · Q6 — Does higher AUROC in an X-ray subgroup prove multimodal benefit for everyone? What changes at a hospital with different modality availability? {#l4q6 data-source="lecture-04-bz-questions.md — Problem 6"}

<div class="response" markdown></div>

### OPEN · Q7 — False-positive rates rise with age. Will removing age fix the disparity? Propose an alternative and its audit measurements. {#l4q7 data-source="lecture-04-bz-questions.md — Problem 7"}

<div class="response" markdown></div>

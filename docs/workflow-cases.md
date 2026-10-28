# Clinical workflow cases · worked answers

<div class="meta"><span class="hot">Lecture 5</span><span>8 deployment cases</span><span>The 50% part</span></div>

<p class="lead">The eight guided self-study cases from "Integration of AI in the clinical workflow". Each answer follows the required structure: the decision, the number that drove it, the risk you cannot mitigate, and who owns that risk.</p>

!!! tip "Exam move"
    For any deployment scenario, answer in this order: **intended use → unit of output → validation → operating point → monitoring/exit plan → economics**. Most lost points come from jumping to AUROC before asking whether the use is even inside the intended use.

## Case 1 — Melanoma model meets dermatopathology

Published research model, AUROC 0.96 on 1,200 curated balanced slides from one scanner; web app; 14,000 skin specimens/year; melanocytic lesions 18%, re-excisions 7%.

**Scope.** Melanocytic lesions: $0.18 \times 14{,}000 = 2{,}520$ specimens/year, and at ~3 slides each ≈ **7,560 slides/year**. The other 82% (BCC, SCC/AK, seborrhoeic keratosis, inflammatory, re-excisions, other) are out of scope: the model has no validated output for them. Routing is decided at **accessioning/triage by the lab**, not by the model.

**Unit of output.** One probability per slide is not a diagnosis. The report needs: lesion classification with subtype, Bresenham thickness, ulceration, mitotic rate, margin status (peripheral/deep), lymphovascular invasion, regression, and a **case-level** integrated diagnosis across slides. The model gives none of these, and no uncertainty or evidence per feature.

**Allowed?** No, as it stands. Governance problems: (1) it is a research prototype, not CE-IVD/MDR-certified, with no intended-use statement; (2) sending patient slides to an external university web app needs a data-processing agreement, GDPR basis, and security review; (3) no local validation on your scanner, population and case mix; (4) no accreditation/quality system, monitoring or liability agreement. Local validation alone would not fix the regulatory status.

## Case 2 — One prostate model, three proposals

CE-IVD, intended use: adjunct, pathologist reviews all slides. 12 cores on 6 slides, 3-week backlog.

- **A — worklist prioritisation:** inside intended use. Every case is still read; this only changes order. Validation duty: show that prioritisation does not delay the rest beyond an acceptable bound.
- **B — in-viewer overlay:** inside intended use (adjunct, pathologist reviews everything). Validation: overlay does not cause misses/automation bias.
- **C — "AI benign" fast track:** **outside intended use**. It converts an adjunct into a rule-out/sign-out tool, which is a new clinical claim: new validation, potentially new regulatory status, and new liability. It also requires a case-level operating point and a documented policy for who signs out.

**Aggregation.** For A, use the **maximum** slide score per case — you want suspicious cases first, so any positive core should raise the case. For C, the case is "AI benign" only if **every** slide (and every core) has $p < \tau$, i.e. the case score is the **max**; using the mean would dilute one positive core and destroy case-level sensitivity.

**Tomorrow's choice.** Take **A**, with one condition: a prospective audit of time-to-read for high-score cases and a monthly review of misses in the prioritised list; no case may be delayed beyond the agreed window.

## Case 3 — Choose the operating point

10,000 node slides/year (250 working days = 40/day), 5% metastasis → 500 positive, 9,500 negative.

| | Sens | Spec | TP | FP | FN | TN | PPV | NPV | Flags/day |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | 0.99 | 0.70 | 495 | 2,850 | 5 | 6,650 | 14.8% | 99.92% | 13.4 |
| B | 0.95 | 0.90 | 475 | 950 | 25 | 8,550 | 33.3% | 99.71% | 5.7 |
| C | 0.85 | 0.98 | 425 | 190 | 75 | 9,310 | 69.1% | 99.20% | 2.5 |

Worked (A): TP = 0.99×500 = 495; FN = 5; FP = 0.30×9,500 = 2,850; PPV = 495/(495+2,850); NPV = 6,650/6,655.

**Assistant (i):** choose **A**. The pathologist reads every slide anyway, so a false positive costs a few seconds of extra review, while a false negative is a missed metastasis. Sensitivity dominates.

**Rule-out (ii):** the model-negative slides are seen by **no human**, so the FN count is the harm: A = 5, B = 25, C = 75 missed metastases/year. Workload removed: A 6,650 (66.5%), B 8,550 (85.5%), C 9,310 (93.1%). Choose **A or B** depending on the explicitly accepted miss rate; C is only defensible if local validation shows a clinically acceptable NPV and the lab accepts ~75 unseen metastases/year.

**Why AUROC is useless here.** AUROC integrates over all thresholds and is prevalence-independent; it does not tell you the FP/FN trade-off at a specific operating point, which is the entire decision. The threshold is a clinical risk decision: the **clinical lead/pathologist with lab management and quality/regulatory sign-off**, not the vendor or IT.

## Case 4 — The CE mark is not the end of the story

PD-L1 TPS, cut-offs 1% and 50%; vendor: 3 centres, 600 cases, ICC 0.90. Your lab: different antibody (SP263 vs 22C3), stainer, scanner, and cytology cell blocks.

**Inside intended use?** Antibody, stainer, scanner and specimen type all differ. Some differences may be covered by the vendor's validation; cytology cell blocks likely are not. Anything outside the intended use is **your** validation responsibility, and off-label use is the lab's liability.

**Why ICC 0.90 is the wrong metric.** ICC measures agreement on the **continuous score** across all values; it can be high while agreement at the clinically decisive cut-offs (1%, 50%) is poor. What matters is **categorical agreement** at the thresholds: accuracy/agreement, kappa, sensitivity/specificity for "≥1%" and "≥50%", with confidence intervals, plus a Bland–Altman plot focused near the cut-offs.

**Site validation.** ≥60 **consecutive routine cases per application** (CAP/ASCP/API 2022), **enriched near the cut-offs**, including cytology cell blocks. Reference standard: consensus of ≥3 pathologists (adjudication), not a single sign-out. Metrics: categorical agreement at 1% and 50% with CIs, plus directional bias. Pre-specify acceptance (e.g. lower CI bound of agreement ≥90%, no systematic shift).

**Ground truth.** There is no perfect truth near the cut-offs. Build a **consensus panel with adjudication**, blinded to AI, and where available use clinical outcome/response as an anchor. Report disagreement explicitly rather than pretending the sign-out is truth.

## Case 5 — HER2 drift

Validation combined 0 and 1+ as "negative". M4: post-neoadjuvant resections 5% → 20%. M6: HER2-low therapy makes 0 vs 1+ decisive. No error was ever raised.

1. **Patients or model?** Both are plausible: post-neoadjuvant residual disease genuinely has different HER2 distributions (more 0/1+), and the model may drift with a new case mix/staining. To separate: pull case mix by indication and specimen type, scanner/stainer changes, the AI score distribution **within the same subgroup**, pathologist–AI agreement over time, override reasons, and re-review a sample of 0/1+ cases. If the shift disappears within matched subgroups, it is patients; if not, suspect the model.
2. **What is the old validation worth?** Near zero for the new decision: it never measured 0 vs 1+ discrimination, only negative vs positive. No dashboard changes because the **model output and thresholds did not change** — the clinical meaning of the boundary changed, which no monitoring metric watches.
3. **New validation:** enrich 0/1+ cases, consensus reference standard, metric = agreement/accuracy between 0 and 1+ at the therapy decision, pre-specified acceptance; include post-neoadjuvant cases.
4. **Who is harmed:** HER2-low patients misclassified 1+→0 are denied therapy; 0→1+ may be given an inappropriate option. Rough size: at 1,500 breast cancers/year, the 0 share rose ~10 points (25→35%) and 1+ fell ~8 points; if even half of that shift is misclassification, **~60–100 patients/year** are affected.

## Case 6 — The model that cannot be proven wrong

Zero discrepancies among "not needed" cases; vendor claims NPV 100%.

1. **Why not evidence.** Only cases where IHC was **not** ordered were audited, and the final report is produced by the same pathologist who saw the AI suggestion (anchoring). No case has a reference standard that could reveal a missed diagnosis, so true false negatives were never measured. "Zero discrepancies" means "nobody looked for a disagreement".
2. **Design.** Randomise cases **near the decision boundary** to IHC vs no IHC (MASAI-style), or use held-out periods; sample a random fraction of "not needed" cases for IHC and compare AI-suggested vs IHC-supported diagnosis; log the AI output and the clinical action **separately**; pre-register a non-inferiority margin and a safety endpoint (missed clinically significant cancers).
3. **Ethics.** Doing IHC on tissue already taken is minimal risk and low cost, and there is genuine equipoise near the boundary. Answer the committee with: minimal incremental risk, clinical equipoise, opt-out/waiver, independent oversight, pre-specified stopping rules, and the fact that the current "100% NPV" claim is itself an unvalidated clinical claim.

## Case 7 — Faster, cheaper, nobody disagrees

Chest X-ray assistant; −22% reporting time; agreement 91% → 98.6%; senior stopped using it; juniors unsure during an outage.

1. **What does 98.6% mean?** Not necessarily quality. Rising agreement is consistent with **automation bias** (readers defer to the AI), not calibrated trust. Data that distinguish: blinded independent reads, audits on a sample including AI-error cases, accuracy before vs after deployment, override outcomes in both directions, and whether readers detect deliberately inserted AI errors.
2. **Reverse-centaur symptoms:** raising the daily target 20% (speed over judgement), requiring written justification to disagree (punishes override), reporting override rate with the aim to reduce it (treats disagreement as error), making it mandatory for everyone (removes the centaur's choice). Rewrite: AI as second reader/prioritisation, no target increase, disagreement logged without justification, override rate reviewed for **both** directions, opt-out allowed.
3. **Interface.** Show the output **after** the initial read or on demand, show the image with regions rather than a single number, make dismissal one click and logged. Replace "confidence 94%" with a calibrated risk statement ("no nodule detected; sensitivity for nodules ≥8 mm is X%") or a risk band validated on local data.
4. **Legal.** The radiologist who **overrode with documented justification** is better protected: the record shows independent judgement. Following the AI is not a defence. Designing policy that punishes override therefore increases automation bias.

## Case 8 — Business case

1,800 cases/year; licence €25/case; IHC in 30% of cases at €60; 40% relative IHC reduction; 12 min/case at €150/h; 20% time saving; validation 0.1 FTE; integration €40,000.

- Licence: $1{,}800 \times 25 = €45{,}000$/year.
- IHC saved: $0.30 \times 1{,}800 \times 0.40 = 216$ cases $\times 60 = €12{,}960$/year.
- Time saved: $1{,}800 \times 12/60 = 360$ h; 20% = 72 h $\times 150 = €10{,}800$/year.
- Validation: 0.1 FTE — at ~€200k loaded cost ≈ €20,000/year (state the assumption).
- Year 1: $12{,}960 + 10{,}800 - 45{,}000 - 20{,}000 - 40{,}000 = \mathbf{-€81{,}240}$. Steady state ≈ **−€41,240/year**.

So it does **not** pay for itself on IHC and reading time alone. It only works if freed capacity is converted into something: filling the two vacancies, avoiding locum/temporary staff, or additional throughput.

**Fractional and distributed benefits:** minutes saved per case, turnaround improvement, consistency. The finance director's question "which cost disappears?" has only two honest answers: IHC consumables (€12,960) and avoided locum/overtime or avoided hiring. Everything else is capacity, not cash.

**Who pays / captures:** the lab pays the licence, integration and validation; the insurer pays the bundled tariff; urology and patients capture faster turnaround. The bundled tariff means efficiency gains do **not** become revenue — the lab bears the cost and the benefit is captured elsewhere. That is the core argument for a separate funding or shared-savings arrangement.

**Non-financial case:** two unfilled pathologist posts, three-week backlog, urology complaints, recruitment and sub-specialisation. Evidence needed: locally validated non-inferiority, measured time saving, backlog/turnaround reduction, and staff acceptance.

## Closing questions

- AUROC changed the decision in almost none of the cases. The cases were decided by **intended use, unit of output, operating point, drift, human factors and economics**.
- The recurring risk owner is the **clinical lead / responsible pathologist or radiologist**, usually not in the room when the model is bought.
- The framework question that would have prevented most problems: **Q8 (how will it be used in practice?)** and **Q9 (what could go wrong?)**, asked before purchase.

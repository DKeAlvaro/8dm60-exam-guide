# 5 · Clinical workflow integration

<div class="meta"><span class="hot">Lecture 5</span><span>~25 min</span><span>The 50% part</span></div>

<p class="lead">A model with good numbers can still be useless or dangerous in a hospital. This lecture is about the gap between a paper and a deployed product: who uses it, on which patients, at which threshold, and who is responsible when it is wrong.</p>

## In plain words

- **Intended use** is the legal and clinical claim: which patients, which decision, and whether the human still decides.
- **Unit of output.** One score per slide is not a diagnosis. A report needs features, a case-level conclusion, and uncertainty.
- **Operating point.** Sensitivity and specificity trade off; the threshold is a clinical decision, not a technical one.
- **Validation.** A CE mark covers the vendor's stated use. Different scanner, antibody, population or case mix is **your** validation job.
- **Monitoring.** Performance drifts when patients, protocols or treatments change. You need a plan to detect it, and an exit plan.
- **Human factors.** If the model is always right, people stop checking it — automation bias. Agreement going up is not proof of quality.
- **Economics.** Saved minutes are capacity, not cash. Ask which cost actually disappears.

## The deployment checklist

Answer any case in this order — most lost points come from starting with AUROC:

1. **Intended use** — is this use inside it?
2. **Unit of output** — slide, case, or patient?
3. **Local validation** — does the evidence match this site?
4. **Operating point** — who bears the false positives and the false negatives?
5. **Monitoring and exit** — how do you notice failure, who signs off?
6. **Economics** — who pays, who captures the benefit?

## Exam questions

### Q1 — Melanoma model for 14,000 mixed skin specimens

**Answer.** In scope: **melanocytic lesions only**, $0.18 \times 14{,}000 = 2{,}520$ specimens/year, about **7,560 slides/year**; the other 82% have no validated output, and routing is decided at accessioning by the lab, not the model. The output is missing almost everything a report needs: subtype, Bresenham thickness, ulceration, mitotic rate, margins, lymphovascular invasion, and a case-level diagnosis. Routine use is blocked because it is a **research prototype** (no CE-IVD, no intended-use statement), sending slides to an external web app needs a data-processing agreement and GDPR basis, there is no local validation on your scanner and population, and there is no monitoring, quality system or liability agreement.

### Q2 — Triage, overlay, or benign fast-track?

**Answer.** Worklist prioritisation and in-viewer overlay are **inside** an adjunct intended use: every case is still read, so only ordering or display changes; validation must show no delay for the rest and no misses from automation bias. "AI benign" fast-track is **outside** intended use: it converts an adjunct into a rule-out tool, a new clinical claim needing new validation, possibly new regulatory status, and a named person who signs out. Aggregation: use the **maximum** slide score per case for triage, and for fast-track require **every** slide/core below the threshold — a mean would dilute one positive core.

### Q3 — 10,000 slides, 5% prevalence: pick a threshold

**Answer.** With 500 positive and 9,500 negative slides:

| | Sens | Spec | TP | FP | FN | PPV | NPV | Flags/day |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A | 0.99 | 0.70 | 495 | 2,850 | 5 | 14.8% | 99.92% | 13.4 |
| B | 0.95 | 0.90 | 475 | 950 | 25 | 33.3% | 99.71% | 5.7 |
| C | 0.85 | 0.98 | 425 | 190 | 75 | 69.1% | 99.20% | 2.5 |

For an **assistant** (every slide is read anyway) choose **A**: a false positive costs seconds, a false negative is a missed metastasis. For a **rule-out** (negatives are not read) the harm is the missed cases: A = 5, B = 25, C = 75 per year; choose A or B according to the miss rate the lab accepts. The threshold is a clinical risk decision owned by the clinical lead with lab management and quality sign-off — not the vendor. AUROC is useless here because it integrates over all thresholds.

### Q4 — CE-IVD PD-L1 model, different antibody/stainer/scanner/specimen

**Answer.** Antibody, stainer, scanner and specimen type differ from the vendor's validation; some may be covered, cytology cell blocks likely are not — anything outside intended use is **your** validation responsibility and liability. ICC 0.90 is the wrong metric: it measures agreement on the continuous score and can hide poor agreement exactly at the 1% and 50% cut-offs. Validate with **≥60 consecutive routine cases per application**, enriched near the cut-offs, with a consensus of ≥3 pathologists blinded to AI as reference; report categorical agreement, kappa, sensitivity/specificity at each cut-off with confidence intervals, and a Bland–Altman plot near the thresholds.

### Q5 — Case mix drifts and a new HER2-low therapy

**Answer.** Both explanations are plausible: post-neoadjuvant residual disease genuinely has more 0/1+ cases, and the model may drift with a new case mix or staining. Separate them by comparing the score distribution **within matched subgroups** and checking scanner/stainer changes, agreement over time and override reasons. The old validation is worth **nothing** for the new decision: it only measured negative versus positive, never 0 versus 1+, and no dashboard flags it because the model output and thresholds did not change — only their clinical meaning did. New validation must enrich 0/1+ cases with a consensus reference standard and pre-specified agreement at the therapy decision.

### Q6 — Zero disagreement among "IHC not needed" cases: 100% NPV?

**Answer.** No. Only cases where IHC was **not** ordered were audited, and the same pathologist who saw the AI suggestion wrote the final report (anchoring); no case had a reference standard able to reveal a missed diagnosis, so false negatives were never measured. Design: randomise boundary cases to IHC versus no IHC (MASAI-style), or send a random sample of "not needed" cases to IHC, log AI output and clinical action separately, and pre-register a non-inferiority margin and a safety endpoint. Ethically this is minimal risk (tissue already taken), there is equipoise near the boundary, and the current "100% NPV" claim is itself unvalidated.

### Q7 — Agreement 91% → 98.6%: benefit or bias?

**Answer.** Not necessarily benefit — rising agreement is consistent with **automation bias**, readers deferring to the AI. To tell them apart: blinded independent reads, audits including AI-error cases, accuracy before versus after deployment, override outcomes in both directions, and tests with deliberately inserted errors. Reverse-centaur symptoms are raising the daily target, requiring written justification to disagree, and treating a high override rate as a problem. Redesign: AI as second reader, no speed target, one-click logged dismissal, output shown after the first read, calibrated risk statements instead of "confidence 94%". Legally, the radiologist who overrode **with documented justification** is better protected — following the AI is not a defence.

### Q8 — Does pathology AI pay for itself?

**Answer.** Per year: licence $1{,}800 \times 25 = €45{,}000$; IHC saved $0.30 \times 1{,}800 \times 0.40 = 216$ cases $\times 60 = €12{,}960$; time saved $1{,}800 \times 12/60 = 360$ h, 20% = 72 h $\times 150 = €10{,}800$; validation 0.1 FTE ≈ €20,000; integration €40,000 one-off. Year 1: $12{,}960 + 10{,}800 - 45{,}000 - 20{,}000 - 40{,}000 = \mathbf{-€81{,}240}$; steady state ≈ **−€41{,}240/year**. It does **not** pay for itself unless freed capacity becomes cash — filling vacancies or avoiding locums. The lab pays, the insurer pays a bundled tariff, and urology/patients capture the faster turnaround; the non-financial case is the backlog, complaints and recruitment.

!!! tip "If you remember one thing"
    For any deployment question: **intended use → unit of output → validation → operating point → monitoring → economics**. Then name who owns the residual risk.

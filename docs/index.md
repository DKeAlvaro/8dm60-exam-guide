# 8DM60 · Exam guide

<div class="meta"><span class="hot">Written exam · 28 October</span><span>13:30–16:30</span><span>Closed book</span></div>

<p class="lead">One short page per topic. Every idea is explained in plain words and ends with a question — answer it before you open the answer.</p>

## If you only have two hours

| Time | Do this |
| --- | --- |
| 0–20 min | [Cram sheet](cram.md) — the whole course on one page. |
| 20–40 min | [Multiple choice · answer key](mc-answer-key.md) — 20% of the grade and the traps are predictable. |
| 40–90 min | [Past exercises](past-exercises.md) — cover the answer, say yours out loud, then check. |
| 90–110 min | The six topic pages below, skimming the answers. |
| 110–120 min | [Clinical workflow cases](workflow-cases.md) — the numbers. |

## Pass conditions

| Component | Weight |
| --- | ---: |
| Multiple-choice questions | 20% |
| Group-specific project questions | 15% |
| General open/problem-based questions | 50% |
| Project poster + code | 15% |

**Written exam ≥ 5.5 · final grade ≥ 6.** Lecture 7 is not exam material.

## The six topics

Each page: explanation → one question → hidden answer.

1. [Language models](language.md) — tokens, attention, training, prompting, RAG, LoRA.
2. [Vision models](vision.md) — DINO, CLIP, VLMs, validation.
3. [Omics models](omics.md) — scVI, scGPT, CPA, GEARS, perturbation metrics.
4. [Models for hospital data](hospital.md) — representations, bias, leakage, calibration.
5. [Clinical workflow integration](workflow.md) — deployment, thresholds, governance, money.
6. [Agentic AI](agents.md) — tools, ReAct, workflows versus agents.

## Extras

- [Key figures](key-figures.md) — the ten diagrams and the one line to say about each.
- [Your project · 15%](project.md) — how to answer the poster questions.

## The one idea behind the whole course

A model produces a **score**. A clinical decision needs an **operating point**, **calibration**, **validation on local data**, and a **named owner** for what goes wrong. Most exam questions are asking which of those is missing.

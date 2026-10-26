# 2 · Vision models

## Subtitles

1. Task-specific models to foundation models
2. DINO, DINOv2, and UNI
3. Linear probes versus fine-tuning
4. CLIP and BiomedCLIP
5. Retrieval versus report generation
6. LLaVA and LLaVA-Med
7. Biomedical validation

## Milestones

- [ ] Compare image-only, contrastive, and generative objectives.
- [ ] Trace DINO’s student–teacher and EMA update.
- [ ] Interpret linear-probe and fine-tuning results separately.
- [ ] Diagnose CLIP prompt-set and duplicate-pair problems.
- [ ] Choose and evaluate retrieval, classification, or generation.

## Possible exam questions

### OPEN · Q1 — For DINO’s teacher EMA, compare $m=0$, $0.9$, $0.999$, and $1$. Why use a slowly changing teacher? {#l2q1 data-source="lecture-02-bz-problems.md — Problem 1"}

<div class="response" markdown></div>

### OPEN · Q2 — What could happen when DINOv2’s feature-spread regularization is removed, and what would you compare to test feature usefulness? {#l2q2 data-source="lecture-02-bz-problems.md — Problem 2"}

<div class="response" markdown></div>

### OPEN · Q3 — Encoder A scores 78% frozen / 86% fine-tuned; B scores 84% / 85%. Which wins in each setting, and what remains unknown? {#l2q3 data-source="lecture-02-bz-problems.md — Problem 3"}

<div class="response" markdown></div>

### OPEN · Q4 — Can adding a third CLIP text prompt change “abnormal” from 0.90 despite unchanged similarity? Is 0.90 a disease probability? {#l2q4 data-source="lecture-02-bz-problems.md — Problem 4"}

<div class="response" markdown></div>

### OPEN · Q5 — Two images in a CLIP batch have identical paired text. Why can’t each assign all probability to its own copy, and how could you fix it? {#l2q5 data-source="lecture-02-bz-problems.md — Problem 5"}

<div class="response" markdown></div>

### OPEN · Q6 — Can a frozen CLIP image vector be fed directly into a frozen text-only LLM just because their dimensions match? What training is missing? {#l2q6 data-source="lecture-02-bz-problems.md — Problem 6"}

<div class="response" markdown></div>

### OPEN · Q7 — For binary image quality control, choose between a frozen encoder + small head and an instruction-tuned VLM. What else would you measure? {#l2q7 data-source="lecture-02-bz-problems.md — Problem 7"}

<div class="response" markdown></div>

### RECALL · Q8 — Why use different augmented views of an image in visual self-supervision? {#l2q8 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

### RECALL · Q9 — What is the purpose of a contrastive image–text objective? {#l2q9 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

### RECALL · Q10 — What distinguishes image-to-report retrieval from report generation? {#l2q10 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

### RECALL · Q11 — For fixed image features $z=f_\theta(x)$, which parameters does a linear probe fit? {#l2q11 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

### RECALL · Q12 — What makes validation external rather than an internal held-out test? {#l2q12 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

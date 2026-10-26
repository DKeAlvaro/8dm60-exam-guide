# 1 · Language models

## Subtitles

1. Tokens, embeddings, and positions
2. Self-attention and causal masks
3. Next-token training and generation
4. Prompting and instruction tuning
5. RAG versus fine-tuning
6. LoRA, quantization, and QLoRA
7. Biomedical evaluation

## Milestones

- [ ] Trace a token from embedding to next-token prediction.
- [ ] Diagnose positional and future-information leakage.
- [ ] Choose prompting, RAG, LoRA, or QLoRA for a use case.
- [ ] Check LoRA shapes and parameter efficiency.
- [ ] Design a factual evaluation beyond average token loss.

## Possible exam questions

### OPEN · Q1 — How can model A have lower average next-token loss but more factual errors than B? What does the loss establish, can greedy decoding fix it, and how would clinicians compare the letters? {#l1q1 data-source="lecture-01-bz-problems.md — Problem 1"}

<div class="response" markdown></div>

### OPEN · Q2 — Can a Transformer locate “left/right opacity” if position vectors are added before the Transformer? What if they are added only afterwards? {#l1q2 data-source="lecture-01-bz-problems.md — Problem 2"}

<div class="response" markdown></div>

### OPEN · Q3 — If only the second attention layer has a causal mask, can the representation at “is” already contain information from “absent”? {#l1q3 data-source="lecture-01-bz-problems.md — Problem 3"}

<div class="response" markdown></div>

### OPEN · Q4 — How should a system use frequently changing guidelines that exceed the context window and require source/version citations? Why not only fine-tune, and how could it still fail? {#l1q4 data-source="lecture-01-bz-problems.md — Problem 4"}

<div class="response" markdown></div>

### OPEN · Q5 — Should three departments pool LoRA adapters when aggregate correctness rises but two departments fall? How can separate adapters share one frozen base model? {#l1q5 data-source="lecture-01-bz-problems.md — Problem 5"}

<div class="response" markdown></div>

### RECALL · Q6 — In autoregressive pretraining, where do the prediction targets come from? {#l1q6 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

### RECALL · Q7 — In $h_i^{(0)} = e(x_i) + p_i$, what information does $p_i$ supply? {#l1q7 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

### RECALL · Q8 — What distinguishes self-attention from cross-attention? {#l1q8 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

### RECALL · Q9 — What distinguishes zero-shot from few-shot prompting? {#l1q9 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

### RECALL · Q10 — For $W \in \mathbb{R}^{d \times k}$ and $\Delta W = BA$ of rank at most $r$, which shapes must $A$ and $B$ have? {#l1q10 data-source="8dm60_multiple_choice_questions_lectures_1_2.md"}

<div class="response" markdown></div>

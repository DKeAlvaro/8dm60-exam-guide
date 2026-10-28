# 1 · Language models

<div class="meta"><span class="hot">Lecture 1</span><span>~15 min</span><span>Foundations</span></div>

<p class="lead">A language model is a next-word predictor trained on huge amounts of text. Everything else — chatting, summarising, answering — is that one trick repeated.</p>

## In plain words

- **Tokens.** Text is cut into pieces (words or word parts). Each piece gets an ID, and each ID becomes a vector (an **embedding**).
- **Position.** The same word means something different at the start or end of a sentence, so a **position vector** is added to each token embedding.
- **Attention.** Each token looks at the other tokens and decides which ones matter. **Self-attention** means queries, keys and values all come from the same sentence.
- **Causal mask.** When generating, a token may only look **backwards**. Without the mask it would see the answer it is supposed to predict.
- **Training.** Predict the next token, compare with the real next token, adjust the weights. The text is its own label, so no human annotation is needed.
- **Adaptation.** Prompting (no weight change), RAG (give it documents), fine-tuning or LoRA (change small parts of the weights).

## Core ideas in one table

| Term | Plain meaning |
| --- | --- |
| Token | A word piece; the unit the model reads and writes. |
| Embedding $e(x_i)$ | The learned vector for a token. |
| Position $p_i$ | A vector saying *where* in the sequence the token sits. |
| Self-attention | Q, K, V from the **same** sequence. |
| Cross-attention | Q from one sequence (e.g. decoder), K/V from another (e.g. encoder). |
| Causal mask | Blocks attention to future positions. |
| Teacher forcing | Training with the real previous tokens as input. |
| Exposure bias | At generation time the model sees its own (possibly wrong) outputs instead. |
| Zero-shot | No examples in the prompt. |
| Few-shot | A few examples in the prompt; weights stay frozen. |
| LoRA | Freeze $W$ and learn a small update $\Delta W = BA$ of rank $r$. |
| RAG | Retrieve documents at query time and put them in the prompt. |

## Exam questions

### Q1 — Lower average loss but more factual errors?

**Answer.** Loss is an average over **all** tokens, and most tokens are common boilerplate; rare, critical words (like "pending" versus "normal") barely move the average. Loss is also measured with **teacher forcing** while generation feeds the model its own output, so errors compound. Lower loss only means the model assigns slightly higher likelihood to observed text on average — it says nothing about rare facts. Greedy decoding does not fix it (it can even pick the more common but wrong phrase); you need a blinded clinician evaluation on a sample **stratified** to include abnormal and pending results, scoring clinically significant errors.

### Q2 — Position vectors before or after the Transformer?

**Answer.** **Before works.** Positions enter with the tokens, so attention can compare "opacity" together with "left" or "right", and the two reports produce different representations. **After fails**, because self-attention without positions is permutation-invariant: it sees the same set of tokens in both reports, and adding the same position pattern afterwards gives the same averaged vector. Order must be encoded **before** any operation that mixes tokens.

### Q3 — Causal mask only in the second layer?

**Answer.** No — the claim is wrong. Layer 1 has full attention, so the representation of "is" already contains information from "absent" before layer 2 applies its mask. The model can then predict "absent" from a representation that has seen it: **target leakage**. The mask must be causal at every layer.

### Q4 — Guidelines that change several times a year?

**Answer.** Use **RAG**: index the current guidelines with document ID, section and version; retrieve the relevant sections per patient; require the answer to cite the document and version, or abstain. Fine-tuning alone fails because the weights freeze a snapshot, cannot cite a version, and underrepresent rare patient groups. It can still fail if retrieval returns an outdated or wrong section, if sections conflict, or if the patient data used for retrieval is incomplete.

### Q5 — Pooled LoRA adapters or one per department?

**Answer.** Do not adopt the pooled adapter on the aggregate number: department A has 800 of the 1000 letters, so the average is dominated by A and hides an 8–10 point regression in B and C. Report results stratified by department with confidence intervals and require no subgroup degradation. Technically one frozen base model can serve all departments: store one copy of the base weights plus three small adapters ($\Delta W = BA$, rank $r$) and route each request to its department's adapter.

### Q6 — Where do autoregressive training targets come from?

**Answer.** Each observed token is the target for the position before it: the model predicts token $i$ from tokens $1 \ldots i-1$. The text labels itself, so no annotator is needed.

### Q7 — What does $p_i$ in $h_i^{(0)} = e(x_i) + p_i$ supply?

**Answer.** The **position** of the token in the sequence, so the model can tell the same word at different places apart.

### Q8 — Self-attention versus cross-attention?

**Answer.** In self-attention, queries, keys and values all come from the **same** sequence. In cross-attention, queries come from one sequence and keys/values from another.

### Q9 — Zero-shot versus few-shot?

**Answer.** Zero-shot gives no task demonstrations; few-shot gives a few examples in the prompt. In both, the weights stay frozen — zero-shot still uses everything learned in pretraining.

### Q10 — LoRA matrix shapes?

**Answer.** For $W \in \mathbb{R}^{d \times k}$ and $\Delta W = BA$ of rank at most $r$: $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times k}$, so the inner dimension $r$ matches and $BA$ is $d \times k$.

!!! tip "If you remember one thing"
    Loss measures how well the model predicts **average text**, not whether it gets **rare facts** right. Say that sentence and you have half of Q1.

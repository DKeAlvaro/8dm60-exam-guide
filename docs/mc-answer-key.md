# Multiple choice · answer key

<div class="meta"><span class="hot">20% of the grade</span><span>15 min</span><span>Learn the traps</span></div>

<p class="lead">All Mentimeter questions from lectures 1–2 and 6, with the correct option and the one-line reason. The percentages are what the class voted — where the majority was wrong, that is the trap.</p>

## Lectures 1–2

### 1. In autoregressive pretraining, where do the targets come from?

**✅ Each observed token serves as the target following its preceding context.** (83%)

The text supplies its own labels; no annotator. The "own generated continuation" option is wrong — that would be self-training, not pretraining. Masked-token prediction is BERT-style, not autoregressive.

### 2. In $h_i^{(0)} = e(x_i) + p_i$, what is $p_i$?

**✅ The position of the token in the sequence.** (87%)

An embedding of the index, added so the model can distinguish the same token at different locations.

### 3. What defines self-attention vs cross-attention?

**✅ Queries, keys and values come from the same input sequence.** (59%)

Cross-attention takes queries from one sequence (e.g. decoder) and keys/values from another (e.g. encoder). Same projection matrix is not required.

### 4. Zero-shot vs few-shot prompting?

**✅ Zero-shot supplies no task demonstrations; few-shot supplies examples.** (45%)

Both keep the weights frozen. "Uses no pretrained knowledge" is the trap: zero-shot still relies on pretraining.

### 5. LoRA shapes for $W \in \mathbb{R}^{d\times k}$, $\Delta W = BA$ of rank $r$?

**✅ $B \in \mathbb{R}^{d\times r}$ and $A \in \mathbb{R}^{r\times k}$.** (90%)

Inner dimensions $r$ must match; the product gives $d\times k$.

### 6. Why use different augmented views in visual self-supervision?

**✅ They provide related observations from which to learn consistent representations.** (83%)

Invariance learning. They do not preserve every clinical detail (augmentation can destroy some) and do not replace an objective.

### 7. Purpose of a contrastive image–text objective?

**✅ Matching pairs get higher similarity than mismatched pairs.** (72%)

It is not caption generation, pixel reconstruction, nor independent classification.

### 8. Image-to-report retrieval vs report generation?

**✅ Retrieval selects an existing report; generation predicts a sequence of tokens.** (93%)

### 9. Linear probe $p = \text{softmax}(Wz + b)$ with fixed $z = f_\theta(x)$: what is fitted?

**✅ $W$ and $b$; $\theta$ is fixed.** (58%)

That is the definition of a linear probe.

### 10. External validation?

**✅ Evaluation on independently collected data from outside the development source.** (93%)

A random held-out subset of the same dataset is internal validation.

## Lecture 6

### 11. In ReAct, where does the observation after a search come from?

**✅ The search tool executed by the surrounding program.** (36%)

The model *requests*; the environment *executes* and returns text. The tool description in the prompt is the trap (41% voted for it).

### 12. Which description captures ReAct?

**✅ Interleave reasoning and actions, using observations to inform subsequent steps.** (83%)

Not a plan fixed in advance, not a post-hoc explanation, not two separate trained models.

### 13. How do few-shot demonstrations influence a ReAct model?

**✅ They provide example trajectories in the context while weights stay fixed.** (73%)

In-context learning. They do not update parameters or train a controller.

### 14. Why can external search reduce factual hallucinations?

**✅ It supplies evidence the model can use in subsequent reasoning.** (100%)

It does not update weights after each search.

### 15. Main distinction between workflows and agents?

**✅ Workflows use predefined code paths; agents let the LLM direct the process and tool use.** (74%)

22% picked "workflows keep weights fixed, agents update them" — wrong: neither updates weights.

### 16. Extract findings → draft summary → translate. Which pattern?

**✅ Prompt chaining.** (100%)

Sequential LLM calls, each consuming the previous output.

### 17. Classify a request and send it to one of several specialist handlers?

**✅ Routing.**

The class voted 100% for parallelization, which is the trap. Parallelization runs independent subtasks and aggregates; routing *selects* one path. This is the single most likely MCQ trap to reappear.

### 18. Which capability is least tested by a static medical MCQ benchmark?

**✅ Deciding what information to request as a consultation develops.** (84%)

Static questions test recall and single-step association; they cannot test interactive information gathering.

### 19. Role of agent-based modelling in the proposed clinical evaluations?

**✅ To simulate the actions and interactions of participants in a clinical environment.**

Not to replace the encounter with one fixed Q&A, not to train the next-token predictor, not to rank models by size/speed.

### 20. An agent performs well in a clinical simulation. What next?

**✅ Test real-world impact in clinical studies and monitor after deployment.** (90%)

More simulation runs or more static questions do not address transfer.

## Traps to remember

| Tempting option | Why it is wrong |
| --- | --- |
| Workflows train/update weights | Both workflows and agents keep weights fixed |
| Parallelization for a router | Routing selects one path; parallelization runs all |
| Tool description = observation | The program executes the tool; the description is only instructions |
| Few-shot = fine-tuning | Demonstrations are in context; weights unchanged |
| Zero-shot = no pretrained knowledge | It uses pretraining, just no demonstrations |
| Retrieval generates reports | Retrieval selects an existing report |
| Balanced test set gives real precision | Precision depends on prevalence |
| 0.90 softmax = 90% disease probability | Softmax is relative to the candidate set |
| AUROC 0.97 settles the threshold | AUROC is threshold-free; the operating point is a clinical decision |

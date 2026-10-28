# 6 · Agentic AI

<div class="meta"><span class="hot">Lecture 6</span><span>~20 min</span><span>Tools and loops</span></div>

<p class="lead">A plain language model only writes text. An agent is a language model inside a loop: it asks to use a tool, a program runs the tool, and the result comes back as text the model can reason about.</p>

## In plain words

- **Tool use.** The model writes a structured request; the surrounding program executes it; the result is returned to the model.
- **ReAct.** Reason → act → observe → repeat, until a stopping condition.
- **Workflow versus agent.** The difference is **who decides the next step**. A workflow has paths coded in advance; an agent lets the model choose based on what it observed.
- **Five workflow patterns.** Prompt chaining, routing, parallelization, orchestrator–workers, evaluator–optimizer.
- **Evaluation.** You judge the **trajectory** (which tools, which steps, was evidence cited) as well as the final answer, and you count cost.

## Core ideas in one table

| Term | Plain meaning |
| --- | --- |
| Tool request | Model output naming a tool and arguments. |
| Harness / environment | The program that executes the tool and returns the observation. |
| Observation | The tool's returned result, **not** something the model imagined. |
| ReAct | Interleave reasoning and actions, using observations for the next step. |
| Few-shot ReAct | Example trajectories in the prompt; weights stay fixed. |
| Prompt chaining | Fixed sequence of LLM calls, each using the previous output. |
| Routing | Classify the request and send it to **one** specialist handler. |
| Parallelization | Independent subtasks run at once, then aggregate. |
| Orchestrator–workers | The orchestrator decides **at runtime** which subtasks are needed. |
| Evaluator–optimizer | A generator drafts; an evaluator accepts or returns feedback. |
| Trajectory | The full sequence of steps, tool calls and observations. |

## Exam questions

### Q1 — Correctly formatted tool requests: is integration complete?

**Answer.** No. A description in the prompt only shows the model how to **write** a request; it does not prove the request is executed, that arguments are valid, that results are parsed and fed back, or that the tool works on real inputs. You need an **end-to-end test**: real invocation, schema validation, error handling, and final outputs checked against ground truth on representative cases.

### Q2 — All paths and exceptions known: workflow or agent?

**Answer.** A **predefined workflow**. The deciding question is whether the possible paths can be enumerated in advance, not whether the system branches or uses an LLM. An agent adds non-determinism, cost, latency and validation burden with no benefit when the logic is fixed; explicit branches and human-review steps are easier to validate, monitor and audit.

### Q3 — Parallelization or orchestrator–workers?

**Answer.** Independent, pre-defined summaries → **parallelization** (all subtasks run, results aggregated). When which reviews are relevant depends on the case → **orchestrator–workers** (decomposition at runtime). The difference that matters is whether subtasks are fixed in advance or chosen during execution. Orchestration adds coordination cost: more calls and latency, error propagation, non-determinism, harder evaluation, and a synthesizer that must reconcile outputs.

### Q4 — Evaluator–optimizer acceptance and stopping criteria

**Answer.** Use **deterministic checks** for facts: every requested finding present, values and units exact, chronology correct, no fabricated values. Use a **judge** for wording: clarity, coherence, no unsupported claims. Accept only when all deterministic checks pass **and** the judge is above threshold with no new unsupported claims. Use a revision limit as a fallback, but record "revision limit reached" as a **failure**, distinct from acceptance; log the reason and validate the evaluator itself against held-out human ratings.

### Q5 — Design an AI-SCE evaluation of workflow versus agent

**Answer.** Include missing information, inconsistent records, ambiguous findings and routine controls. Record every tool call, step, token and second, and whether missing information was identified and inconsistencies resolved. Compare **outcomes** (correctness/completeness against ground truth), **process** (evidence attribution, unnecessary queries, appropriate escalation) and **cost**. To separate supported from accidentally correct answers, require each statement to cite its source record and inject known inconsistencies.

### Q6 — Where does the observation come from?

**Answer.** The **tool executed by the surrounding program** — the model only requests it. The tool description in the prompt is instructions, not an observation.

### Q7 — What defines ReAct?

**Answer.** Interleaving reasoning and actions, using observations to inform the next step. Not a fixed plan, not a post-hoc explanation, not two separately trained models.

### Q8 — How do few-shot demonstrations affect ReAct?

**Answer.** They put example trajectories in the context (in-context learning); the weights stay fixed. They do not update parameters or train a controller.

### Q9 — Why can search reduce hallucinations?

**Answer.** It supplies **evidence** the model can use in later reasoning, instead of relying on memorised or invented facts. It does not update the weights during the session.

### Q10 — Workflows versus agents?

**Answer.** Workflows use **predefined code paths**; agents let the **LLM direct** the process and tool use. Neither changes the weights.

### Q11 — Extract → draft → translate: which pattern?

**Answer.** **Prompt chaining**: sequential LLM calls, each consuming the previous output.

### Q12 — Classify then send to a specialist handler?

**Answer.** **Routing** — one path is selected. Parallelization would run several paths and aggregate; that is the classic trap.

### Q13 — What does a static MCQ benchmark miss?

**Answer.** **Deciding what information to request** as a consultation develops. Static questions test recall and single-step association, not interactive information gathering.

### Q14 — Role of agent-based modelling?

**Answer.** To **simulate the actions and interactions of participants** in a clinical environment, so a system can be tested against realistic behaviour before real deployment.

### Q15 — After good simulated performance?

**Answer.** Test **real-world impact in clinical studies** and **monitor after deployment**. More simulation or more static questions do not address transfer.

!!! tip "If you remember one thing"
    Workflow or agent? Ask: **can I list the paths in advance?** Yes → workflow. No, the next step depends on what the tool returns → agent. Never answer "because it uses an LLM".

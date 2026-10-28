# 6 · Agentic AI

<div class="meta"><span class="hot">Lecture 6</span><span>~20 min</span><span>Read → answer → check</span></div>

<p class="lead">A language model alone only writes text. An agent is a model inside a loop where it can use tools. This page defines the loop and the five patterns, then tests each.</p>

## 1. Tools turn text into actions

**Explanation.** A **tool** is a function the model is allowed to call (search, database query, calculator). The model emits a structured **tool request**; the **harness** — the surrounding program, not the model — executes it and returns the result as an **observation**. The observation is tool output, never something the model predicted.

!!! question "Check yourself"
    A model produces perfectly formatted tool calls in every test. Is the tool integration complete? What must you test?

??? success "Answer"
    No. Prompting a description only shows the model how to **write** a request; it does not prove execution, valid arguments, parsing of the result, or correct tool behaviour. Test end-to-end: real invocation, schema validation, error handling, and final answers against ground truth on representative cases.

## 2. ReAct: reason, act, observe

**Explanation.** **ReAct** interleaves **reasoning** (text about what to do) and **actions** (tool calls), using each observation to decide the next step. **Few-shot ReAct** puts example trajectories in the prompt; the weights do not change.

!!! question "Check yourself"
    After the model requests a search, where does the observation come from, and why can search reduce hallucinations?

??? success "Answer"
    From the **search tool executed by the harness**. Search supplies external evidence the model can use in later reasoning, instead of relying on memorised or invented facts; it does not update the weights.

## 3. Workflow or agent: who chooses the next step?

**Explanation.** A **workflow** is a system where the possible paths are written in code in advance. An **agent** is a system where the **LLM decides** the next step and which tools to use based on what it observed. Both keep the weights fixed. The deciding question is not "does it use an LLM" but "**can I enumerate the paths in advance?**"

!!! question "Check yourself"
    A record-review pipeline has known exceptions: if quality fails, replace the image; if measurements are missing, send to a human. Workflow or agent?

??? success "Answer"
    **Workflow**. Every path can be enumerated in advance, so explicit branches are easier to validate, monitor and audit. An agent adds non-determinism, cost, latency and validation burden with no benefit.

## 4. The five workflow patterns

**Explanation.**

- **Prompt chaining:** fixed sequence of calls, each using the previous output.
- **Routing:** classify the request, then send it to **one** specialist handler.
- **Parallelization:** independent subtasks run at the same time, then an aggregator combines them.
- **Orchestrator–workers:** an orchestrator decides **at runtime** which subtasks are needed, workers do them, a synthesizer combines.
- **Evaluator–optimizer:** a generator drafts; an evaluator accepts or returns feedback for revision.

!!! question "Check yourself"
    Name the pattern for each: (a) extract findings → draft summary → translate; (b) classify a request and send it to a cardiology handler; (c) summarise three independent records at once; (d) decide per case which specialist reviews are needed.

??? success "Answer"
    (a) prompt chaining; (b) **routing** (not parallelization — only one path runs); (c) parallelization; (d) orchestrator–workers (subtasks chosen at runtime). The distinction between (c) and (d) is whether the decomposition is fixed before execution.

!!! question "Check yourself"
    Why might orchestrator–workers be worth its extra cost, and what is that cost?

??? success "Answer"
    It is worth it when which subtasks are needed depends on the case, so delegation must happen at runtime. The cost is coordination: more LLM calls and latency, error propagation, non-determinism, harder evaluation, and a synthesizer that must reconcile outputs.

## 5. Acceptance and stopping criteria

**Explanation.** An agent needs a **stop condition**: success, a revision limit, or escalation to a human. **Acceptance criteria** define success. Deterministic checks (values, units, required findings) should be separate from judgement calls (clarity, emphasis). Reaching the revision limit is a **failure**, not an acceptance.

!!! question "Check yourself"
    Design acceptance and stopping criteria for a summary that must preserve findings, values, units and chronology.

??? success "Answer"
    Deterministic checks: every requested finding present, values and units exact, chronology correct, no fabricated values. Judgement: clarity, coherence, no unsupported claims. Accept only when all deterministic checks pass **and** the judge is above threshold; otherwise revise up to a fixed limit, and log "revision limit reached" as a failure. Validate the evaluator against human ratings to avoid self-preference.

## 6. Evaluating trajectories, not just answers

**Explanation.** A **trajectory** is the full sequence of reasoning steps, tool calls and observations. **Outcome evaluation** checks the final answer; **process evaluation** checks whether the right evidence was gathered and cited. **AI-SCE** (simulated clinical environment) places the system in a simulated encounter; **agent-based modelling** simulates the actions and interactions of participants.

!!! question "Check yourself"
    How would you distinguish a well-supported summary from one that is accidentally correct?

??? success "Answer"
    Require each statement to cite its source record, score supported-but-correct statements as failures if unsupported, inject known inconsistencies to see whether they are detected, and use blinded graders on paired cases. Accidental correctness disappears when the evidence chain is checked.

!!! question "Check yourself"
    An agent performs strongly in simulation. What evidence is needed before real care, and what does a static MCQ benchmark miss?

??? success "Answer"
    Real-world clinical studies and post-deployment monitoring — simulation cannot establish transfer. A static MCQ benchmark misses **deciding what information to request** as a consultation develops, because it tests recall and single-step association, not interactive information gathering.

!!! tip "If you remember one thing"
    Workflow or agent? Ask **can I list the paths in advance?** Yes → workflow. No → agent. Never answer "because it uses an LLM".

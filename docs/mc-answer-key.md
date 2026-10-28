# Multiple choice · practice

<div class="meta"><span class="hot">20% of the grade</span><span>20 questions</span><span>Click to answer</span></div>

<p class="lead">Pick an option for each question. The correct one turns green, a wrong pick turns red and shows the right answer, and the explanation appears underneath. The percentages are how the class voted — a low percentage marks a trap.</p>

<div class="quiz-score" id="quiz-score">0 correct · 0 answered</div>
<button id="quiz-reset" type="button">Reset</button>

## Lectures 1–2

<div class="quiz" data-correct="1">
<p class="quiz-q"><span class="quiz-num">1.</span> In autoregressive pretraining, where do the prediction targets come from?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">A separate expert annotator assigns a class to each sentence</button>
<button type="button" class="quiz-opt">Each observed token is the target for the preceding context</button>
<button type="button" class="quiz-opt">The model's own generated continuation is used as the target</button>
<button type="button" class="quiz-opt">Randomly hidden tokens are predicted from both sides</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> The text labels itself: token $i$ is predicted from tokens before it. No annotator is involved. The model's own output would be self-training, and predicting hidden tokens from both sides is BERT-style masking, not autoregressive. (83% correct)</div>
</div>

<div class="quiz" data-correct="2">
<p class="quiz-q"><span class="quiz-num">2.</span> In $h_i^{(0)} = e(x_i) + p_i$, what information does $p_i$ supply?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">The probability of the token as the next output</button>
<button type="button" class="quiz-opt">How often the token appeared in the training set</button>
<button type="button" class="quiz-opt">The position of the token in the sequence</button>
<button type="button" class="quiz-opt">The model's confidence that the token is factually correct</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> $p_i$ is a position vector added to the embedding so the model can tell the same word at different places apart. It carries no frequency, probability or confidence. (87% correct)</div>
</div>

<div class="quiz" data-correct="3">
<p class="quiz-q"><span class="quiz-num">3.</span> What defines self-attention, as opposed to cross-attention?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Every token can attend only to itself</button>
<button type="button" class="quiz-opt">Attention is computed without trainable parameters</button>
<button type="button" class="quiz-opt">Queries, keys and values use an identical learned projection matrix</button>
<button type="button" class="quiz-opt">Queries, keys and values come from the same input sequence</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> Self-attention takes Q, K and V from the same sequence; cross-attention takes Q from one sequence and K/V from another. The projection matrices need not be identical. (59% correct)</div>
</div>

<div class="quiz" data-correct="2">
<p class="quiz-q"><span class="quiz-num">4.</span> What distinguishes zero-shot from few-shot prompting?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Zero-shot freezes the weights; few-shot trains them</button>
<button type="button" class="quiz-opt">Zero-shot uses no pretrained knowledge; few-shot does</button>
<button type="button" class="quiz-opt">Zero-shot supplies no task demonstrations; few-shot supplies examples</button>
<button type="button" class="quiz-opt">Zero-shot supplies no instruction; few-shot supplies one</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> The only difference is whether examples are in the prompt. Weights are frozen in both, and zero-shot still relies on pretraining. (45% correct — the trap was "no pretrained knowledge")</div>
</div>

<div class="quiz" data-correct="0">
<p class="quiz-q"><span class="quiz-num">5.</span> For $W \in \mathbb{R}^{d \times k}$ and $\Delta W = BA$ of rank at most $r$, which shapes are compatible?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">$B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times k}$</button>
<button type="button" class="quiz-opt">$B \in \mathbb{R}^{d \times k}$ and $A \in \mathbb{R}^{r \times r}$</button>
<button type="button" class="quiz-opt">$B \in \mathbb{R}^{k \times r}$ and $A \in \mathbb{R}^{r \times d}$</button>
<button type="button" class="quiz-opt">$B \in \mathbb{R}^{r \times d}$ and $A \in \mathbb{R}^{k \times r}$</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> The inner dimension $r$ must match, and the product must be $d \times k$: $(d \times r)(r \times k)$. (90% correct)</div>
</div>

<div class="quiz" data-correct="1">
<p class="quiz-q"><span class="quiz-num">6.</span> Why are different augmented views of an image used in visual self-supervision?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">They guarantee preservation of every clinically important detail</button>
<button type="button" class="quiz-opt">They provide related observations from which to learn consistent representations</button>
<button type="button" class="quiz-opt">They ensure all images get identical feature vectors</button>
<button type="button" class="quiz-opt">They replace the need for an optimisation objective</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> Two views of the same content teach invariance: representations stay consistent under changes that do not change the content. Augmentation can actually destroy detail, and it is not a substitute for a loss. (83% correct)</div>
</div>

<div class="quiz" data-correct="0">
<p class="quiz-q"><span class="quiz-num">7.</span> What is the purpose of a contrastive image–text training objective?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">To give matching image–text pairs higher similarity than mismatched pairs</button>
<button type="button" class="quiz-opt">To predict successive words of a caption from its image</button>
<button type="button" class="quiz-opt">To reconstruct image pixels from text descriptions</button>
<button type="button" class="quiz-opt">To assign images and text independently to fixed diagnostic labels</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> Contrastive means pull matching pairs together and push mismatched pairs apart. It is not captioning, reconstruction or classification. (72% correct)</div>
</div>

<div class="quiz" data-correct="1">
<p class="quiz-q"><span class="quiz-num">8.</span> Which statement distinguishes image-to-report retrieval from report generation?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Retrieval predicts report tokens; generation ranks stored reports</button>
<button type="button" class="quiz-opt">Retrieval selects an existing report; generation predicts a sequence of report tokens</button>
<button type="button" class="quiz-opt">Retrieval uses a text query only; generation uses an image query only</button>
<button type="button" class="quiz-opt">Both select stored reports, using different similarity metrics</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> Retrieval returns a neighbour from the archive; generation writes new text token by token. (93% correct)</div>
</div>

<div class="quiz" data-correct="2">
<p class="quiz-q"><span class="quiz-num">9.</span> For fixed features $z = f_\theta(x)$, a linear probe uses $p = \mathrm{softmax}(Wz + b)$. Which parameters are fitted?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">$\theta$, $W$ and $b$ jointly</button>
<button type="button" class="quiz-opt">No parameters; the class probabilities are known before training</button>
<button type="button" class="quiz-opt">$W$ and $b$, while $\theta$ is fixed</button>
<button type="button" class="quiz-opt">$\theta$ only, while $W$ and $b$ are fixed</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> That is the definition of a probe: the encoder is frozen and only the small classifier on top is learned. (58% correct)</div>
</div>

<div class="quiz" data-correct="0">
<p class="quiz-q"><span class="quiz-num">10.</span> What is external validation of a biomedical AI model, as opposed to an internal held-out test?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Evaluation on independently collected data from outside the development source</button>
<button type="button" class="quiz-opt">Evaluation on a random subset withheld from the same dataset</button>
<button type="button" class="quiz-opt">Evaluation after selecting the best model on the original validation subset</button>
<button type="button" class="quiz-opt">Evaluation on augmented copies of the training images</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> External means new data from another site, period or population. A random subset of the same dataset is internal validation. (93% correct)</div>
</div>

## Lecture 6

<div class="quiz" data-correct="0">
<p class="quiz-q"><span class="quiz-num">11.</span> When a model requests a search in a ReAct-style system, where does the resulting observation come from?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">The search tool executed by the surrounding program</button>
<button type="button" class="quiz-opt">The model's prediction of what the search should return</button>
<button type="button" class="quiz-opt">The description of the search tool supplied in the prompt</button>
<button type="button" class="quiz-opt">The reasoning text that introduced the search request</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> The model requests; the harness executes; the tool returns text. The tool description is instructions, not an observation. (36% correct — the biggest trap in the set)</div>
</div>

<div class="quiz" data-correct="1">
<p class="quiz-q"><span class="quiz-num">12.</span> Which description best captures the ReAct approach?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Complete a reasoning plan before acting, without further model decisions</button>
<button type="button" class="quiz-opt">Interleave reasoning and actions, using observations to inform subsequent steps</button>
<button type="button" class="quiz-opt">Generate the final answer first, then a reasoning trace to explain it</button>
<button type="button" class="quiz-opt">Assign reasoning and action selection to two separately trained models</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> ReAct is a loop, not a fixed plan and not post-hoc explanation. (83% correct)</div>
</div>

<div class="quiz" data-correct="2">
<p class="quiz-q"><span class="quiz-num">13.</span> In ReAct's few-shot prompting setup, how do demonstrations influence the model?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">They supply labelled examples for updating every model parameter</button>
<button type="button" class="quiz-opt">They train a separate controller that chooses actions</button>
<button type="button" class="quiz-opt">They provide example trajectories in the input context while the weights stay fixed</button>
<button type="button" class="quiz-opt">They replace the external environment with stored answers</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> In-context learning: examples in the prompt, no parameter updates. (73% correct)</div>
</div>

<div class="quiz" data-correct="1">
<p class="quiz-q"><span class="quiz-num">14.</span> Why can external search help address the factual hallucinations discussed in ReAct?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">It increases the amount of reasoning generated before any evidence is retrieved</button>
<button type="button" class="quiz-opt">It supplies evidence that the model can use in subsequent reasoning</button>
<button type="button" class="quiz-opt">It transfers responsibility for the final answer to the search engine</button>
<button type="button" class="quiz-opt">It updates the model's weights after each search</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> Search grounds later reasoning in retrieved evidence; it does not update weights. (100% correct)</div>
</div>

<div class="quiz" data-correct="2">
<p class="quiz-q"><span class="quiz-num">15.</span> What is the main distinction between workflows and agents?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Workflows use one model; agents require several cooperating models</button>
<button type="button" class="quiz-opt">Workflows process text; agents must also process images</button>
<button type="button" class="quiz-opt">Workflows use predefined code paths; agents let the LLM direct the process and tool use</button>
<button type="button" class="quiz-opt">Workflows keep the weights fixed; agents update them after each action</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> The question is who chooses the next step. Neither design updates the weights. (74% correct; 22% fell for the weight-update trap)</div>
</div>

<div class="quiz" data-correct="1">
<p class="quiz-q"><span class="quiz-num">16.</span> One LLM call extracts findings, a second drafts a summary, a third translates it. Which pattern is this?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Routing</button>
<button type="button" class="quiz-opt">Prompt chaining</button>
<button type="button" class="quiz-opt">Parallelization</button>
<button type="button" class="quiz-opt">Evaluator–optimizer</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> Fixed sequential stages, each consuming the previous output: chaining. (100% correct)</div>
</div>

<div class="quiz" data-correct="3">
<p class="quiz-q"><span class="quiz-num">17.</span> A system classifies a request and sends it to one of several specialist handlers. Which pattern is this?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Prompt chaining</button>
<button type="button" class="quiz-opt">Evaluator–optimizer</button>
<button type="button" class="quiz-opt">Parallelization</button>
<button type="button" class="quiz-opt">Routing</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> One path is selected. Parallelization runs several paths and aggregates. This is the most likely trap to reappear. (The class voted 100% for parallelization.)</div>
</div>

<div class="quiz" data-correct="2">
<p class="quiz-q"><span class="quiz-num">18.</span> Which capability is least directly tested by a static medical multiple-choice benchmark?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Selecting a diagnosis from a supplied list of alternatives</button>
<button type="button" class="quiz-opt">Recalling a medical fact needed to answer a question</button>
<button type="button" class="quiz-opt">Deciding what information to request as a consultation develops</button>
<button type="button" class="quiz-opt">Recognising an association between symptoms and a disease</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> Static questions test recall and single-step association; they cannot test interactive information gathering. (84% correct)</div>
</div>

<div class="quiz" data-correct="0">
<p class="quiz-q"><span class="quiz-num">19.</span> What is the role of agent-based modelling in the proposed clinical evaluations?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">To simulate the actions and interactions of participants in a clinical environment</button>
<button type="button" class="quiz-opt">To replace a clinical encounter with a single fixed question and answer</button>
<button type="button" class="quiz-opt">To train the language model's next-token predictor on clinical textbooks</button>
<button type="button" class="quiz-opt">To rank language models by parameter count and inference speed</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> It simulates participants behaving in an environment, so a system can be tested against realistic interaction. (Not a replacement for the encounter.)</div>
</div>

<div class="quiz" data-correct="2">
<p class="quiz-q"><span class="quiz-num">20.</span> An agent performs well in a clinical simulation. Which further step best addresses whether that result transfers to actual care?</p>
<div class="quiz-opts">
<button type="button" class="quiz-opt">Increase the number of runs in the same unchanged simulation</button>
<button type="button" class="quiz-opt">Expand the set of static medical knowledge questions</button>
<button type="button" class="quiz-opt">Test real-world impact in clinical studies and monitor after deployment</button>
<button type="button" class="quiz-opt">Increase the similarity between generated explanations and reference explanations</button>
</div>
<div class="quiz-exp" hidden><strong>Why.</strong> Simulation cannot establish transfer. Real-world studies plus post-deployment monitoring are the evidence. (90% correct)</div>
</div>

## Traps to remember

| Tempting option | Why it is wrong |
| --- | --- |
| Workflows train or update weights | Both workflows and agents keep the weights fixed |
| Parallelization for a router | Routing selects one path; parallelization runs all |
| Tool description equals observation | The program executes the tool; the description is only instructions |
| Few-shot equals fine-tuning | Demonstrations are in context; weights unchanged |
| Zero-shot equals no pretrained knowledge | It uses pretraining, just no demonstrations |
| Retrieval generates reports | Retrieval selects an existing report |
| Balanced test set gives real precision | Precision depends on prevalence |
| 0.90 softmax equals 90% disease probability | Softmax is relative to the candidate set |
| AUROC 0.97 settles the threshold | AUROC is threshold-free; the point is a clinical decision |

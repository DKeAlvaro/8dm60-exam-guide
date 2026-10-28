# Your project · 15%

<div class="meta"><span class="hot">Chest X-ray + reports</span><span>Poster + code</span><span>Read → answer → check</span></div>

<p class="lead">The project is a small study on the Indiana University Chest X-ray dataset: images paired with radiology reports, analysed with a vision–language model or with frozen image features. This page explains what the task actually is, then asks the questions the examiner will ask about your poster.</p>

## 1. What the data are

**Explanation.** The **Indiana University Chest X-ray / OpenI** dataset contains **studies**: one patient, one exam, one radiology report, and one or more images (often a **frontal** and a **lateral** view). A study is not the same as an image. The report has sections: **findings** (what is visible), **impression** (the conclusion), and often **comparison** and **indication**.

**Why study-level splits.** If two images from the same study end up in different splits, the model can see at test time an image whose report it memorised during training. Splitting by **study ID** prevents that — the same reason patient-level splits matter in hospital data.

!!! question "Check yourself"
    Your dataset has 3,955 studies and 7,470 images. Why must the train/test split be by study, and how should a study with a frontal and a lateral image be represented?

??? success "Answer"
    Splitting by image would put one view of a study in train and the other in test, leaking the report and the patient. Split by study ID and keep all images of a study on the same side. For representation, either use one image per study (usually frontal) or combine both views, but state the choice and make it consistent between training and evaluation. The starter notebook keeps only the frontal image and compares it with the **study-level** report.

## 2. The reference is not always what the image shows

**Explanation.** A report describes the whole study, including the lateral view, priors and clinical context. If you feed only the frontal image, some statements in the reference may be true but **not visible** in your input. That is not necessarily a model hallucination — it is a mismatch between your input and your **reference standard**.

!!! question "Check yourself"
    A generated report says "small pleural effusion", the reference says the same, but the effusion is only visible on the lateral view you did not provide. Should this count as a correct, missed or hallucinated finding? What about the opposite case?

??? success "Answer"
    It is **not evidence of grounding**: the model could have guessed it or learned the prior. Score it separately as "correct but unsupported by the input", and predefine how to handle it. The opposite case — the report omits something visible in your image — is a genuine miss relative to the image, even if it matches the reference. This is why a proper evaluation needs an image-level reference or an explicit annotation protocol, not just text matching.

## 3. Three ways to use MedGemma

**Explanation.** **MedGemma 4B Instruct** is a generative **vision–language model**: a vision encoder turns the image into **image tokens**, a language decoder writes text conditioned on them. The starter notebook shows three uses:

1. **Generation:** prompt with the image and ask for a report; compare with the reference.
2. **Frozen features:** take the encoder's image tokens, **mean-pool** them into one vector per X-ray, and use it for retrieval, clustering or a classifier.
3. **QLoRA:** keep the base weights **quantized** to 4 bits and train small low-rank adapters on the decoder's query and value projections.

!!! question "Check yourself"
    In the QLoRA setup, which weights change during training, and why is the loss computed only on the report tokens?

??? success "Answer"
    Only the **LoRA adapters** (rank $r=8$) on the decoder's query and value projections change; the quantized MedGemma weights and the vision encoder stay frozen. Loss is computed only on the report because the image and prompt are context, not targets: their labels are set to `-100` so the model is not rewarded for reproducing the instruction or image placeholders.

## 4. Every project needs a baseline

**Explanation.** A **baseline** is the simplest reference result your method must beat, and it depends on the question:

| Question type | Baseline |
| --- | --- |
| Retrieval | Random ranking; image similarity without text training; the frozen encoder before adaptation |
| Generation | Zero-shot MedGemma with the same prompt; always output the most common report |
| Classification | Majority class; logistic regression on frozen features |
| Analysis | No stratification; report-derived labels without image review |

!!! question "Check yourself"
    Your question is "does QLoRA adaptation improve clinical accuracy of generated reports?". What are the two baselines, and what would make the comparison unfair?

??? success "Answer"
    Baselines: (1) the same MedGemma **before** adaptation with an identical prompt and decoding settings; (2) a trivial report baseline (most common template) to show the task is non-trivial. Unfair if the adapted model gets a different prompt, more tokens or test-time tuning, or if evaluation examples were used for validation or model selection.

## 5. Metrics: what each number establishes

**Explanation.** **Retrieval** is scored with **Recall@k** (is the correct report in the top $k$?) and median rank. **Generation** is scored with text-overlap metrics (**BLEU**, **ROUGE**, **METEOR**) and, more importantly, with **clinical correctness**: supported, missed and invented findings, ideally by a blinded reader. **Classification** uses AUROC, sensitivity/specificity at a stated threshold, and calibration. **Text overlap is not clinical accuracy**: a fluent paraphrase can score low on BLEU while being clinically right, and a copied template can score high while being wrong.

!!! question "Check yourself"
    Your model improves BLEU by 3 points but a blinded review finds more invented findings. Which result do you report as the main outcome, and why?

??? success "Answer"
    Report both, but the **clinical review is the main outcome** because the question is about clinical accuracy; BLEU is a secondary, formatting-sensitive proxy. Say explicitly that the improvement in overlap did not translate into safety, and show the error breakdown (supported / missed / invented).

## 6. Qualitative examples are part of the evaluation

**Explanation.** The poster needs **success and failure examples**, not only aggregate numbers. For each example, label every statement as **supported** (visible in the image), **missed** (visible but absent), or **invented** (absent but stated). This is the difference between "the report looks good" and evidence.

!!! question "Check yourself"
    Pick one generated report. How would you present it so that a reader can judge grounding without opening your code?

??? success "Answer"
    Show the image, the reference findings, and the generated findings side by side, with each generated statement marked supported / missed / invented and a one-line reason. State the prompt and decoding settings. A reader should be able to see both a success and a failure in under a minute.

## 7. The six design choices you must defend

**Explanation.** The course requires these to be explicit: the question and why it matters; the data fields and report sections used; how multi-image studies are represented; the model, baseline or analysis method and alternatives considered; the evaluation; the limitations and risks.

!!! question "Check yourself"
    State your research question in one sentence, then name the one design choice that most affects the answer.

??? success "Answer"
    A good answer has a population (chest X-ray studies), an input (frontal image, both views, or frozen features), an outcome (retrieval rank, report correctness, classification performance) and a comparison (adapted vs zero-shot, one view vs two, model vs baseline). The choice that most affects the answer is usually the **reference standard and split**: what counts as correct, and whether the test studies were truly unseen.

## 8. Limitations the examiner will probe

**Explanation.** Typical limitations: one frontal view while the report covers the study; **report-derived labels** from text heuristics rather than radiologist review; a small dataset; a single site and scanner; compute limits forcing a subset; repeated validation monitoring that turns the validation set into a tuning set; and no prospective or external validation.

!!! question "Check yourself"
    What is the strongest limitation of your project, and what is the one next experiment that would most reduce it?

??? success "Answer"
    Name one limitation with its consequence — e.g. "reference reports include the lateral view, so some correct statements cannot be verified from the frontal image, which inflates apparent grounding". The next experiment should be decisive and feasible: image-level annotation of a sample, a second reader, a held-out external set, or an ablation of the component you claim matters.

## The question bank

Rehearse these out loud. Each one is a likely group-specific exam question.

### Why is your question important, and what result answers it?

Point to the exact figure or table. If the question changed during the project, say so and why.

### Why this split, and where could leakage enter?

Study-level split, no patient overlap, no preprocessing fitted on the full set, no prompt or checkpoint selected on the test set.

### Why this model and baseline?

Justify by data type and compute. Name the baseline and what a simpler alternative would isolate.

### How do you represent a study with several images?

One frontal image, both views, or per-image features aggregated — and the same rule at training and test time.

### What does each metric measure, and what do your numbers establish?

Separate text overlap from clinical correctness; retrieval Recall@k from generation quality; discrimination from calibration. State what one split and no confidence intervals cannot establish.

### How does the code reproduce each poster figure?

Input file, notebook or script, command, seed. Name any manual step.

### Where does it fail, and what next?

One main failure mode, one strongest limitation, one decisive next experiment.

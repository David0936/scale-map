# Scale Map Deliverable

Return a production-ready package in this order.

## 1. Thesis card

- Product and scope
- Human desire in one sentence
- Causal thesis in one sentence
- Future disappearance question
- Intended audience and publishing format, if known

## 2. Six-layer map

For HUMAN, TIME, PEOPLE, SPACE, OBJECT, and FUTURE, provide the decisive finding, why it matters to the thesis, evidence/source, and confidence or unresolved point.

## 3. Storyboard

Use 5–8 frames. For each frame include:

- number and role (HOOK / BEFORE / TURNING POINT / EVOLUTION / NOW / AFTER or a justified addition);
- the single claim;
- on-image copy;
- visual event and composition;
- period and medium;
- evidence represented in the image;
- David: absent or exact in-world placement and action;
- lobster: absent or exact Easter-egg placement;
- transition from the previous frame.

## 4. Image briefs

Write one self-contained generation brief per frame containing subject, action, environment, spatial arrangement, era, medium, lighting, palette, camera or graphic logic, product identity constraints, David placement when used, lobster placement when used, aspect ratio, and exclusions.

Separate factual content from creative extrapolation. Do not rely on “same as previous frame” when the generation system cannot see prior images; restate continuity anchors.

## 5. Publishing copy

Provide a title, short introduction, frame captions when needed, and an ending line that opens the disappearance question without explaining it away. Do not force engagement bait; the lobster already supplies an organic discovery loop.

## 6. Evidence ledger

List sources beside the claims they support. Mark each claim as verified fact, interpretation, or speculation. Flag any visual detail that remains uncertain and should not be rendered as fact.

## 7. Final audit

State which checks passed, which decisions remain provisional, whether a David identity reference was actually available, and what must be reviewed before image generation or publication.


## Film package (when the output is a film)

Sections 1–3 and 6–7 stay as written; the six-frame storyboard is still the story spine. Section 4 (image briefs) is replaced by 4a–4c, and section 5 gains two items.

### 4a. 镜头表

`episodes/<nn-slug>/镜头表.md`, written from [storyboard-template.md](storyboard-template.md): the three lock lines, the thesis line, the ad slot, 12–16 shots tagged with their frame roles, and an evidence ledger for every on-screen year, price and number. It must lint green.

### 4b. Style directions

One beat rendered in three directions with different compositions, delivered as one contact sheet, plus the user's recorded choice.

### 4c. Film

- `eras_<film>.js` and `scenes/*.js`, synced and rendered through `motion/sync.sh`.
- A contact sheet of stills for each segment in `previews/`.
- The finished film from `deliver.py`, plus its `交付说明.md` with the gate results, the independent review, and a one-line reason for each yellow light.

### 5 (film additions). Publishing copy

Add the cover frame (a still from the HOOK or turning-point shot) and the timestamp of the ad slot.

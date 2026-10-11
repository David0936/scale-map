---
name: scale-map
description: Research and design historically grounded visual narratives that place a product on the scale of human desire, time, people, space, form, and future — as a carousel of still frames or as a 60–90 second animated film rendered in code. Use when the user asks to distill a product with Scale Map (产品蒸馏) or create its research, carousel story, art direction, image prompts, storyboard (镜头表), animated short, or distribution package.
---

# Scale Map

Scale Map is a visual narrative system for observing products at the scale of human civilization. It is not a technology-product introduction template and not a prompt pack.

Given a product, explain why people need it, who changed its path, how it reshaped space, why it took its present form, and whether the object will still exist when its underlying need is fully solved.

## Governing principle

**Never decorate history. Visualize it.**

Use a historical medium only when its setting, objects, labor, architecture, or social relations carry the argument. A famous image with no causal relationship to the story does not belong.

## Build the six-layer map

Research all six layers before choosing pages or visuals:

- **HUMAN — Desire:** What persistent human need, burden, fear, status signal, or aspiration creates demand?
- **TIME — Lineage:** What behavior preceded the product, and which technical or social turns led to today?
- **PEOPLE — Agency:** Which people or groups materially redirected the path? Distinguish inventors, popularizers, manufacturers, regulators, and users.
- **SPACE — Habitat:** How did the product enter and alter rooms, homes, buildings, cities, infrastructure, and routines?
- **OBJECT — Form:** Which constraints explain its present shape, interface, materials, size, and placement?
- **FUTURE — Disappearance:** If the underlying need were solved completely, would this product remain, dissolve into architecture or infrastructure, or disappear?

Do not force equal screen time for every layer. The map is the research model; the final story uses only the strongest causal spine.

## Choose the output

Ask once, or infer from the request:

- **Carousel** — 5–8 still frames (default 6) with image briefs for a generation model. Stages 1–4.
- **Film** — a 60–90 second animated short drawn entirely in code. Stages 1–3, then stage 5 instead of stage 4's image briefs. Requires the [huashu-art-motion](https://github.com/alchaincyf/huashu-art-motion) skill (`npx skills add alchaincyf/huashu-art-motion`) plus uv, ffmpeg and Playwright Chromium.

Both share the same research, thesis, six-frame story, evidence ledger and style bible. A film is the carousel's causal spine played in time, not a different story.

## Work in five stages

### 1. Research

Start from the human behavior and spatial condition, not the launch date of the modern device. Build a source-backed chain from before the category existed to current use. Separate verified facts, reasonable interpretation, and speculation. Do not invent named people, dates, patents, quotations, artworks, or product claims.

Record sources and unresolved claims as the research proceeds. Prefer primary and authoritative sources for historical facts and current product claims. Anything describing the present (current prices, who owns a company, the newest models) must be looked up, not recalled.

### 2. Distill

Reduce the research to:

1. one human desire;
2. one causal thesis;
3. three to six decisive turns;
4. one present-day reason people actually pay;
5. one future disappearance question.

If the material does not support a coherent thesis, continue research or narrow the subject before making images.

### 3. Story

Use **5–8 frames; 6 is the recommended default**, not a rigid quota:

1. **HOOK:** one counterintuitive question and the strongest visual.
2. **BEFORE:** how people lived before the product.
3. **TURNING POINT:** the person, invention, institution, or social change that redirected the path.
4. **EVOLUTION:** the technical tree, timeline, or morphological evolution.
5. **NOW:** the job being solved today and what customers truly pay for.
6. **AFTER:** what happens after another century of solving the same need.

Add or split frames when the argument requires it. **Each frame carries exactly one claim.** Prefer another frame to a collage of unrelated facts.

End with the disappearance question, not “the future version will be more powerful.”

### 4. Art direction and generation (carousel)

Let the visual language evolve with time: classical painting; industrial print, patent, or engineering drawing; modernist architecture and graphic design; consumer advertising and product photography; digital interfaces and contemporary photography; then AI surreal photography for the future.

Treat artwork and architecture as evidence-bearing narrative devices. Write each visual brief around the claim, spatial logic, period evidence, product continuity, and intended viewer inference before adding stylistic detail.

Read [references/style-bible.md](references/style-bible.md) before directing David, the lobster, historical media, or image continuity. Use [references/deliverable.md](references/deliverable.md) for the required output package.

### 5. Film (code-drawn animation)

Read [references/film-pipeline.md](references/film-pipeline.md) before writing a storyboard, and [references/media-relay.md](references/media-relay.md) before choosing media. Then read huashu-art-motion's `SKILL.md`; its gates apply in full. In short:

1. **Story → 镜头表.** Expand the 6 frames into 12–16 shots of 2–6 s each using [references/storyboard-template.md](references/storyboard-template.md). Every shot names a concrete object and its action. The first shot is an object doing something, with no text; the last shot is the product doing something, with the disappearance question written on an object in the scene.
2. **Lint.** Run huashu's `storyboard_lint.py` until green. No code before green.
3. **Three directions.** Render one beat in three media directions with three different compositions and let the user choose. Choosing a style is never skipped, even when the user has named one.
4. **Media relay.** Use at most four media per film, switch only at era boundaries, and enter each medium with its own signature transition. One six-color palette threads through every medium.
5. **Build.** One scene file per medium in `episodes/<nn-slug>/scenes/`, built on `motion/kit/scale_map_kit.js`. Run `motion/sync.sh episodes/<nn-slug>` to wire it into the engine. Check stills per scene before rendering the whole film.
6. **Gates.** Run huashu's `qa.py`, then an independent review agent that has seen only the finished film, then `deliver.py`. A red gate means no delivery.

## Quality gate

Before delivery, verify:

- Every factual claim has a traceable source or is explicitly marked interpretation/speculation.
- Every frame advances one claim in the causal thesis.
- The chosen medium explains its era rather than merely resembling it.
- David is an in-world scale figure, never a recurring presenter.
- The lobster is optional and never required to accompany David.
- Product form changes are motivated by technology, labor, space, economics, or behavior.
- The final frame tests whether the object disappears when the need is solved.
- Image prompts preserve the product's essential identity and do not contradict the research.

For a film, also verify:

- Every year, price and number on screen appears in the evidence ledger with its source.
- The 镜头表 lints green, and the film passes `qa.py`, the independent review and `deliver.py`.
- No more than four media, each switch on an era boundary, and one palette across all of them.
- The subject fills at least half the frame in every shot, and no shot shows empty canvas at its edges.
- People appear only as backs, silhouettes or hands. Code never draws faces.

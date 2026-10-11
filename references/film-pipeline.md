# Scale Map Film Pipeline

How a Scale Map story becomes a 60–90 second film drawn in code. The research, thesis and six frames come from stages 1–3 unchanged; this file covers what happens after.

The render engine, gates and most craft rules belong to **huashu-art-motion**. This file adds only what Scale Map needs on top: how frames become shots, how media change with time, where David and the lobster go, and how facts reach the screen.

## 1. From six frames to a 镜头表

A frame carries one claim. In a film, that claim is played out as one to four shots, and each shot is **one object doing one thing**.

| Frame | Shots (60 s) | What the shots must do | Camera |
| --- | --- | --- | --- |
| HOOK | 1 (3–4 s) | The product, today, doing something small that already contains the thesis. **No text.** | hold, then one slam on the payoff |
| BEFORE | 2 (8 s) | The human body doing the job by hand; then the job failing or repeating | pan, then push |
| TURNING POINT | 2–3 (10–13 s) | Each decisive turn is one machine doing its new trick in its own era | push / pan / slam, never the same three in a row |
| EVOLUTION | 3–4 (12–17 s) | Form changes under pressure: price, size, autonomy, mass adoption | alternate push, pan, slam |
| NOW | 2 (8 s) | What people pay for today, and who now makes it | push, pan |
| AFTER | 2 (8–10 s) | The newest capability, then the product's own action plus the disappearance question | slam, then a fast pull-out to see the whole space |

Budget: 12–16 shots, 2–6 s each, for 60 s. For 90 s add shots, not seconds per shot.

The HOOK and AFTER shots should use **the same place and the same objects** (EP01: the same room, the same robot, the same bamboo broom). The film should close in the place where it opened.

### Ad slot (series convention)

When the episode carries a sponsor, the slot sits **just before the present-day segment**, on a hard cut between media. Mark it in the 镜头表 as a cut point; the preview cut does not include it.

## 2. Text on screen

- At most 8 characters per shot (huashu lint enforces this). Full sentences go to narration or captions.
- Text belongs to an object in that era's world, never on a floating card:
  - classical/ink: a vertical inscription with a red seal;
  - print era: a newspaper picture caption box with year, place and one line;
  - poster era: the poster's own headline banner, a TV lower-third, a price tag;
  - contemporary: a device screen, a shipping label, a sign on the wall.
- Every year, price or number on screen must appear in the evidence ledger with its source. If there is a narration script, lint with `--script` so the screen and the narration use the same number.

## 3. Media relay

See [media-relay.md](media-relay.md). The rules in short:

- **At most four media** per film. A switch happens only at an era boundary, never inside an era.
- Each switch uses the **incoming medium's signature transition**: ink blooms in, a page turns into the print era, halftone dots bloom into the poster era, an iris opens on the present.
- **One six-color palette** across all media. It is the thread that keeps a relay from reading as a collage.
- Shots inside one medium are hard cuts.

### The three-direction gate

Before production, render **one story beat** (the most visual turning point works best) in three directions, each with a different composition, not just different colors. The user chooses. EP01's three directions were a media relay (street-side engraving), one-style patent plates (object close-up with numbered callouts), and isometric flat (cutaway diorama). The user chose a four-media relay as a compromise. See `episodes/01-robot-vacuum/previews/style_directions.jpg`.

## 4. David and the lobster in motion

- **David** appears in at most two segments, always as a back, a silhouette or a distant figure inside a crowd: EP01 puts him as the young man in a flat cap among the onlookers in 1901. He never faces the camera and never explains. Code does not draw faces, so a face-to-camera David requires AI-generated frames (huashu `references/10-角色.md`); without those, keep him from behind.
- **The lobster** hides once per medium at most, small and in the gutter, on a chimney, or as part 8 of a patent plate that the legend never mentions. It may wiggle its antennae. It never points at anything.
- Hands are the best actors: a hand pushing the 1876 sweeper or a hand on the 1908 upright tells the labor story without a face.

## 5. Build

```
episodes/<nn-slug>/
  镜头表.md            storyboard + evidence ledger (lint this)
  eras_<film>.js       segment list: one segment per medium, with dur and transition
  scenes/<id>.js       one file per medium: SCENES['<id>'] = { draw(c, lt, t) }, shots via SM.shots
  previews/            contact sheets kept in the repo
  .work/ 渲染/ 静帧/ qa/ output/   rebuilt by motion/sync.sh and the renderer (git-ignored)
```

`motion/sync.sh episodes/<nn-slug>` copies the huashu engine into `.work/engine` once, then syncs the kit, scenes and manifest, and prints the render and gate commands.

### The kit (`motion/kit/scale_map_kit.js`, `window.SM`)

- `SM.cam(lt, keys, bounds)` gives pulse camera moves: hold, then push 0.28 s, pan 0.30 s, or slam 0.17 s (1.55 → 0.94 → 1.0), then hold. Pass world `bounds` whenever a shot zooms out past 1920×1080.
- `SM.shots(c, lt, [[t0, t1, fn], …])` hard-cuts between shots inside a segment.
- `SM.boiled(key, t, drawFn)` caches three seeded versions of a static layer and swaps them at 8 fps. The line work boils, so a still drawing stays alive.
- Engraving: `paper`, `hatch`, `tone`, `ink`, `solid`, `hose`, `caption`, `onlooker`, `lobsterInk`.
- Contemporary flat: `SM.F` palette, `robotSide`, `broomFlat`, `grain`. These are EP01-specific; add each new product's own object drawer here.

## 6. Pitfalls from EP01

| What went wrong | Fix |
| --- | --- |
| The camera zoomed past the drawn world and showed black edges | `SM.cam(..., bounds)` clamps the camera; give oversized worlds explicit bounds |
| Product and broom took a tenth of the frame in the first draft | Frame the subject at ≥ 50% of the shot: start zoomed (z 1.4–1.6), not wide |
| The fallen broom stuck into the floor | Rotate props around the contact point and lift the pivot as they turn |
| The closing question was unreadable after the pull-out | Let the question land and be read in close-up first; pull out afterwards |
| The isometric diorama looked like a toy model and lost historical weight | Keep isometric for explaining spaces; do not use it as a film's master style |
| An engraving's random-direction scribbles read as noise | Keep hatch lines parallel and regular (wobble ≈ 0.3 px), and vary density rather than direction |
| A crude horse drawing hurt the whole frame | Leave a weak element out (parked shafts instead of a horse) rather than draw it badly |
| The patent plate's header looked like a real patent title | Never fake a real document's title or number. Label it as Scale Map's own plate |

## 7. Gates (in order)

1. `storyboard_lint.py 镜头表.md` must be green before any code.
2. Stills of every scene at 2–3 moments go on a contact sheet. Check them against huashu's six failure modes.
3. `qa.py --project .work/engine --film <film>`.
4. An independent review agent that has seen only the film writes its notes to `审片/`.
5. `deliver.py`. A red light means no delivery: fix the problem, re-render and re-run.

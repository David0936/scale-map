# Cast: the narrative NPC and the Easter egg

Every Scale Map story has two fixed character slots. Who fills them is configured per product, not hard-coded. The series default is the `david` cast (David + the lobster); any creator can supply their own person, pet or mascot. The human-facing guide is [cast/README.md](../cast/README.md).

The character rules follow huashu-art-motion (`references/10-角色.md`, `references/角色精细度.md`): **a character is either drawn to a finished standard or does not show its face.**

## Resolve the cast first

1. Read `cast:` from the product's `product.yaml`. If it is absent, use `david`.
2. Look up `<id>/cast.yaml` in this order: the product sub-repo's `cast/`, then `$SCALE_MAP_CAST_HOME` (default `~/.config/scale-map/cast/`), then this repo's `cast/`. `tools/cast.sh list` shows what is found where.
3. Use the cast's `npc` and `egg` blocks everywhere this skill says "NPC" or "Easter egg". Use the names from the file; never fall back to David or the lobster when another cast is selected.
4. If the file is missing or `tools/cast.sh check <id>` fails, say so and continue with `route: back-only` for the NPC and no egg. Do not invent identity traits.

## The two slots

**Narrative NPC** (`npc`). A person who belongs to the depicted world and doubles as a scale figure. Not a host, lecturer or narrator. The intended feeling is "they seem to have always been there."

- Carousel: once on the cover and in one or two interior frames chosen for narrative value; no eye contact in interior frames.
- Film: at most two segments, as a back, a silhouette or one figure in a crowd, unless the cast has a frame library that passed the delivery bar.
- Keep them subordinate to the scene: distant, small, partly occluded, easy to miss. Vary pose, placement and costume by era.

**Easter egg** (`egg`). A pet, mascot or small object that adds a moment of absurdity and rewards a second viewing.

- At most once per visual style in a film; never in the hook shot or the final-question shot.
- Never explains the thesis, never points at anything, never replaces evidence.
- Independent of the NPC: never force them into the same frame.
- Do not announce its location in captions or copy; discovery is the point.

## Routes

Each slot declares one `route`:

| route | Use | Rule |
| --- | --- | --- |
| `frames` | A finished identity and a frame library exist | Composite AI-generated frames with `SM.npc` / `SM.egg`; the library must pass the delivery bar below |
| `back-only` | NPC only; no frame library | Backs, silhouettes, over-the-shoulder, hands. No face. Use the `silhouette` traits so the figure is still findable |
| `code` | Egg only; a small creature or object that reads as a silhouette | Draw with the kit functions named in `egg.draw` (one per style). No eyes, no face |
| `none` | The cast leaves this slot empty | Do not place the character |

Write the 镜头表 "角色" line to match, so huashu's lint accepts it: `帧库 <path>` for `frames`, `只出手和背影` for `back-only`, `无` when neither slot appears on screen.

Code never draws human faces and never adds faces to objects. Generic chibi figures, white-shell robots and objects with emoji faces are out regardless of route.

## Identity fidelity

- `identity` lists the traits every generation prompt must restate verbatim. When a reference image is in `refs/`, it is the identity baseline: preserve recognizable structure while adapting wardrobe, medium, lighting and pose to the era.
- When `identity` is empty or no reference image exists, do not fabricate one. Keep the NPC on `back-only` and state in the final audit that identity fidelity awaits the asset.
- Generation prompts also state the film's drawing grammar (not just a style name), the pose and camera relationship, 8-frame 4×2 sprites when motion is needed, and a `#00B140` green screen.

## Frame library format

`<cast>/frames/<action>/01.png … 08.png` plus `meta.json`, the same format as huashu's long-scroll demo:

```json
{ "frames": [{ "file": "01.png", "ax": 134, "ay": 387, "w": 246, "h": 388 }], "ref_h": 396 }
```

`ax, ay` is the foot anchor in the PNG; `ref_h` is the standing height in pixels. `motion/sync.sh` copies the libraries into the engine and registers them; frames advance at `floor(t × 9) % n` with no tweening. Use huashu's `scripts/key_split.py` to key and split generated sheets.

## Delivery bar for frame-library characters

Crop a character close-up at 2× and check all eight; record the result in the delivery notes. Anything that fails goes back to generation or drops to `back-only`.

1. The silhouette alone identifies who and what action.
2. Real anatomy: neck, shoulders, elbows, wrists; constant head-to-body ratio.
3. Hands read as hands and actually grip objects.
4. At least two tonal layers, lit from the scene's light direction.
5. At least three material details (folds, seams, hair groups, fabric texture, straps).
6. A specific expression and pose that matches what the shot is saying.
7. Same line, fill and palette as the background; not a sticker.
8. Consistent features, hair, clothing and colors in every shot.

## Rights

Only place likenesses the user owns or has rights to. No third-party IP, brand mascots or public figures' faces in a cast. Respect the cast's `rights` line. Minors are always dressed modestly.

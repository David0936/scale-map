# Scale Map Style Bible

## The cast — your NPC and your Easter egg

Every story has two character slots, filled by the product's cast (`cast:` in `product.yaml`, default `david`). Read [cast.md](cast.md) for how to resolve the cast, the three routes, identity fidelity and the delivery bar. In short:

**Narrative NPC** — the creator's IP. A person who belongs to the depicted world and doubles as an architectural scale figure: both character and measure. Not a host, lecturer, mascot or page-by-page narrator.

- Once on the cover and in only one or two interior frames, chosen for narrative value; no eye contact in interior frames.
- Subordinate to the scene: distant, small, partly occluded, easy to miss. Prefer a back, profile, reflection, half-face behind a window, or a figure on stairs over a centered portrait.
- Never the same pose, placement or costume twice across eras.
- Plausible roles: a passerby in a seventeenth-century courtyard, a young engineer carrying plans through a factory, a student sketching at the back of a Bauhaus classroom, a neighbor examining an early robot vacuum, a tiny pedestrian in a future city.

The intended feeling is not "the NPC explains history" but **"they seem to have always been there."**

**Easter egg** — the creator's pet or mascot. A small moment of absurdity and repeat-viewing pleasure.

- Independent of the NPC; never force them together.
- Never explains the thesis or replaces evidence.
- Discoverable but secondary: beside a broom, inside a machine, on a sill, facing a monumental window.
- Omit it when it weakens tone, period legibility or the main claim. Never announce where it hides.

The default cast is David (the series author) as NPC and a coral lobster as Easter egg; see [cast/david/cast.yaml](../cast/david/cast.yaml). Use the names and traits of whichever cast the product selects.

## Historical media as narrative evidence

Choose the medium according to the era and argument, not fame:

| Era or condition | Useful visual media | What the medium should reveal |
| --- | --- | --- |
| Classical / early domestic life | Painting | Housing, labor, gender roles, tools, surfaces, rituals |
| Industrial revolution | Print, patent plate, engineering drawing | Mechanism, standardization, factories, infrastructure |
| Modernism | Architectural photography, Bauhaus, graphic design | Rationalized space, hygiene, modularity, new domestic ideals |
| Consumerism | Period advertising, editorial and product photography | Aspiration, convenience, status, mass-market promises |
| Digital era | UI, industrial design, contemporary photography | Invisible software, automation, interaction, ecosystem |
| Future | AI surreal photography, speculative architecture | Need dissolving into environment, system, or infrastructure |

Do not imitate a living artist or use an artwork merely because it is recognizable. Describe observable visual properties and the historically relevant spatial or material evidence.

## Composition rules

- One frame, one claim, one dominant visual relationship.
- Give architecture, tools, bodies, and the product enough spatial logic to explain cause and effect.
- Keep captions concise enough that the image still bears the narrative load.
- Use continuity deliberately: repeated doorway, floor plane, camera angle, or object silhouette can connect eras without flattening their visual differences.
- Do not turn every frame into a crowded infographic. Use diagrams only when relationships cannot be shown more clearly through a scene.


## In motion (film)

The same rules hold when the frames move; [film-pipeline.md](film-pipeline.md) has the full pipeline.

- **The NPC** appears in at most two segments, as a back, a silhouette or one figure inside a crowd. Code-drawn animation does not draw faces; a recognizable NPC needs a frame library from the cast that passed the delivery bar in [cast.md](cast.md), otherwise keep them from behind. Place them with `SM.npc`, which falls back to your back-view drawing when the cast has no frames.
- **The Easter egg** hides at most once per style and may twitch. It is never in the hook and never in the final question shot. Place it with `SM.egg`, so a different cast needs no scene changes.
- **Hands** carry the labor story across eras: the hand pushing a sweeper, the hand on an upright vacuum's handle.
- **Media relay**: a medium changes only at an era boundary, at most four media per film, one shared six-color palette. See [media-relay.md](media-relay.md).
- **Continuity anchors** across media: the cleaning object itself, the floor line at the same height, and the opening room returning at the end.

# Joust Shallot Remake Plan

Goal: remake Williams Joust as TypeScript/Shallot app, using original assembly as spec. Target exact graphics, fixed-step physics, game rules, timing, and data behavior for final version 4.

## Locked Decisions

- Port style: source-derived TypeScript port, not emulator.
- Accuracy: pixel/logic exact at original internal resolution and fixed tick rate.
- Render path: indexed 2D framebuffer, uploaded/presented through Shallot app.
- Assets: generated from assembled source/ROM tables, not hand-redrawn PNGs.
- Behavior oracle: MAME/ROM traces where possible.
- Architecture: deterministic core independent from browser/GPU, with thin Shallot adapter.
- Project location: `shallot/examples/joust`.
- First milestone: static playfield/attract graphics pipeline.
- Sound: deferred until graphics and core gameplay stable.
- Controls: keyboard mapped to PIA-like bitfield.
- Physics: translate original movement routines instruction-by-instruction into fixed-point TS.
- Version: Joust revision 4 final release only.
- Distribution: keep generated copyrighted assets local/dev only.
- Graphics fidelity: emulate enough Williams DMA/blitter semantics for exact draw.
- Collision: original custom collision logic, not Shallot physics.
- RAM model: explicit RAM/process blocks with offsets from `RAMDEF.ASM`.
- Tests: golden checks before subsystem expansion.
- MVP: single-player wave 1.
- Shallot changes: avoid engine edits unless truly needed.

## Port Order

1. Asset extractor and framebuffer renderer.
2. Static playfield/attract render.
3. Process scheduler, timers, and RAM model.
4. Player movement, flap, gravity, platforms.
5. Enemies, eggs, waves.
6. Scoring, lives, messages.
7. Pterodactyl, lava troll, edge cases.
8. Sound.

## Milestone 1 Status

- Done: Scaffold Vite/Shallot app.
- Done: Define core constants for resolution, tick rate, palette indices.
- Done: Implement indexed framebuffer clear/set/blit primitives.
- Done: Add extractor script entrypoint.
- Done: Parse `bin/joust.lst` image pointer table and ROM-backed descriptor records.
- Done: Decode direct cliff source bytes into generated nibble rows.
- Done: Decode background DMA records, including CLIF5 top/left/right split parts.
- Done: Decode `COMCL5` through the `NEWCL5` bitstream uncompactor into 186x33 pixels.
- Done: Render deterministic static background cliffs through Shallot scheduler.
- Done: Add build script and focused golden tests.
- Done: Replace provisional screen-address mapping with verified Williams video RAM byte/nibble mapping.
- Next: Add source-derived bridge/lava background draw records.

## Open Technical Tasks

- Confirm exact visible/internal resolution from Williams hardware/MAME.
- Decode image table format from `JOUSTI.ASM`, `CLIFF*.ASM`, `LAVA.ASM`, sprite sources.
- Map palette/decoder ROM behavior to RGB.
- Create ROM/listing parser for symbol addresses.
- Add MAME trace capture path once MAME exists in environment.

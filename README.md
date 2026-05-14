# Joust

Build scripts for the Joust ROM rewrite and browser MAME output.

## Setup

Initialize submodules, rebuild/open the devcontainer, then install package dependencies:

```sh
git submodule update --init --recursive
bun install
```

The devcontainer installs the build toolchain, including ASL, `asm6809`, Emscripten, Make, and Bun. Project dependencies are installed manually by the developer.

## ROMs

```sh
bun run doctor
bun run rom
bun run rom:verify
```

`rom:verify` rebuilds generated ROM files, downloads the original Joust archive when missing, extracts it, and compares ROM contents.

## Browser MAME

```sh
bun run mame:build
bun run mame:serve
```

`mame:build` rebuilds the ROM zip, reuses existing compiled MAME JavaScript/WebAssembly outputs when present, and writes the browser bundle to `bin/mame`. Use `bun run mame:rebuild` to force a MAME rebuild.

`mame:serve` serves `bin/mame` at `http://0.0.0.0:8000/`. The generic static server is also available with `bun run server`.

## CI

Push builds publish the devcontainer image to GitHub Container Registry with the commit SHA and a moving cache tag, then run verification in a later job using that image as the job container. Pull requests run ROM verification through the devcontainer action without pushing an image, using the CI devcontainer config that omits local GPU runtime options.

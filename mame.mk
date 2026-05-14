MAME_DIRECTORY ?= mame
MAME_OUTPUT_DIRECTORY ?= $(BIN_DIRECTORY)/mame
MAME_TARGET ?= mame
MAME_SUBTARGET ?= joust
MAME_SOURCES ?= src/mame/midway/williams.cpp
MAME_WEBASSEMBLY ?= 1
MAME_EMMAKE ?= emmake
MAME_JOBS ?= $(shell nproc 2>/dev/null || echo 1)
MAME_HTTP_HOST ?= 0.0.0.0
MAME_HTTP_PORT ?= 8000
MAME_ROM_SOURCE ?= $(JOUST_REWRITE_ZIP)
MAME_CHUNK_SIZE ?= 1048576
MAME_SERVER ?= bun
MAME_SERVER_SCRIPT ?= scripts/mame-server.ts
MAME_SUBTARGET_FULL := $(subst -,_,$(MAME_SUBTARGET))
MAME_PROJECT := $(MAME_SUBTARGET_FULL)
MAME_JS := $(MAME_OUTPUT_DIRECTORY)/$(MAME_PROJECT).js
MAME_WASM := $(MAME_OUTPUT_DIRECTORY)/$(MAME_PROJECT).wasm
MAME_HTML := $(MAME_OUTPUT_DIRECTORY)/index.html
MAME_ROM := $(MAME_OUTPUT_DIRECTORY)/$(notdir $(MAME_ROM_SOURCE))
MAME_EMSCRIPTEN_OUTPUTS := $(MAME_JS) $(if $(filter 1,$(MAME_WEBASSEMBLY)),$(MAME_WASM))
MAME_BUILD_ARGS ?= \
	TARGET=$(MAME_TARGET) \
	SUBTARGET=$(MAME_SUBTARGET) \
	SOURCES=$(MAME_SOURCES) \
	WEBASSEMBLY=$(MAME_WEBASSEMBLY)

.PHONY: mame mame-build mame-emscripten mame-html mame-serve mame-clean

mame: mame-serve

mame-build: mame-emscripten mame-html $(MAME_ROM)

mame-emscripten: $(MAME_EMSCRIPTEN_OUTPUTS)

mame-html: $(MAME_HTML)

mame-serve: mame-build
	@printf 'Serving MAME at http://localhost:%s/%s\n' "$(MAME_HTTP_PORT)" "$(notdir $(MAME_HTML))"
	$(MAME_SERVER) $(MAME_SERVER_SCRIPT) --host $(MAME_HTTP_HOST) --port $(MAME_HTTP_PORT) --root $(MAME_OUTPUT_DIRECTORY)

mame-clean:
	$(MAKE) -C $(MAME_DIRECTORY) clean $(MAME_BUILD_ARGS)
	rm -rf $(MAME_OUTPUT_DIRECTORY)

$(MAME_OUTPUT_DIRECTORY):
	mkdir -p $@

$(MAME_JS) $(MAME_WASM): mame.mk | $(MAME_OUTPUT_DIRECTORY)
	set -e
	cd $(MAME_DIRECTORY)
	$(MAME_EMMAKE) $(MAKE) -j$(MAME_JOBS) $(MAME_BUILD_ARGS)
	cp -f $(MAME_PROJECT).js ../$(MAME_JS)
	if [ "$(MAME_WEBASSEMBLY)" = "1" ]; then
		cp -f $(MAME_PROJECT).wasm ../$(MAME_WASM)
	fi

$(MAME_ROM): $(MAME_ROM_SOURCE) | $(MAME_OUTPUT_DIRECTORY)
	cp -f $< $@

$(MAME_HTML): $(MAME_JS) $(MAME_ROM) mame.mk | $(MAME_OUTPUT_DIRECTORY)
	printf '%s\n' \
		'<!doctype html>' \
		'<html lang="en">' \
		'<head>' \
		'  <meta charset="utf-8">' \
		'  <link rel="icon" href="data:,">' \
		'  <title>$(MAME_PROJECT)</title>' \
		'  <style>' \
		'    html,' \
		'    body {' \
		'      margin: 0;' \
		'      width: 100%;' \
		'      height: 100%;' \
		'      background: #111;' \
		'      color: #eee;' \
		'      font-family: sans-serif;' \
		'    }' \
		'' \
		'    body {' \
		'      display: grid;' \
		'      place-items: center;' \
		'      overflow: hidden;' \
		'    }' \
		'' \
		'    canvas {' \
		'      display: block;' \
		'      aspect-ratio: 4 / 3;' \
		'      width: min(100vw, calc(100vh * 4 / 3));' \
		'      height: auto;' \
		'      max-width: 100vw;' \
		'      max-height: 100vh;' \
		'    }' \
		'  </style>' \
		'</head>' \
		'<body>' \
		'  <canvas id="canvas" tabindex="0"></canvas>' \
		'  <script>' \
		'    var Module = {' \
		'      canvas: document.getElementById("canvas"),' \
		'      arguments: ["$(MAME_SUBTARGET)", "-rompath", "/roms", "-window", "-resolution", "292x240", "-nokeepaspect"],' \
		'      preRun: [function() {' \
		'        Module.FS_createPath("/", "roms", true, true);' \
		'        Module.FS_createPreloadedFile("/roms", "$(notdir $(MAME_ROM))", "$(notdir $(MAME_ROM))", true, false);' \
		'      }]' \
		'    };' \
		'  </script>' \
		'  <script>' \
		'    (async function() {' \
		'      var wasmUrl = "$(notdir $(MAME_WASM))";' \
		'      var chunkSize = $(MAME_CHUNK_SIZE);' \
		'      var head = await fetch(wasmUrl, { method: "HEAD", cache: "no-store" });' \
		'      if (!head.ok) {' \
		'        throw new Error("Failed to inspect " + wasmUrl + ": " + head.status);' \
		'      }' \
		'      var total = Number(head.headers.get("Content-Length"));' \
		'      if (!Number.isFinite(total) || total <= 0) {' \
		'        throw new Error("Missing Content-Length for " + wasmUrl);' \
		'      }' \
		'      var binary = new Uint8Array(total);' \
		'      for (var start = 0; start < total; start += chunkSize) {' \
		'        var end = Math.min(start + chunkSize, total) - 1;' \
		'        var response = await fetch(wasmUrl, {' \
		'          cache: "no-store",' \
		'          headers: { Range: "bytes=" + start + "-" + end }' \
		'        });' \
		'        if (response.status !== 206) {' \
		'          throw new Error("Range request failed for " + wasmUrl + ": " + response.status);' \
		'        }' \
		'        binary.set(new Uint8Array(await response.arrayBuffer()), start);' \
		'      }' \
		'      Module.wasmBinary = binary;' \
		'      var script = document.createElement("script");' \
		'      script.src = "$(notdir $(MAME_JS))";' \
		'      document.body.appendChild(script);' \
		'    }()).catch(function(error) {' \
		'      console.error(error);' \
		'    });' \
		'  </script>' \
	'</body>' \
	'</html>' > $@

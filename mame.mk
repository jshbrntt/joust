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
MAME_SUBTARGET_FULL := $(subst -,_,$(MAME_SUBTARGET))
MAME_PROJECT := $(MAME_SUBTARGET_FULL)
MAME_JS := $(MAME_OUTPUT_DIRECTORY)/$(MAME_PROJECT).js
MAME_WASM := $(MAME_OUTPUT_DIRECTORY)/$(MAME_PROJECT).wasm
MAME_HTML := $(MAME_OUTPUT_DIRECTORY)/$(MAME_PROJECT).html
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
	python3 -m http.server $(MAME_HTTP_PORT) --bind $(MAME_HTTP_HOST) --directory $(MAME_OUTPUT_DIRECTORY)

mame-clean:
	$(MAKE) -C $(MAME_DIRECTORY) clean $(MAME_BUILD_ARGS)
	rm -rf $(MAME_OUTPUT_DIRECTORY)

$(MAME_OUTPUT_DIRECTORY):
	mkdir -p $@

$(MAME_JS) $(MAME_WASM): | $(MAME_OUTPUT_DIRECTORY)
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
		'  <style>html,body{margin:0;height:100%;background:#111;color:#eee;font-family:sans-serif}canvas{display:block;width:100vw;height:100vh}</style>' \
		'</head>' \
		'<body>' \
		'  <canvas id="canvas" tabindex="0"></canvas>' \
		'  <script>' \
		'    var Module = {' \
		'      canvas: document.getElementById("canvas"),' \
		'      arguments: ["$(MAME_SUBTARGET)", "-rompath", "/roms"],' \
		'      preRun: [function() {' \
		'        Module.FS_createPath("/", "roms", true, true);' \
		'        Module.FS_createPreloadedFile("/roms", "$(notdir $(MAME_ROM))", "$(notdir $(MAME_ROM))", true, false);' \
		'      }]' \
		'    };' \
		'  </script>' \
		'  <script src="$(notdir $(MAME_JS))"></script>' \
		'</body>' \
		'</html>' > $@

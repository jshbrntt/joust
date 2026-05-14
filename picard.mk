# Enable debug logging
DEBUG ?=

ifdef DEBUG
ifeq ($(MAKECMDGOALS),)
MAKECMDGOALS += default
endif
MAKECMDGOALS := debug $(MAKECMDGOALS)
endif
MAKEFLAGS += --no-print-directory$(if $(DEBUG), --debug)

PROJECT_PATH ?= $(realpath .)
PROJECT_NAME ?= $(notdir $(PROJECT_PATH))

DEV_BASE_PATH ?= /usr/src
DEV_PATH ?= $(DEV_BASE_PATH)/$(notdir $(PROJECT_PATH))
DEV_USER ?= $(shell id -u $(USER))
DEV_GROUP ?= $(shell id -g $(USER))

IMAGE_REGISTRY_HOSTNAME ?= ghcr.io
IMAGE_NAMESPACE ?= jshbrntt
IMAGE_NAME ?= $(PROJECT_NAME)
IMAGE_TAG ?= latest
IMAGE ?= $(IMAGE_REGISTRY_HOSTNAME)/$(IMAGE_NAMESPACE)/$(IMAGE_NAME):$(IMAGE_TAG)

MODE ?= $(if $(CI),ci,dev)

DOCKER ?= docker
DOCKER_COMPOSE ?= $(DOCKER) compose --file docker-compose.yaml --file docker-compose.$(MODE).yaml
DOCKER_COMPOSE_SERVICE ?= env
DOCKER_SCAN ?=

BUILDKIT_PROGRESS ?= plain
BUILDKIT_INLINE_CACHE ?= 1
MAME_PICARD_VARIABLES := \
MAME_DIRECTORY \
MAME_OUTPUT_DIRECTORY \
MAME_TARGET \
MAME_SUBTARGET \
MAME_SOURCES \
MAME_WEBASSEMBLY \
MAME_EMMAKE \
MAME_JOBS \
MAME_HTTP_HOST \
MAME_HTTP_PORT \
MAME_ROM_SOURCE \
MAME_CHUNK_SIZE \
MAME_SERVER \
MAME_SERVER_SCRIPT
MAME_PICARD_ARGS = $(foreach variable,$(MAME_PICARD_VARIABLES),$(if $($(variable)),$(variable)='$($(variable))'))

ifdef CI
	DOCKER_REGISTRY_URL ?= $(IMAGE_REGISTRY_HOSTNAME)
	DOCKER_REGISTRY_USERNAME ?= $(GITHUB_ACTOR)
	DOCKER_REGISTRY_PASSWORD ?= $(GITHUB_TOKEN)
endif

# https://www.gnu.org/software/make/manual/html_node/Special-Targets.html
.ONESHELL:
.NOTPARALLEL:
.EXPORT_ALL_VARIABLES:

ifeq ($(MAKELEVEL),0)

MAKECMDGOALS ?= notarget
.PHONY: $(MAKECMDGOALS)
$(MAKECMDGOALS):
	$(MAKE) $(if $(findstring notarget,$(MAKECMDGOALS)),,$(MAKECMDGOALS))

else

# None of these targets produce files
.PHONY: \
build \
command \
config \
debug \
default \
down \
exec \
login \
push \
require-% \
required-build-variables \
required-common-variables \
required-login-variables \
required-run-variables \
run \
scan \
shell \
mame \
mame-build \
mame-clean \
mame-emscripten \
mame-html \
mame-serve \
clean

default: $(if $(CI),rom,shell)

require-%:
	@#$(or ${$*}, $(error $* is not set))

required-login-variables: require-DOCKER_REGISTRY_URL
required-login-variables: require-DOCKER_REGISTRY_USERNAME
required-login-variables: require-DOCKER_REGISTRY_PASSWORD

login: $(if $(CI),required-login-variables)
login:
	$(if $(CI),,-)@echo $(DOCKER_REGISTRY_PASSWORD) | $(DOCKER) login --password-stdin --username $(DOCKER_REGISTRY_USERNAME) $(DOCKER_REGISTRY_URL)$(if $(CI),, 2> /dev/null)

config:
	printenv
	$(DOCKER_COMPOSE) config

debug: config

push: login
	$(DOCKER_COMPOSE) push $(DOCKER_COMPOSE_SERVICE)

required-common-variables: require-IMAGE
required-common-variables: require-DEV_PATH

required-build-variables: required-common-variables

scan:
	$(if $(DOCKER_SCAN),$(DOCKER) scan --accept-license $(IMAGE))

build: required-build-variables
build: $(if $(DOCKER_SCAN),scan)
build: login
	@$(DOCKER_COMPOSE) build --pull $(if $(NO_CACHE),--no-cache )$(DOCKER_COMPOSE_SERVICE)

exec:
	$(DOCKER_COMPOSE) exec $(DOCKER_COMPOSE_SERVICE) $(COMMAND)

required-run-variables: required-common-variables

run: build
run: required-run-variables
	$(DOCKER_COMPOSE) run --rm --service-ports $(DOCKER_COMPOSE_SERVICE) $(COMMAND)

command:
	$(MAKE) $(if $(shell $(DOCKER_COMPOSE) ps --quiet --all --status running $(DOCKER_COMPOSE_SERVICE)),exec,run)

kill:
	$(DOCKER_COMPOSE) kill

down: kill
	$(DOCKER_COMPOSE) down

shell: COMMAND := sh
shell: command

rom: COMMAND := make --keep-going
rom: command

mame: COMMAND = make mame $(MAME_PICARD_ARGS)
mame: command

mame-build: COMMAND = make mame-build $(MAME_PICARD_ARGS)
mame-build: command

mame-clean: COMMAND = make mame-clean $(MAME_PICARD_ARGS)
mame-clean: command

mame-emscripten: COMMAND = make mame-emscripten $(MAME_PICARD_ARGS)
mame-emscripten: command

mame-html: COMMAND = make mame-html $(MAME_PICARD_ARGS)
mame-html: command

mame-serve: COMMAND = make mame-serve $(MAME_PICARD_ARGS)
mame-serve: command

clean:
	git clean -xdff
	git submodule foreach --recursive git clean -xdff

endif

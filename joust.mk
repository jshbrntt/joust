BIN_DIRECTORY := bin
JOUST_ROM_DIRECTORY ?= $(BIN_DIRECTORY)/roms
JOUST_ORIGINAL_DIRECTORY ?= $(BIN_DIRECTORY)/original
JOUST_ORIGINAL_ZIP := $(JOUST_ORIGINAL_DIRECTORY)/joust.zip
# JOUST_ORIGINAL_URL := https://archive.org/download/arcade_joust/joust.zip # Gives 500 errors on some redirects
JOUST_ORIGINAL_URL := https://ia800603.us.archive.org/3/items/arcade_joust/joust.zip
JOUST_ORIGINAL_STAMP := $(JOUST_ORIGINAL_DIRECTORY)/.extracted
JOUST_ROM_FILES := \
3006-13.1b \
3006-14.2b \
3006-15.3b \
3006-16.4b \
3006-17.5b \
3006-18.6b \
3006-19.7b \
3006-20.8b \
3006-21.9b \
3006-22.10b \
3006-23.11b \
3006-24.12b \
decoder.4 \
decoder.6 \
joust.snd \
joust.sr4 \
joust.sr6 \
joust.sr7 \
joust.sr8 \
joust.sr9 \
joust.sra \
joust.srb \
joust.src \
joust.wr7 \
joust.wra
JOUST_ROM_FILES := $(addprefix $(JOUST_ROM_DIRECTORY)/,$(JOUST_ROM_FILES))
JOUST_REWRITE_ROM_FILES := \
3006-13.1b \
3006-14.2b \
3006-15.3b \
3006-16.4b \
3006-17.5b \
3006-18.6b \
3006-19.7b \
3006-20.8b \
3006-21.9b \
3006-22.10b \
3006-23.11b \
3006-24.12b
JOUST_BYTE_OFFSETS := \
0x0000-0x0FFF \
0x1000-0x1FFF \
0x2000-0x2FFF \
0x3000-0x3FFF \
0x4000-0x4FFF \
0x5000-0x5FFF \
0x6000-0x6FFF \
0x7000-0x7FFF \
0x8000-0x8FFF \
0xD000-0xDFFF \
0xE000-0xEFFF \
0xF000-0xFFFF
JOUST_REWRITE_ROM_FILES := $(addprefix $(JOUST_ROM_DIRECTORY)/,$(JOUST_REWRITE_ROM_FILES))
JOUST_REWRITE_SOUND_ROM_FILE := $(JOUST_ROM_DIRECTORY)/joust.snd
JOUST_REWRITE_DECODER_ROM_FILES := \
$(JOUST_ROM_DIRECTORY)/decoder.4 \
$(JOUST_ROM_DIRECTORY)/decoder.6
JOUST_REWRITE_ZIP := $(JOUST_ROM_DIRECTORY)/joust.zip
JOUST_REWRITE_FILES = \
$(JOUST_REWRITE_ROM_FILES) \
$(JOUST_REWRITE_DECODER_ROM_FILES) \
$(JOUST_REWRITE_SOUND_ROM_FILE) \
$(JOUSTR_REWRITE_ROM_FILES) \
$(JOUSTWR_REWRITE_ROM_FILES)
JOUST_REWRITE_ROM_PAIRS := $(join $(addsuffix |,$(JOUST_REWRITE_ROM_FILES)),$(JOUST_BYTE_OFFSETS))
JOUSTR_REWRITE_ROM_FILES := \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr4 \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr6 \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr7 \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr8 \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr9 \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sra \
$(JOUST_ROM_DIRECTORY)/joustr/joust.srb \
$(JOUST_ROM_DIRECTORY)/joustr/joust.src
JOUSTR_REWRITE_ROM_PAIRS := \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr4|0x3000-0x3FFF \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr6|0x5000-0x5FFF \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr7|0x6000-0x6FFF \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr8|0x7000-0x7FFF \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sr9|0x8000-0x8FFF \
$(JOUST_ROM_DIRECTORY)/joustr/joust.sra|0xD000-0xDFFF \
$(JOUST_ROM_DIRECTORY)/joustr/joust.srb|0xE000-0xEFFF \
$(JOUST_ROM_DIRECTORY)/joustr/joust.src|0xF000-0xFFFF
JOUSTWR_REWRITE_ROM_FILES := \
$(JOUST_ROM_DIRECTORY)/joustwr/joust.wr7 \
$(JOUST_ROM_DIRECTORY)/joustwr/joust.wra
JOUSTWR_REWRITE_ROM_PAIRS := \
$(JOUST_ROM_DIRECTORY)/joustwr/joust.wr7|0x6000-0x6FFF \
$(JOUST_ROM_DIRECTORY)/joustwr/joust.wra|0xD000-0xDFFF
JOUST_VERIFY_PARENT_ROM_PAIRS := \
'$(JOUST_ROM_DIRECTORY)/3006-13.1b|$(JOUST_ORIGINAL_DIRECTORY)/3006-13.1b' \
'$(JOUST_ROM_DIRECTORY)/3006-14.2b|$(JOUST_ORIGINAL_DIRECTORY)/3006-14.2b' \
'$(JOUST_ROM_DIRECTORY)/3006-15.3b|$(JOUST_ORIGINAL_DIRECTORY)/3006-15.3b' \
'$(JOUST_ROM_DIRECTORY)/3006-16.4b|$(JOUST_ORIGINAL_DIRECTORY)/3006-16.4b' \
'$(JOUST_ROM_DIRECTORY)/3006-17.5b|$(JOUST_ORIGINAL_DIRECTORY)/3006-17.5b' \
'$(JOUST_ROM_DIRECTORY)/3006-18.6b|$(JOUST_ORIGINAL_DIRECTORY)/3006-18.6b' \
'$(JOUST_ROM_DIRECTORY)/3006-19.7b|$(JOUST_ORIGINAL_DIRECTORY)/3006-19.7b' \
'$(JOUST_ROM_DIRECTORY)/3006-20.8b|$(JOUST_ORIGINAL_DIRECTORY)/3006-20.8b' \
'$(JOUST_ROM_DIRECTORY)/3006-21.9b|$(JOUST_ORIGINAL_DIRECTORY)/3006-21.9b' \
'$(JOUST_ROM_DIRECTORY)/3006-22.10b|$(JOUST_ORIGINAL_DIRECTORY)/3006-22.10b' \
'$(JOUST_ROM_DIRECTORY)/3006-23.11b|$(JOUST_ORIGINAL_DIRECTORY)/3006-23.11b' \
'$(JOUST_ROM_DIRECTORY)/3006-24.12b|$(JOUST_ORIGINAL_DIRECTORY)/3006-24.12b' \
'$(JOUST_REWRITE_SOUND_ROM_FILE)|$(JOUST_ORIGINAL_DIRECTORY)/joust.snd' \
'$(JOUST_ROM_DIRECTORY)/decoder.4|$(JOUST_ORIGINAL_DIRECTORY)/decoder.4' \
'$(JOUST_ROM_DIRECTORY)/decoder.6|$(JOUST_ORIGINAL_DIRECTORY)/decoder.6'
JOUSTR_VERIFY_ROM_PAIRS := \
'$(JOUST_ROM_DIRECTORY)/joustr/joust.sr4|$(JOUST_ORIGINAL_DIRECTORY)/joustr/joust.sr4' \
'$(JOUST_ROM_DIRECTORY)/joustr/joust.sr6|$(JOUST_ORIGINAL_DIRECTORY)/joustr/joust.sr6' \
'$(JOUST_ROM_DIRECTORY)/joustr/joust.sr7|$(JOUST_ORIGINAL_DIRECTORY)/joustr/joust.sr7' \
'$(JOUST_ROM_DIRECTORY)/joustr/joust.sr8|$(JOUST_ORIGINAL_DIRECTORY)/joustr/joust.sr8' \
'$(JOUST_ROM_DIRECTORY)/joustr/joust.sr9|$(JOUST_ORIGINAL_DIRECTORY)/joustr/joust.sr9' \
'$(JOUST_ROM_DIRECTORY)/joustr/joust.sra|$(JOUST_ORIGINAL_DIRECTORY)/joustr/joust.sra' \
'$(JOUST_ROM_DIRECTORY)/joustr/joust.srb|$(JOUST_ORIGINAL_DIRECTORY)/joustr/joust.srb' \
'$(JOUST_ROM_DIRECTORY)/joustr/joust.src|$(JOUST_ORIGINAL_DIRECTORY)/joustr/joust.src'
JOUSTWR_VERIFY_ROM_PAIRS := \
'$(JOUST_ROM_DIRECTORY)/joustwr/joust.wr7|$(JOUST_ORIGINAL_DIRECTORY)/joustwr/joust.wr7' \
'$(JOUST_ROM_DIRECTORY)/joustwr/joust.wra|$(JOUST_ORIGINAL_DIRECTORY)/joustwr/joust.wra'
JOUST_ZIP_VERIFY_ROM_PAIRS := \
'$(JOUST_ROM_DIRECTORY)/joust.zip|$(JOUST_ORIGINAL_DIRECTORY)/joust.zip'
ZIP_EXTENSION := zip
BIN_EXTENSION := bin
JOUST := joust
JOUSTR := joustr
JOUSTY := jousty
JOUST_VERSIONS := $(JOUST) $(JOUSTR) $(JOUSTY)
JOUST_PATHS := $(addprefix $(JOUST_ROM_DIRECTORY)/,$(JOUST_VERSIONS))
JOUST_ZIPS := $(addsuffix .$(ZIP_EXTENSION),$(JOUST_PATHS))
JOUST_BINS := $(addsuffix .$(BIN_EXTENSION),$(JOUST_PATHS))
CACHE_DIRECTORY := cache
SRC_ORIGINAL_DIRECTORY := src/original
SRC_REWRITE_DIRECTORY := src/rewrite
SRC_EXTENSION := SRC
OBJ_EXTENSION := O
LST_EXTENSION := LST
SRCS := $(wildcard $(SRC_ORIGINAL_DIRECTORY)/*.$(SRC_EXTENSION))
OBJS := $(patsubst $(SRC_ORIGINAL_DIRECTORY)/%.$(SRC_EXTENSION),$(BIN_DIRECTORY)/%.$(OBJ_EXTENSION),$(SRCS))
LSTS := $(patsubst $(SRC_ORIGINAL_DIRECTORY)/%.$(SRC_EXTENSION),$(BIN_DIRECTORY)/%.$(LST_EXTENSION),$(SRCS))
JOUST_REWRITE_PROGRAM_SOURCES := \
$(SRC_REWRITE_DIRECTORY)/make.ASM \
$(SRC_REWRITE_DIRECTORY)/JOUSTI.ASM \
$(SRC_REWRITE_DIRECTORY)/TB12REV3.ASM \
$(SRC_REWRITE_DIRECTORY)/RAMDEF.ASM \
$(SRC_REWRITE_DIRECTORY)/EQU.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSEQU.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSEQU2.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSAGE.ASM \
$(SRC_REWRITE_DIRECTORY)/PHRASE.ASM \
$(SRC_REWRITE_DIRECTORY)/ATT.ASM \
$(SRC_REWRITE_DIRECTORY)/SYSTEM.ASM \
$(SRC_REWRITE_DIRECTORY)/JOUSTRV4.ASM \
$(SRC_REWRITE_DIRECTORY)/T12REV3.ASM \
$(SRC_REWRITE_DIRECTORY)/joust_mods.ASM
JOUSTR_REWRITE_PROGRAM_SOURCES := \
$(SRC_REWRITE_DIRECTORY)/make_rv1.ASM \
$(SRC_REWRITE_DIRECTORY)/JOUSTI.ASM \
$(SRC_REWRITE_DIRECTORY)/TB12REV1.ASM \
$(SRC_REWRITE_DIRECTORY)/RAMDEF.ASM \
$(SRC_REWRITE_DIRECTORY)/EQU.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSEQU.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSEQU2.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSAGE.ASM \
$(SRC_REWRITE_DIRECTORY)/PHRASE.ASM \
$(SRC_REWRITE_DIRECTORY)/ATT.ASM \
$(SRC_REWRITE_DIRECTORY)/SYSTEM.ASM \
$(SRC_REWRITE_DIRECTORY)/JOUSTRV1.ASM \
$(SRC_REWRITE_DIRECTORY)/T12REV1.ASM \
$(SRC_REWRITE_DIRECTORY)/joust_mods.ASM
JOUSTWR_REWRITE_PROGRAM_SOURCES := \
$(SRC_REWRITE_DIRECTORY)/make_rv2.ASM \
$(SRC_REWRITE_DIRECTORY)/JOUSTI.ASM \
$(SRC_REWRITE_DIRECTORY)/TB12REV3.ASM \
$(SRC_REWRITE_DIRECTORY)/RAMDEF.ASM \
$(SRC_REWRITE_DIRECTORY)/EQU.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSEQU.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSEQU2.ASM \
$(SRC_REWRITE_DIRECTORY)/MESSAGE.ASM \
$(SRC_REWRITE_DIRECTORY)/PHRASE.ASM \
$(SRC_REWRITE_DIRECTORY)/ATT.ASM \
$(SRC_REWRITE_DIRECTORY)/SYSTEM.ASM \
$(SRC_REWRITE_DIRECTORY)/JOUSTRV2.ASM \
$(SRC_REWRITE_DIRECTORY)/T12REV3.ASM \
$(SRC_REWRITE_DIRECTORY)/joust_mods.ASM

.ONESHELL:

# .PHONY: all
# all: $(if $(filter 1,$(shell sha1sum -cs $(CACHE_DIRECTORY)/$(notdir $(SRC_ORIGINAL_DIRECTORY)).sha1sum ; echo $$?)),$(CACHE_DIRECTORY) $(OBJS) $(LSTS))

# $(BIN_DIRECTORY):
# 	mkdir -p $(BIN_DIRECTORY)

# $(JOUST_ROM_DIRECTORY):
# 	mkdir -p $(JOUST_ROM_DIRECTORY)

# $(BIN_DIRECTORY)/joust.p: $(BIN_DIRECTORY) $(SRC_REWRITE_DIRECTORY)/make.ASM
# 	asl $(SRC_REWRITE_DIRECTORY)/make.ASM -o $(BIN_DIRECTORY)/joust.p

# $(JOUST_REWRITE_ROM_FILES): $(JOUST_ROM_DIRECTORY) $(BIN_DIRECTORY)/joust.p
# 	p2bin $(BIN_DIRECTORY)/joust.p $@ -l 00 -r $(word $(call pos,$@,$(JOUST_REWRITE_ROM_FILES)),$(JOUST_BYTE_OFFSETS))

.PHONY: build clean download verify

verify: build download
	@set -e
	green="$$(printf '\033[32m')"
	red="$$(printf '\033[31m')"
	reset="$$(printf '\033[0m')"
	verify_group() {
		group="$$1"
		shift
		printf "%s\n" "$$group"
		for pair in "$$@"; do
			built="$${pair%%|*}"
			original="$${pair#*|}"
			built_sha="$$(sha1sum "$$built")"
			original_sha="$$(sha1sum "$$original")"
			built_sha="$${built_sha%% *}"
			original_sha="$${original_sha%% *}"
			built_name="$${built#$(JOUST_ROM_DIRECTORY)/}"
			if [ "$$built_sha" != "$$original_sha" ]; then
				printf "  %sFAIL%s %s\n" "$$red" "$$reset" "$$built_name"
				printf "    built:    %s\n" "$$built_sha"
				printf "    original: %s (%s)\n" "$$original_sha" "$$original"
				return 1
			fi
			printf "  %sOK%s   %s\n" "$$green" "$$reset" "$$built_name"
		done
	}
	verify_group "joust (green label)" $(JOUST_VERIFY_PARENT_ROM_PAIRS)
	verify_group "joustr (red label)" $(JOUSTR_VERIFY_ROM_PAIRS)
	verify_group "joustwr (white/red label)" $(JOUSTWR_VERIFY_ROM_PAIRS)
	verify_group "joust.zip (all labels)" $(JOUST_ZIP_VERIFY_ROM_PAIRS)

build: $(JOUST_REWRITE_ZIP) $(JOUSTR_REWRITE_ROM_FILES) $(JOUSTWR_REWRITE_ROM_FILES)

download: $(JOUST_ORIGINAL_STAMP)

clean:
	rm -rf $(BIN_DIRECTORY) $(JOUST_ROM_DIRECTORY)

$(BIN_DIRECTORY) $(JOUST_ROM_DIRECTORY) $(JOUST_ORIGINAL_DIRECTORY):
	mkdir -p $@

$(JOUST_ROM_DIRECTORY)/joustr $(JOUST_ROM_DIRECTORY)/joustwr: | $(JOUST_ROM_DIRECTORY)
	mkdir -p $@

$(JOUST_ORIGINAL_ZIP): | $(JOUST_ORIGINAL_DIRECTORY)
	curl --fail --location --retry 5 --retry-delay 2 --retry-all-errors --output $@ $(JOUST_ORIGINAL_URL)

$(JOUST_ORIGINAL_STAMP): $(JOUST_ORIGINAL_ZIP) | $(JOUST_ORIGINAL_DIRECTORY)
	unzip -o -q $< -d $(JOUST_ORIGINAL_DIRECTORY)
	touch $@

$(BIN_DIRECTORY)/joust.p $(BIN_DIRECTORY)/joust.lst: $(JOUST_REWRITE_PROGRAM_SOURCES) | $(BIN_DIRECTORY)
	asl $(SRC_REWRITE_DIRECTORY)/make.ASM -L -olist $(BIN_DIRECTORY)/joust.lst -o $(BIN_DIRECTORY)/joust.p

define JOUST_REWRITE_ROM_RULE
$(word 1,$(subst |, ,$(1))): $(BIN_DIRECTORY)/joust.p | $(JOUST_ROM_DIRECTORY)
	p2bin $$< $$@ -l 00 -r $(word 2,$(subst |, ,$(1)))
endef

$(foreach rom_pair,$(JOUST_REWRITE_ROM_PAIRS),$(eval $(call JOUST_REWRITE_ROM_RULE,$(rom_pair))))

$(BIN_DIRECTORY)/joustr.p $(BIN_DIRECTORY)/joustr.lst: $(JOUSTR_REWRITE_PROGRAM_SOURCES) | $(BIN_DIRECTORY)
	asl $(SRC_REWRITE_DIRECTORY)/make_rv1.ASM -L -olist $(BIN_DIRECTORY)/joustr.lst -o $(BIN_DIRECTORY)/joustr.p

define JOUSTR_REWRITE_ROM_RULE
$(word 1,$(subst |, ,$(1))): $(BIN_DIRECTORY)/joustr.p | $(JOUST_ROM_DIRECTORY)/joustr
	p2bin $$< $$@ -l 00 -r $(word 2,$(subst |, ,$(1)))
endef

$(foreach rom_pair,$(JOUSTR_REWRITE_ROM_PAIRS),$(eval $(call JOUSTR_REWRITE_ROM_RULE,$(rom_pair))))

$(BIN_DIRECTORY)/joustwr.p $(BIN_DIRECTORY)/joustwr.lst: $(JOUSTWR_REWRITE_PROGRAM_SOURCES) | $(BIN_DIRECTORY)
	asl $(SRC_REWRITE_DIRECTORY)/make_rv2.ASM -L -olist $(BIN_DIRECTORY)/joustwr.lst -o $(BIN_DIRECTORY)/joustwr.p

define JOUSTWR_REWRITE_ROM_RULE
$(word 1,$(subst |, ,$(1))): $(BIN_DIRECTORY)/joustwr.p | $(JOUST_ROM_DIRECTORY)/joustwr
	p2bin $$< $$@ -l 00 -r $(word 2,$(subst |, ,$(1)))
endef

$(foreach rom_pair,$(JOUSTWR_REWRITE_ROM_PAIRS),$(eval $(call JOUSTWR_REWRITE_ROM_RULE,$(rom_pair))))

$(BIN_DIRECTORY)/vsndrm4.p $(BIN_DIRECTORY)/vsndrm4.lst: $(SRC_REWRITE_DIRECTORY)/VSNDRM4.ASM | $(BIN_DIRECTORY)
	asl $< -L -olist $(BIN_DIRECTORY)/vsndrm4.lst -o $(BIN_DIRECTORY)/vsndrm4.p

$(JOUST_REWRITE_SOUND_ROM_FILE): $(BIN_DIRECTORY)/vsndrm4.p | $(JOUST_ROM_DIRECTORY)
	p2bin $< $@ -l 00 -r 0xF000-0xFFFF

$(BIN_DIRECTORY)/decoder.p $(BIN_DIRECTORY)/decoder.lst: $(SRC_REWRITE_DIRECTORY)/decoder_roms.asm | $(BIN_DIRECTORY)
	asl $< -L -olist $(BIN_DIRECTORY)/decoder.lst -o $(BIN_DIRECTORY)/decoder.p

$(JOUST_ROM_DIRECTORY)/decoder.4: $(BIN_DIRECTORY)/decoder.p | $(JOUST_ROM_DIRECTORY)
	p2bin $< $@ -r 0x0000-0x01FF

$(JOUST_ROM_DIRECTORY)/decoder.6: $(BIN_DIRECTORY)/decoder.p | $(JOUST_ROM_DIRECTORY)
	p2bin $< $@ -r 0x0200-0x03FF

$(JOUST_REWRITE_ZIP): $(JOUST_REWRITE_FILES) | $(JOUST_ROM_DIRECTORY)
	rm -f $@
	cd $(JOUST_ROM_DIRECTORY)
	zip $(notdir $@) \
		$(notdir $(JOUST_REWRITE_ROM_FILES)) \
		$(notdir $(JOUST_REWRITE_DECODER_ROM_FILES)) \
		$(notdir $(JOUST_REWRITE_SOUND_ROM_FILE)) \
		$(patsubst $(JOUST_ROM_DIRECTORY)/%,%,$(JOUSTR_REWRITE_ROM_FILES)) \
		$(patsubst $(JOUST_ROM_DIRECTORY)/%,%,$(JOUSTWR_REWRITE_ROM_FILES))

# .PHONY: rewrite
# rewrite: $(JOUST_REWRITE_ROM_FILES)

# ASM6809 := asm6809
# $(BIN_DIRECTORY)/%.$(LST_EXTENSION) $(BIN_DIRECTORY)/%.$(OBJ_EXTENSION): $(SRC_ORIGINAL_DIRECTORY)/%.$(SRC_EXTENSION)
# 	mkdir -p $(@D)
# 	$(ASM6809) $< --output=$@ --listing=$(@:.$(OBJ_EXTENSION)=.$(LST_EXTENSION)) || true

# JOUST_ROM_URL := https://archive.org/download/ArcadeMachinesChampionCollection2/Champion%20Collection%20-%20Arcade%20%28H-L%29.zip/joust.zip
# JOUST_ZIP_FILE := joust.zip
# $(JOUST_ROM_FILES):
# 	curl \
# 	--silent \
# 	--show-error \
# 	--location \
# 	--output $(JOUST_ZIP_FILE) \
# 	$(JOUST_ROM_URL)
# 	unzip -j -x $(JOUST_ZIP_FILE) -d $(JOUST_ROM_DIRECTORY)
# 	rm $(JOUST_ZIP_FILE)
# 	sha1sum -c roms.sha1sum

# $(JOUST_ROM_DIRECTORY)/$(JOUST).$(ZIP_EXTENSION): $(JOUST_ROM_FILES)
# 	zip \
# 	$@ \
# 	$(addprefix $(JOUST_ROM_DIRECTORY)/,\
# 	3006-22.10b \
# 	3006-23.11b \
# 	3006-24.12b \
# 	3006-13.1b \
# 	3006-14.2b \
# 	3006-15.3b \
# 	3006-16.4b \
# 	3006-17.5b \
# 	3006-18.6b \
# 	3006-19.7b \
# 	3006-20.8b \
# 	3006-21.9b \
# 	joust.snd \
# 	decoder.4 \
# 	decoder.6)

# $(JOUST_ROM_DIRECTORY)/$(JOUST).$(BIN_EXTENSION): $(JOUST_ROM_FILES)
# 	cat \
# 	$(addprefix $(JOUST_ROM_DIRECTORY)/,\
# 	3006-22.10b \
# 	3006-23.11b \
# 	3006-24.12b \
# 	3006-13.1b \
# 	3006-14.2b \
# 	3006-15.3b \
# 	3006-16.4b \
# 	3006-17.5b \
# 	3006-18.6b \
# 	3006-19.7b \
# 	3006-20.8b \
# 	3006-21.9b \
# 	joust.snd \
# 	decoder.4 \
# 	decoder.6) > $@

# $(JOUST_ROM_DIRECTORY)/$(JOUSTY).$(ZIP_EXTENSION): $(JOUST_ROM_FILES)
# 	zip \
# 	$@ \
# 	$(addprefix $(JOUST_ROM_DIRECTORY)/,\
# 	joust.wra \
# 	3006-23.11b \
# 	3006-24.12b \
# 	3006-13.1b \
# 	3006-14.2b \
# 	3006-15.3b \
# 	3006-16.4b \
# 	3006-17.5b \
# 	3006-18.6b \
# 	joust.wr7 \
# 	3006-20.8b \
# 	3006-21.9b \
# 	joust.snd \
# 	decoder.4 \
# 	decoder.6)

# $(JOUST_ROM_DIRECTORY)/$(JOUSTY).$(BIN_EXTENSION): $(JOUST_ROM_FILES)
# 	cat \
# 	$(addprefix $(JOUST_ROM_DIRECTORY)/,\
# 	joust.wra \
# 	3006-23.11b \
# 	3006-24.12b \
# 	3006-13.1b \
# 	3006-14.2b \
# 	3006-15.3b \
# 	3006-16.4b \
# 	3006-17.5b \
# 	3006-18.6b \
# 	joust.wr7 \
# 	3006-20.8b \
# 	3006-21.9b \
# 	joust.snd \
# 	decoder.4 \
# 	decoder.6) > $@

# $(JOUST_ROM_DIRECTORY)/$(JOUSTR).$(ZIP_EXTENSION): $(JOUST_ROM_FILES)
# 	zip \
# 	$@ \
# 	$(addprefix $(JOUST_ROM_DIRECTORY)/,\
# 	joust.sra \
# 	joust.srb \
# 	joust.src \
# 	3006-13.1b \
# 	3006-14.2b \
# 	3006-15.3b \
# 	joust.sr4 \
# 	3006-17.5b \
# 	joust.sr6 \
# 	joust.sr7 \
# 	joust.sr8 \
# 	joust.sr9 \
# 	joust.snd \
# 	decoder.4 \
# 	decoder.6)

# $(JOUST_ROM_DIRECTORY)/$(JOUSTR).$(BIN_EXTENSION): $(JOUST_ROM_FILES)
# 	cat \
# 	$(addprefix $(JOUST_ROM_DIRECTORY)/,\
# 	joust.sra \
# 	joust.srb \
# 	joust.src \
# 	3006-13.1b \
# 	3006-14.2b \
# 	3006-15.3b \
# 	joust.sr4 \
# 	3006-17.5b \
# 	joust.sr6 \
# 	joust.sr7 \
# 	joust.sr8 \
# 	joust.sr9 \
# 	joust.snd \
# 	decoder.4 \
# 	decoder.6) > $@

# $(JOUST_ROM_DIRECTORY): $(JOUST_ZIPS) $(JOUST_BINS)

# .PHONY: clean-%
# clean-%:
# 	rm -rf $*

# $(JOUST_ROM_DIRECTORY).sha1sum: $(JOUST_ROM_FILES)
# $(JOUST_ROM_DIRECTORY).sha1sum: clean-$(JOUST_ROM_DIRECTORY).sha1sum
# 	sha1sum $(addprefix $(JOUST_ROM_DIRECTORY)/,3006-*.?b decoder.* joust.s* joust.w*) > $(JOUST_ROM_DIRECTORY).sha1sum

# $(CACHE_DIRECTORY)/$(notdir $(SRC_ORIGINAL_DIRECTORY)).sha1sum: clean-$(CACHE_DIRECTORY)
# 	mkdir -p cache
# 	sha1sum $(addprefix $(SRC_ORIGINAL_DIRECTORY)/,*) > $(CACHE_DIRECTORY)/$(notdir $(SRC_ORIGINAL_DIRECTORY)).sha1sum

# $(CACHE_DIRECTORY): $(CACHE_DIRECTORY)/$(notdir $(SRC_ORIGINAL_DIRECTORY)).sha1sum

# .PHONY: clean
# clean: clean-$(BIN_DIRECTORY)
# clean: clean-$(CACHE_DIRECTORY)
# clean: clean-$(JOUST_ROM_DIRECTORY)

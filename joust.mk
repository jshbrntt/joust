BIN_DIRECTORY := bin
JOUST_ROM_DIRECTORY ?= $(BIN_DIRECTORY)/roms
JOUST_ORIGINAL_DIRECTORY ?= $(BIN_DIRECTORY)/original
JOUST_ORIGINAL_ZIP := $(JOUST_ORIGINAL_DIRECTORY)/joust.zip
JOUST_ORIGINAL_URL := https://archive.org/download/arcade_joust/joust.zip
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
joust_rom_1b_3006-13.e4 \
joust_rom_2b_3006-14.c4 \
joust_rom_3b_3006-15.a4 \
joust_rom_4b_3006-16.e5 \
joust_rom_5b_3006-17.c5 \
joust_rom_6b_3006-18.a5 \
joust_rom_7b_3006-19.e6 \
joust_rom_8b_3006-20.c6 \
joust_rom_9b_3006-21.a6 \
joust_rom_10b_3006-22.a7 \
joust_rom_11b_3006-23.c7 \
joust_rom_12b_3006-24.e7
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
JOUST_REWRITE_SOUND_ROM_FILE := $(JOUST_ROM_DIRECTORY)/video_sound_rom_4_std_780.ic12
JOUST_REWRITE_DECODER_ROM_FILES := \
$(JOUST_ROM_DIRECTORY)/decoder_rom_4.3g \
$(JOUST_ROM_DIRECTORY)/decoder_rom_6.3c
JOUST_REWRITE_ZIP := $(JOUST_ROM_DIRECTORY)/joust.zip
JOUST_REWRITE_FILES := \
$(JOUST_REWRITE_ROM_FILES) \
$(JOUST_REWRITE_SOUND_ROM_FILE) \
$(JOUST_REWRITE_DECODER_ROM_FILES)
JOUST_REWRITE_ROM_PAIRS := $(join $(addsuffix |,$(JOUST_REWRITE_ROM_FILES)),$(JOUST_BYTE_OFFSETS))
JOUST_VERIFY_ROM_PAIRS := \
'$(JOUST_ROM_DIRECTORY)/joust_rom_1b_3006-13.e4|$(JOUST_ORIGINAL_DIRECTORY)/3006-13.1b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_2b_3006-14.c4|$(JOUST_ORIGINAL_DIRECTORY)/3006-14.2b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_3b_3006-15.a4|$(JOUST_ORIGINAL_DIRECTORY)/3006-15.3b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_4b_3006-16.e5|$(JOUST_ORIGINAL_DIRECTORY)/3006-16.4b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_5b_3006-17.c5|$(JOUST_ORIGINAL_DIRECTORY)/3006-17.5b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_6b_3006-18.a5|$(JOUST_ORIGINAL_DIRECTORY)/3006-18.6b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_7b_3006-19.e6|$(JOUST_ORIGINAL_DIRECTORY)/3006-19.7b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_8b_3006-20.c6|$(JOUST_ORIGINAL_DIRECTORY)/3006-20.8b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_9b_3006-21.a6|$(JOUST_ORIGINAL_DIRECTORY)/3006-21.9b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_10b_3006-22.a7|$(JOUST_ORIGINAL_DIRECTORY)/3006-22.10b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_11b_3006-23.c7|$(JOUST_ORIGINAL_DIRECTORY)/3006-23.11b' \
'$(JOUST_ROM_DIRECTORY)/joust_rom_12b_3006-24.e7|$(JOUST_ORIGINAL_DIRECTORY)/3006-24.12b' \
'$(JOUST_REWRITE_SOUND_ROM_FILE)|$(JOUST_ORIGINAL_DIRECTORY)/joust.snd' \
'$(JOUST_ROM_DIRECTORY)/decoder_rom_4.3g|$(JOUST_ORIGINAL_DIRECTORY)/decoder.4' \
'$(JOUST_ROM_DIRECTORY)/decoder_rom_6.3c|$(JOUST_ORIGINAL_DIRECTORY)/decoder.6'
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
	for pair in $(JOUST_VERIFY_ROM_PAIRS); do
		built="$${pair%%|*}"
		original="$${pair#*|}"
		echo "Verifying $$built against $$original"
		built_sha="$$(sha1sum "$$built")"
		original_sha="$$(sha1sum "$$original")"
		built_sha="$${built_sha%% *}"
		original_sha="$${original_sha%% *}"
		if [ "$$built_sha" != "$$original_sha" ]; then
			echo "SHA1 mismatch: $$built"
			echo "  built:    $$built_sha"
			echo "  original: $$original_sha ($$original)"
			exit 1
		fi
		echo "OK $$built"
	done

build: $(JOUST_REWRITE_ZIP)

download: $(JOUST_ORIGINAL_STAMP)

clean:
	rm -rf $(BIN_DIRECTORY) $(JOUST_ROM_DIRECTORY)

$(BIN_DIRECTORY) $(JOUST_ROM_DIRECTORY) $(JOUST_ORIGINAL_DIRECTORY):
	mkdir -p $@

$(JOUST_ORIGINAL_ZIP): | $(JOUST_ORIGINAL_DIRECTORY)
	curl --fail --location --output $@ $(JOUST_ORIGINAL_URL)

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

$(BIN_DIRECTORY)/vsndrm4.p $(BIN_DIRECTORY)/vsndrm4.lst: $(SRC_REWRITE_DIRECTORY)/VSNDRM4.ASM | $(BIN_DIRECTORY)
	asl $< -L -olist $(BIN_DIRECTORY)/vsndrm4.lst -o $(BIN_DIRECTORY)/vsndrm4.p

$(JOUST_REWRITE_SOUND_ROM_FILE): $(BIN_DIRECTORY)/vsndrm4.p | $(JOUST_ROM_DIRECTORY)
	p2bin $< $@ -l 00 -r 0xF000-0xFFFF

$(BIN_DIRECTORY)/decoder.p $(BIN_DIRECTORY)/decoder.lst: $(SRC_REWRITE_DIRECTORY)/decoder_roms.asm | $(BIN_DIRECTORY)
	asl $< -L -olist $(BIN_DIRECTORY)/decoder.lst -o $(BIN_DIRECTORY)/decoder.p

$(JOUST_ROM_DIRECTORY)/decoder_rom_4.3g: $(BIN_DIRECTORY)/decoder.p | $(JOUST_ROM_DIRECTORY)
	p2bin $< $@ -r 0x0000-0x01FF

$(JOUST_ROM_DIRECTORY)/decoder_rom_6.3c: $(BIN_DIRECTORY)/decoder.p | $(JOUST_ROM_DIRECTORY)
	p2bin $< $@ -r 0x0200-0x03FF

$(JOUST_REWRITE_ZIP): $(JOUST_REWRITE_FILES) | $(JOUST_ROM_DIRECTORY)
	rm -f $@
	zip $@ $^

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

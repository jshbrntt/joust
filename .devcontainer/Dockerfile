FROM alpine:latest

ARG BUN_VERSION=1.3.12
ARG EMSCRIPTEN_VERSION=5.0.7
ARG TARGETARCH

ENV EMSDK=/opt/emsdk
ENV PATH="/opt/emsdk:/opt/emsdk/upstream/emscripten:/root/.bun/bin:${PATH}"

RUN printf 'export EMSDK=/opt/emsdk\nexport PATH="/opt/emsdk:/opt/emsdk/upstream/emscripten:/root/.bun/bin:$PATH"\n' \
  > /etc/profile.d/emsdk.sh

RUN apk add --no-cache \
  autoconf \
  automake \
  bash \
  build-base \
  byacc \
  ca-certificates \
  cmake \
  curl \
  flex \
  gcompat \
  git \
  libgcc \
  libstdc++ \
  linux-headers \
  make \
  ninja \
  nodejs \
  pkgconf \
  python3 \
  tar \
  unzip \
  xz \
  zlib-dev

WORKDIR /tmp/asl
COPY tools/asl .
RUN case "${TARGETARCH:-$(uname -m)}" in \
    amd64|x86_64) cp Makefile.def-samples/Makefile.def-x86_64-unknown-linux Makefile.def ;; \
    arm64|aarch64) cp Makefile.def-samples/Makefile.def-arm-apple-linux Makefile.def ;; \
    *) sed 's/ -march=[^ ]*//' Makefile.def-samples/Makefile.def-x86_64-unknown-linux > Makefile.def ;; \
  esac \
  && make binaries \
  && cp asl plist alink pbind p2hex p2bin /usr/local/bin/ \
  && rm -rf /tmp/asl

WORKDIR /tmp/asm6809
COPY tools/asm6809 .
RUN sed -i '/#include "grammar.h"/a #include <ctype.h>' src/eval.c \
  && sed -i '/#include "slist.h"/a #include <stdlib.h>' src/grammar.y \
  && ./autogen.sh \
  && ./configure \
  && make \
  && cp src/asm6809 /usr/local/bin/asm6809 \
  && rm -rf /tmp/asm6809

WORKDIR /opt/emsdk
COPY tools/emsdk .
RUN ./emsdk install "${EMSCRIPTEN_VERSION}" \
  && ./emsdk activate "${EMSCRIPTEN_VERSION}" \
  && sed -i "s#^NODE_JS = .*#NODE_JS = ['/usr/bin/node']#" /opt/emsdk/.emscripten \
  && chmod 777 /opt/emsdk/upstream/emscripten \
  && chmod -R 777 /opt/emsdk/upstream/emscripten/cache \
  && printf 'int main() { return 0; }\n' > /tmp/hello.c \
  && /opt/emsdk/upstream/emscripten/emcc -c /tmp/hello.c -o /tmp/hello.o \
  && rm -f /tmp/hello.c /tmp/hello.o

RUN case "$(uname -m)" in \
    x86_64) bun_arch=x64 ;; \
    aarch64) bun_arch=aarch64 ;; \
    *) echo "Unsupported Bun architecture: $(uname -m)" >&2; exit 1 ;; \
  esac \
  && curl --fail --location "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-${bun_arch}-musl.zip" -o /tmp/bun.zip \
  && mkdir -p /tmp/bun \
  && unzip -q /tmp/bun.zip -d /tmp/bun \
  && cp /tmp/bun/bun-linux-${bun_arch}-musl/bun /usr/local/bin/bun \
  && chmod +x /usr/local/bin/bun \
  && rm -rf /tmp/bun /tmp/bun.zip

WORKDIR /workspaces/joust

ARG EMSDK_IMAGE=emscripten/emsdk:3.1.35
FROM ${EMSDK_IMAGE} AS emsdk

FROM alpine:3.17.3@sha256:124c7d2707904eea7431fffe91522a01e5a861a624ee31d03372cc1d138a3126 AS base

FROM base AS asl

RUN apk add --no-cache \
gcc \
make \
musl-dev

WORKDIR /usr/src/asl

COPY asl .

COPY asl/Makefile.def-samples/Makefile.def-x86_64-unknown-linux Makefile.def

RUN make binaries

RUN ln -s /usr/src/asl/asl /usr/local/bin/asl
RUN ln -s /usr/src/asl/plist /usr/local/bin/plist
RUN ln -s /usr/src/asl/alink /usr/local/bin/alink
RUN ln -s /usr/src/asl/pbind /usr/local/bin/pbind
RUN ln -s /usr/src/asl/p2hex /usr/local/bin/p2hex
RUN ln -s /usr/src/asl/p2bin /usr/local/bin/p2bin

FROM base AS asm6809

RUN apk add --no-cache \
autoconf \
automake \
byacc \
curl \
flex \
gcc \
make \
musl-dev

WORKDIR /usr/src/asm6809

COPY asm6809 .

RUN ./autogen.sh \
&& ./configure \
&& make

RUN ln -s /usr/src/asm6809/src/asm6809 /usr/local/bin/asm6809

FROM base AS env

RUN apk add --no-cache \
bash \
curl \
gcc \
g++ \
git \
make \
musl-dev \
python3 \
zlib \
zip

COPY --from=emsdk /emsdk /emsdk
COPY --from=emsdk /lib/x86_64-linux-gnu /lib/x86_64-linux-gnu
COPY --from=emsdk /lib64 /lib64

ENV EMSDK=/emsdk
ENV PATH=/emsdk:/emsdk/upstream/emscripten:/emsdk/upstream/bin:/emsdk/node/14.18.2_64bit/bin:${PATH}

COPY --from=asm6809 /usr/src/asm6809/src/asm6809 /usr/local/bin/asm6809
COPY --from=asl /usr/src/asl/asl /usr/local/bin/asl
COPY --from=asl /usr/src/asl/plist /usr/local/bin/plist
COPY --from=asl /usr/src/asl/alink /usr/local/bin/alink
COPY --from=asl /usr/src/asl/pbind /usr/local/bin/pbind
COPY --from=asl /usr/src/asl/p2hex /usr/local/bin/p2hex
COPY --from=asl /usr/src/asl/p2bin /usr/local/bin/p2bin

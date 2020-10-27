# syntax = docker/dockerfile:experimental
FROM    node:12-alpine AS install-production

WORKDIR /workspace
ENV     NODE_ENV production

COPY    package.json .
COPY    yarn.lock .
RUN     yarn install --production

###

FROM    node:12-alpine AS install-develop

WORKDIR /workspace

RUN     apk add --no-cache build-base pkgconfig libtool automake autoconf nasm zlib-dev
COPY    --from=install-production /workspace/node_modules node_modules
COPY    package.json .
COPY    yarn.lock .
RUN     yarn install

###

FROM    node:12-alpine AS build-client

WORKDIR /workspace
ENV     NODE_ENV production

COPY    --from=install-develop /workspace/node_modules node_modules
COPY    babel.config.js .
COPY    .eslintrc.strict.json .
COPY    .eslintrc.json .
COPY    .prettierrc .
COPY    webpack webpack
COPY    config.json .
COPY    package.json .
COPY    src/client src/client

ARG     SHORT_SHA
ENV     SHORT_SHA $SHORT_SHA
ARG     BRANCH_NAME
ENV     BRANCH_NAME $BRANCH_NAME
ARG     TAG_NAME
ENV     TAG_NAME $TAG_NAME

RUN     yarn buildclient

COPY    src/server src/server
RUN     yarn buildhtml

###

FROM    scratch AS export-client
COPY    --from=build-client /workspace/dist/client /

###

FROM    node:12-alpine AS build-server

WORKDIR /workspace
ENV     NODE_ENV production

COPY    --from=install-develop /workspace/node_modules node_modules
COPY    --from=build-client /workspace/dist dist
COPY    babel.config.js .
COPY    .eslintrc.strict.json .
COPY    .eslintrc.json .
COPY    .prettierrc .
COPY    webpack webpack
COPY    package.json .
COPY    config.json .
COPY    src/server src/server

ARG     SHORT_SHA
ENV     SHORT_SHA $SHORT_SHA
ARG     BRANCH_NAME
ENV     BRANCH_NAME $BRANCH_NAME
ARG     TAG_NAME
ENV     TAG_NAME $TAG_NAME

RUN     yarn buildserver

###

FROM    node:12-alpine

WORKDIR /workspace
ENV     NODE_ENV production

EXPOSE  3000

RUN     apk add --no-cache tini # to skip --init for docker run
COPY    --from=install-production /workspace/node_modules node_modules
COPY    --from=build-server /workspace/dist dist

ARG     SHORT_SHA
ENV     SHORT_SHA $SHORT_SHA
ARG     BRANCH_NAME
ENV     BRANCH_NAME $BRANCH_NAME
ARG     TAG_NAME
ENV     TAG_NAME $TAG_NAME

ENTRYPOINT ["/sbin/tini", "--", "node", "dist/server"]

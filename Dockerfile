# syntax = docker/dockerfile:experimental
FROM    node:16-alpine AS install-production

WORKDIR /workspace
ENV     NODE_ENV production

COPY    package.json .
COPY    yarn.lock .
RUN     yarn install --production

###

FROM    install-production AS install-develop

WORKDIR /workspace
ENV     NODE_ENV develop

RUN     yarn install

###

FROM    install-develop AS build-server

WORKDIR /workspace
ENV     NODE_ENV production

COPY    .eslintrc.strict.json .
COPY    .eslintrc.json .
COPY    .prettierrc .
COPY    next.config.js .
COPY    public public
COPY    src src

ARG     SHORT_SHA
ENV     SHORT_SHA $SHORT_SHA
ARG     BRANCH_NAME
ENV     BRANCH_NAME $BRANCH_NAME
ARG     TAG_NAME
ENV     TAG_NAME $TAG_NAME

RUN     yarn build

###

FROM    build-server AS build-client

WORKDIR /workspace
ENV     NODE_ENV production

RUN     yarn export

###

FROM    scratch AS export-client
COPY    --from=build-client /workspace/dist/client /

###

FROM    install-production

WORKDIR /workspace
ENV     NODE_ENV production

EXPOSE  3000

RUN     apk add --no-cache tini # to skip --init for docker run
COPY    next.config.js .
COPY    --from=build-server /workspace/dist/server dist/server
COPY    --from=build-server /workspace/public public

ARG     SHORT_SHA
ENV     SHORT_SHA $SHORT_SHA
ARG     BRANCH_NAME
ENV     BRANCH_NAME $BRANCH_NAME
ARG     TAG_NAME
ENV     TAG_NAME $TAG_NAME

ENTRYPOINT ["/sbin/tini", "--", "yarn", "start"]

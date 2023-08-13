FROM node:lts-alpine3.18 as prepare

WORKDIR /app

COPY ["package.json", "package-lock.json", "tsconfig.build.json", "./"]
COPY src src

RUN npm ci && npm run build-prepare

COPY /app/dist ./dist
COPY /app/node_modules ./node_modules

CMD node dist/prepare/index.js



FROM node:lts-alpine3.18 as app

WORKDIR /app

COPY ["package.json", "package-lock.json", "tsconfig.build.json", "./"]
COPY src src

RUN npm ci && npm run build-prepare

COPY /app/dist ./dist
COPY /app/node_modules ./node_modules

CMD node dist/index.js

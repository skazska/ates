FROM node:lts-alpine3.18 as builder

WORKDIR /app

COPY ["package.json", "package-lock.json", "tsconfig.json", "../..", "./"]
COPY src src

RUN npm ci   && npm run build

EXPOSE 8080

FROM builder as prepare

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD node dist/prepare/index.js


FROM builder as app

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD node dist/index.js

# ---------- Base ----------
FROM node:18-buster AS base

WORKDIR /app

RUN apt-get -y update
RUN apt-get -y install file

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - dist: A production build compiled with Babel
FROM base AS builder

COPY package*.json .babelrc.json ./

RUN npm install

COPY ./src ./app

RUN npm run build

RUN npm prune --production # Remove dev dependencies

# ---------- Release ----------
FROM base AS release

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node

CMD ["node", "./dist/app.js"]

FROM node:18

RUN npm install -g pnpm

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# COPY --chown=node:node ./package.json .
COPY ./package.json .
COPY pnpm-lock.yaml .
RUN pnpm install

# 4. Copy the source code to /app dir
COPY . .
# COPY --chown=node:node . .

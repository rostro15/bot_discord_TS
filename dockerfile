FROM node:lts


RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app


WORKDIR /home/node/app
COPY ./package* ./

RUN npm install

USER node
COPY --chown=node:node . .

RUN npx tsc

COPY --chown=node:node config.json ./build/config.json

ENTRYPOINT [ "node", "build/index.js"]


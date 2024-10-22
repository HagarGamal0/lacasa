#stage 1: build
FROM node:16.20.0 as node

WORKDIR /app

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

#stage 2: serve
FROM node:16.20.0

WORKDIR /app

COPY --from=node /app /app

CMD [ "npm", "start" ]
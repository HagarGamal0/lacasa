#stage 1: build
FROM node:16.20.0 as node

WORKDIR /app

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

#stage 2: serve
FROM nginx:1.21.1-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=node /app/build /usr/share/nginx/html

EXPOSE 80
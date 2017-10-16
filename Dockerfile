FROM node:8

ENV NODE_ENV=production

WORKDIR /usr/app/

COPY package.json package-lock.json ./
RUN npm i

CMD ["npm", "start"]

COPY . ./
RUN npm run build:client
RUN npm run build:server

EXPOSE 8080
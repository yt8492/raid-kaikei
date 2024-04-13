FROM node:20

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY src ./

RUN npm run build

EXPOSE 3000

CMD [ "node", "lib/index.js" ]
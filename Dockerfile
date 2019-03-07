FROM node:lts-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci --no-optional

COPY backend/ ./

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci --no-optional

COPY frontend/ ./

RUN npm run build

RUN rm -rf ../dist; cp -r dist ../; rm -rf *

WORKDIR /app

EXPOSE 3000

CMD [ "npm", "start" ]
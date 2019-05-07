#Build production frontend
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --no-optional --production
COPY frontend/ ./
RUN npm run build


#Actual container
FROM node:lts-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --no-optional --production
COPY backend/ ./
COPY --from=build-stage /app/dist /app/dist
EXPOSE 3000
CMD [ "npm", "start" ]
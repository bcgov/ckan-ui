FROM node:lts-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --no-optional --production
COPY backend/ ./
EXPOSE 3000
CMD [ "npm", "start" ]
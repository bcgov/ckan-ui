FROM node:lts-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --no-optional --production
RUN mkdir /.config && chmod 777 /.config
COPY backend/ ./
EXPOSE 3000
CMD [ "npm", "start" ]
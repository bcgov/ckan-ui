FROM node:lts-alpine
USER root
RUN echo net.ipv4.tcp_syn_retries = 11 >> /etc/sysctl.conf
WORKDIR /app
COPY backend/package*.json ./

RUN npm ci --no-optional --production
RUN mkdir /.config && chmod 777 /.config
COPY backend/ ./
EXPOSE 3000
CMD [ "npm", "start" ]
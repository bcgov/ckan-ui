FROM node:lts-alpine3.21
USER root
RUN echo net.ipv4.tcp_syn_retries = 11 >> /etc/sysctl.conf
WORKDIR /app
COPY backend/package*.json ./

RUN npm ci --no-optional --production
RUN mkdir /.config && chmod 777 /.config
RUN mkdir /.npm
RUN chgrp -R 0 /.npm && \
    chmod -R g=u /.npm
COPY backend/ ./
EXPOSE 3000
CMD [ "npm", "start" ]

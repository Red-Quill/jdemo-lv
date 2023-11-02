FROM node:18-alpine

RUN addgroup --gid 1502 jcourses-api
# sudo groupadd jcourses-api --gid 1502

# -D = NO PASSWORD
RUN adduser jcourses-api --disabled-password --home /srv/jcourses-api -G jcourses-api --uid 1502
# sudo useradd jcourses-api --home-dir /srv/jcourses-api --uid 1502 --gid 1502

COPY ./miscallaneous/jt-ca.crt /etc/ssl/certs/jt-ca.crt
USER jcourses-api
WORKDIR /srv/jcourses-api
RUN mkdir -p /srv/jcourses-api/server
#RUN mkdir -p /srv/jcourses-api/common

ENV NODE_ENV=production
ENV API_URL=kurssit.jarnontunnit.com/api/v1
ENV JCOURSES__CONFIG=aws
ENV JCOURSES__LOGGER_LOGFILESPATH=log
ENV JCOURSES__DATABASE_SSLCAFILE=/etc/ssl/certs/jt-ca.crt

COPY --chown=jcourses-api:jcourses-api --chmod=0740 ./build /srv/jcourses-api/server
COPY --chown=jcourses-api:jcourses-api --chmod=0740 ./miscallaneous/aws /srv/jcourses-api/.aws

WORKDIR /srv/jcourses-api/server
RUN npm ci --omit=dev

EXPOSE 8080
CMD ["npm","start"]

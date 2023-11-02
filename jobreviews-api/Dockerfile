FROM node:18-alpine

RUN addgroup --gid 1503 jobreviews-api
# sudo groupadd jobreviews-api --gid 1503

# -D = NO PASSWORD
RUN adduser jobreviews-api --disabled-password --home /srv/jobreviews-api -G jobreviews-api --uid 1503
# sudo useradd jobreviews-api --home-dir /srv/jobreviews-api --uid 1503 --gid 1503

#COPY ./miscallaneous/jt-ca.crt /etc/ssl/certs/jt-ca.crt
USER jobreviews-api
WORKDIR /srv/jobreviews-api
RUN mkdir -p /srv/jobreviews-api/server
#RUN mkdir -p /srv/jobreviews-api/common

ENV NODE_ENV=production
ENV API_URL=jobreviews.jdemosite.link/api
ENV JCOURSES__CONFIG=aws
#ENV JCOURSES__LOGGER_LOGFILESPATH=log
#ENV JCOURSES__DATABASE_SSLCAFILE=/etc/ssl/certs/jt-ca.crt

COPY --chown=jobreviews-api:jobreviews-api --chmod=0740 ./build /srv/jobreviews-api/server
COPY --chown=jobreviews-api:jobreviews-api --chmod=0740 ./miscallaneous/aws /srv/jobreviews-api/.aws

WORKDIR /srv/jobreviews-api/server
RUN npm ci --omit=dev

EXPOSE 8080
CMD ["npm","start"]

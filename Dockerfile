FROM node:6.1.0

MAINTAINER GroupByInc

ENV NODE_ENV production

WORKDIR /home/mean

ADD package.json /home/mean/package.json
RUN npm install -g http-server

# This is just a check to ensure riot is available
COPY lib /home/mean/lib

# This is just a check to ensure gulp build was run prior to docker build
COPY dist /home/mean/dist

# This is just a check to ensure static assets are copied
COPY assets /home/mean/assets

COPY index.html /home/mean/index.html

EXPOSE 8080

CMD ["http-server"]

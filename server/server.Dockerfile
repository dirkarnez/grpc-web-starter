FROM node

WORKDIR /helloworld

COPY ./package.json ./package.json
RUN npm install

COPY ./helloworld.proto ./helloworld.proto
COPY ./server.js ./server.js

CMD node ./server.js
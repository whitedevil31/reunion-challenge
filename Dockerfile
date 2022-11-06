FROM node:alpine
WORKDIR /app
ENV PROD_DB reunion
ENV TEST_DB reunion-test
ENV JWT_SECRET thisissparta
ENV PORT 5000
COPY package.json /app
RUN npm install
COPY . /app

CMD ["npm","run","docker-start"]

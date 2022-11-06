FROM node:alpine
WORKDIR /app
ENV PROD_DB <>
ENV TEST_DB <>
ENV JWT_SECRET <>
ENV PORT <>
COPY package.json /app
RUN npm install
COPY . /app

CMD ["npm","run","docker-start"]

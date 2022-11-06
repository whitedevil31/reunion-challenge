FROM node:alpine
WORKDIR /app
ENV PROD_DB mongodb+srv://nanda31:987654321@cluster0.fzbp3.mongodb.net/reunion?retryWrites=true&w=majority
ENV TEST_DB mongodb+srv://nanda31:987654321@cluster0.fzbp3.mongodb.net/reunion-test?retryWrites=true&w=majority
ENV JWT_SECRET thisissparta
ENV PORT 5000
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm","start"]

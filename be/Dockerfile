FROM node:20-slim

WORKDIR /usr/app/

COPY src . 
COPY .env.docker .env 
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install
RUN npm run compile

RUN rm -rf src 

EXPOSE 3000
CMD ["node" , "./dist/index.js"]
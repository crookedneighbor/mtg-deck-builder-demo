FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./
COPY nodemon.json ./

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]

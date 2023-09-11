FROM node:16.0.0

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start" ]

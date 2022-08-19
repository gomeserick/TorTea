FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080 KEY=DEFAULT

EXPOSE 8080

CMD ["npm", "start"]
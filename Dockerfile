FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3069

EXPOSE 3069

CMD ["npm", "start"]
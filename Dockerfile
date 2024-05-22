FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN chmod +x ./scripts/migrate.sh

RUN ./scripts/migrate.sh

RUN npm run build

EXPOSE 3000

RUN chmod +x ./scripts/start.api.sh
CMD ["./scripts/start.api.sh"]
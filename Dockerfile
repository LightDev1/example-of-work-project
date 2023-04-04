FROM node:16-alpine

USER root

WORKDIR "/app"

COPY package.json package-lock.json /app/

RUN npm install --force --only=production

COPY . /app

RUN mkdir -p uploads && chmod -R 777 uploads/

RUN npm run build

CMD ["node", "dist/main"]
FROM node:13.12.0-alpine AS production

WORKDIR /
# install app dependencies
RUN apk add --no-cache git
COPY server/package.json ./
RUN npm install
COPY server/ ./
RUN npm i -g typescript
RUN npm run build

CMD ["npm", "start"]

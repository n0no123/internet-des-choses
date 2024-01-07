FROM node:20-alpine3.17 AS build

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

FROM node:20-alpine3.17

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]

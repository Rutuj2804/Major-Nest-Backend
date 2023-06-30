FROM node:12.13 as build

WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install argon2 --build-from-source
COPY . .
RUN npm run build

FROM node:12.13
WORKDIR /app
COPY package.json .
RUN npm install --only=production
RUN npm install argon2 --build-from-source
COPY --from=build /app/dist ./dist
CMD npm run start:prod
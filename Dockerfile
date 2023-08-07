FROM node:18-alpine AS BUILDER

WORKDIR /app
COPY ./src ./src
COPY tsconfig.json .
COPY package.json .

RUN npm install
RUN npm install -g typescript
RUN npm run build

FROM node:18-alpine AS IMAGE

WORKDIR /app
COPY --from=BUILDER /app/build/ ./build/
COPY --from=BUILDER /app/package.json ./
COPY --from=BUILDER /app/package-lock.json ./
RUN npm install --production
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
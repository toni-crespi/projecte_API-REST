FROM node:22-alpine
RUN addgroup -S alumnes && adduser -S toni -G alumnes
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN chown -R toni:alumnes /app
USER toni
EXPOSE 3000
CMD ["node", "app.js"]
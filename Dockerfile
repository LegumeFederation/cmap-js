#multistage build
#Build stage for cvit component
FROM node:16.9.1-alpine3.14 as dev
WORKDIR /app
#Doing package before build allows us to leverage docker caching.
COPY package*.json ./
RUN npm install --no-optional && npm cache clean --force
ENTRYPOINT ["npm", "run", "watch"]
EXPOSE 3000

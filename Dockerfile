#multistage build
#Build stage for cvit component
FROM node:12.18.0-alpine3.12 as cmapui
WORKDIR /cmap
#Doing package before build allows us to leverage docker caching.
COPY package*.json ./
RUN npm ci
# avoid copying user-modified cvit.conf and data
COPY src ./src
COPY rollup.config.js .babelrc ./
RUN npm run build

FROM nginx:stable-alpine as nginx
WORKDIR /app
COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx as full
COPY --from=cmapui /cmap/build /app/build
COPY cmap.json /app/cmap.json
COPY index.html /app/index.html
COPY /data /app/data
COPY /images/* /app/images/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# build environment https://dev.to/mubbashir10/containerize-react-app-with-docker-for-production-572b
FROM node:15.0.1-alpine3.10 as build
WORKDIR /reactapp
COPY /reactapp/package.json ./
RUN echo y | npm install -g --silent
COPY . ./
RUN echo y |  npm build
# production environment
FROM nginx:stable-alpine
COPY --from=build /reactapp/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
VOLUME /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

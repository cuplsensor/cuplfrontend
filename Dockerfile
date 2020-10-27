# build environment https://dev.to/mubbashir10/containerize-react-app-with-docker-for-production-572b
FROM node:15.0.1-alpine3.10 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./reactapp/package.json /app/
RUN yarn --silent
COPY . /app
RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY --from=build /reactapp/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
VOLUME /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# build environment
FROM node:15.0.1-alpine3.10 as build
WORKDIR /reactapp
ENV PATH /reactapp/node_modules/.bin:$PATH
COPY /reactapp/package.json ./
COPY /reactapp/package-lock.json ./
RUN yarn --silent
COPY . ./
RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY --from=build /reactapp/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
VOLUME /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

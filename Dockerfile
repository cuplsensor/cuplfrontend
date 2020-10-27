# build environment https://dev.to/mubbashir10/containerize-react-app-with-docker-for-production-572b
FROM node:15.0.1-alpine3.10 as build
WORKDIR /reactapp
# Install dependencies from package.json
RUN echo y | npm install -g --silent
# Download and run the build script
RUN npm run --silent build

# production environment
FROM nginx:stable-alpine
COPY --from=build /reactapp/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
VOLUME /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# build environment https://dev.to/mubbashir10/containerize-react-app-with-docker-for-production-572b
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY reactapp/package.json ./
COPY reactapp/package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]

# production environment
#FROM nginx:stable-alpine
#COPY --from=build /reactapp/build /usr/share/nginx/html
#COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
#VOLUME /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

# build environment https://dev.to/mubbashir10/containerize-react-app-with-docker-for-production-572b
FROM node:13.12.0-alpine
# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install app dependencies
COPY reactapp/package.json ./
COPY reactapp/package-lock.json ./
RUN npm ci --silent
#RUN npm install react-scripts@3.4.1 -g --silent
COPY reactapp/ ./
ARG WSF_ORIGIN
ARG WSB_ORIGIN
RUN echo "WSB_ORIGIN: $WSB_ORIGIN"
ENV PUBLIC_URL=$WSF_ORIGIN
ENV REACT_APP_WSB_ORIGIN=$WSB_ORIGIN
RUN echo "REACT_APP_WSB_ORIGIN: $REACT_APP_WSB_ORIGIN"
RUN npm run build

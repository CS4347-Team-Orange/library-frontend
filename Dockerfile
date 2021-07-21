FROM node:14-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN apk install git
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:alpine
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
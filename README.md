# Library Frontend

[![Build Status](https://travis-ci.com/CS4347-Team-Orange/library-frontend.svg?token=MyN3vGLjp8SzdckebFqZ&branch=master)](https://travis-ci.com/CS4347-Team-Orange/library-frontend)

## Local Quickstart

```
docker-compose up -d
```

## Run Locally (Build Container)

Requires Node 14 and Yarn

#### Setup 

```
nvm install lts/fermium
nvm alias default lts/fermium
npm install --global yarn
yarn install
```

#### Test & Start

```
bash start.sh
```

## Run Locally (Development)

Requires Node 14 and Yarn

```
yarn serve
```

### Adding icons

[FontAwesome docs](https://www.npmjs.com/package/@fortawesome/vue-fontawesome#codesandbox-starter-sample-%F0%9F%9A%80) will show you how to add a new icon.  

See src/main.js for importing icons

See src/components/Repo.vue for a simple example of how to use icons.

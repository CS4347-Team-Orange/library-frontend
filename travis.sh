#!/usr/bin/env bash

set -e
set -o pipefail

sudo apt-get -y install git openssh

if [[ "${TRAVIS_PULL_REQUEST}" == "false" && "${TRAVIS_BRANCH}" == "master" ]]; then
    echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
fi

bash build.sh
bash test.sh
if [[ "${TRAVIS_PULL_REQUEST}" == "false" && "${TRAVIS_BRANCH}" == "master" ]]; then
    docker push alex4108/library-frontend
fi
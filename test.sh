#!/usr/bin/env bash

set -e # Bomb on any error

echo "Starting tests..."

PROJECT_NAME="backend" # The project's name


# Do any testing here
yarn install
yarn lint

# Do an "exit 1" at any point if you need to abort (a test failed)

echo "Tests passed!"

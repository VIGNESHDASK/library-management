#!/bin/bash

# Run npm build command
nvm use v18.17.0
npm run build

# If the build is successful, run npx gh-pages command
if [ $? -eq 0 ]; then
  npx gh-pages -d build
  echo "Build success"
else
  echo "Build failed. Not running the deployment."
fi

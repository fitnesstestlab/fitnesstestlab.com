#!/bin/bash

# This script helps test the blog system by building and serving the site

echo "Building the Next.js site..."
npm run build

if [ $? -eq 0 ]; then
  echo "Build successful! Starting the production server..."
  npm run start
else
  echo "Build failed. Please check the error messages."
fi

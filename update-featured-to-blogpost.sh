#!/bin/bash

# This script updates all blog posts from using 'featured: true' to 'blogpost: true'
# Navigate to the blog directory
cd "$(dirname "$0")/content/blog"

# Find all index.md files and replace 'featured: true' with 'blogpost: true'
find . -name "index.md" -type f -exec sed -i '' 's/featured: true/blogpost: true/g' {} \;

echo "Updated all blog posts from featured: true to blogpost: true"

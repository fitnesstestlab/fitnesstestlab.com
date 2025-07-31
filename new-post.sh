#!/bin/bash

# This script creates a new blog post in the correct format

# Check if a post title was provided
if [ $# -eq 0 ]; then
    echo "Please provide a blog post title"
    echo "Usage: ./new-post.sh \"My Blog Post Title\""
    exit 1
fi

# Get the current date in YYYY-MM-DD format
DATE=$(date +"%Y-%m-%d")

# Convert the title to a slug
TITLE=$1
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr -c '[:alnum:]' '-' | tr -s '-' | sed 's/^-//;s/-$//')

# Create the directory with the date prefix
DIR_NAME="content/blog/$DATE-$SLUG"
mkdir -p "$DIR_NAME"

# Create the markdown file with frontmatter
cat > "$DIR_NAME/index.md" << EOL
---
title: "$TITLE"
excerpt: "A brief description of your post."
date: "$DATE"
author: "Mario Guerra"
category: "Development"
tags: ["Tag1", "Tag2", "Tag3"]
blogpost: false
coverImage: "/images/blog/$SLUG-cover.jpg"
---

# $TITLE

Your content goes here. Write in Markdown format.

## Section 1

Content for section 1.

## Section 2

Content for section 2.

## Conclusion

Concluding thoughts.
EOL

echo "Blog post created at $DIR_NAME/index.md"
echo "Don't forget to:"
echo "1. Update the excerpt"
echo "2. Set the appropriate category"
echo "3. Update the tags"
echo "4. Add a cover image at public/images/blog/$SLUG-cover.jpg"
echo "   (This will be referenced as /images/blog/$SLUG-cover.jpg in the markdown)"

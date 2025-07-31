#!/bin/bash

# import-blog-post.sh
# A script to import blog posts into the portfolio website
# Usage: ./import-blog-post.sh [-k] <path-to-blog-post-directory>
#
# Options:
#   -k    Keep the original directory after import (default is to delete it)

set -e

# Debug function
debug_log() {
  if [ "${DEBUG:-0}" -eq 1 ]; then
    echo "DEBUG: $1" >&2
  fi
}

# Enable debug mode with DEBUG=1 ./import-blog-post.sh
if [ "${DEBUG:-0}" -eq 1 ]; then
  echo "Debug mode enabled"
fi

# Configuration
BLOG_CONTENT_DIR="/Users/mariog/Work/mario-guerra.github.io/content/blog"
PUBLIC_IMAGES_DIR="/Users/mariog/Work/mario-guerra.github.io/public/images/blog"
BASE_PATH="."
KEEP_ORIGINAL=false

# Check for command-line options
while getopts ":k" opt; do
  case ${opt} in
    k ) # Keep original directory
      KEEP_ORIGINAL=true
      ;;
    \? )
      echo "Invalid option: -$OPTARG" 1>&2
      ;;
  esac
done
shift $((OPTIND -1))

# Check if a directory was provided
if [ $# -eq 0 ]; then
  echo "Error: Please provide the path to the blog post directory."
  echo "Usage: ./import-blog-post.sh [-k] <path-to-blog-post-directory>"
  echo "Options:"
  echo "  -k    Keep the original directory after import (default is to delete it)"
  exit 1
fi

SOURCE_DIR="$1"

# Check if the source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Directory does not exist: $SOURCE_DIR"
  exit 1
fi

# Extract blog post details from source directory or markdown file
if [ -f "$SOURCE_DIR/index.md" ]; then
  MARKDOWN_FILE="$SOURCE_DIR/index.md"
elif [ -f "$SOURCE_DIR.md" ]; then
  MARKDOWN_FILE="$SOURCE_DIR.md"
else
  # Try to find any markdown file in the directory
  MARKDOWN_FILE=$(find "$SOURCE_DIR" -name "*.md" -type f | head -n 1)
  
  if [ -z "$MARKDOWN_FILE" ]; then
    echo "Error: No markdown file found in $SOURCE_DIR"
    exit 1
  fi
fi

echo "Found markdown file: $MARKDOWN_FILE"

# Extract title and date from frontmatter
TITLE=$(grep -m 1 "title:" "$MARKDOWN_FILE" | sed 's/title: *"\(.*\)"/\1/' | sed 's/title: *\(.*\)/\1/')
if [ -z "$TITLE" ]; then
  echo "Error: Could not extract title from markdown file."
  echo "Please make sure the markdown file has a title in the frontmatter."
  exit 1
fi

# Extract or generate date
DATE=$(grep -m 1 "date:" "$MARKDOWN_FILE" | sed 's/date: *"\([0-9-]*\).*/\1/' | sed 's/date: *\([0-9-]*\).*/\1/')
if [ -z "$DATE" ]; then
  # Use today's date if not found
  DATE=$(date +"%Y-%m-%d")
  echo "No date found in frontmatter, using today's date: $DATE"
else
  echo "Found date: $DATE"
fi

# Generate slug from title
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')

# Create target directory names
TARGET_DIR_NAME="$DATE-$SLUG"
TARGET_DIR="$BLOG_CONTENT_DIR/$TARGET_DIR_NAME"
TARGET_IMAGE_DIR="$PUBLIC_IMAGES_DIR/$SLUG"

echo "Creating blog post: $TITLE"
echo "Target directory: $TARGET_DIR"
echo "Image directory: $TARGET_IMAGE_DIR"

# Create directories if they don't exist
mkdir -p "$TARGET_DIR"
mkdir -p "$TARGET_IMAGE_DIR"

# Extract frontmatter
FRONTMATTER=$(sed -n '/^---$/,/^---$/p' "$MARKDOWN_FILE")

# Extract content (everything after the frontmatter)
# This double-sed command handles frontmatter by removing everything from the start of the file up to and 
# including the second "---" marker
CONTENT=$(sed '1,/^---$/d' "$MARKDOWN_FILE" | sed '1,/^---$/d')

# Check if content was extracted correctly
if [ -z "$CONTENT" ]; then
  echo "Warning: Could not extract content from markdown file."
  # Try a different approach - everything after the frontmatter section
  CONTENT=$(awk 'BEGIN{f=0} /^---$/{f++; if(f==2) {nextfile}} f==2{print}' "$MARKDOWN_FILE")
  
  # If still no content, try another approach
  if [ -z "$CONTENT" ]; then
    echo "Trying alternative content extraction method..."
    # Save everything after the line number where the second "---" appears
    SECOND_MARKER_LINE=$(grep -n "^---$" "$MARKDOWN_FILE" | awk 'NR==2 {print $1}' | cut -d: -f1)
    if [ -n "$SECOND_MARKER_LINE" ]; then
      CONTENT=$(tail -n +$((SECOND_MARKER_LINE + 1)) "$MARKDOWN_FILE")
    fi
  fi
fi

# Debug the content length
debug_log "Content length: $(echo "$CONTENT" | wc -c) bytes"
debug_log "Content first 100 chars: $(echo "$CONTENT" | head -c 100)..."

# Prepare new frontmatter
echo "Creating new frontmatter..."

# Extract existing frontmatter values or use defaults
EXCERPT=$(grep -m 1 "excerpt\|description:" "$MARKDOWN_FILE" | sed 's/excerpt: *"\(.*\)"/\1/' | sed 's/excerpt: *\(.*\)/\1/' | sed 's/description: *"\(.*\)"/\1/' | sed 's/description: *\(.*\)/\1/')
AUTHOR=$(grep -m 1 "author:" "$MARKDOWN_FILE" | sed 's/author: *"\(.*\)"/\1/' | sed 's/author: *\(.*\)/\1/')
CATEGORY=$(grep -m 1 "category:" "$MARKDOWN_FILE" | sed 's/category: *"\(.*\)"/\1/' | sed 's/category: *\(.*\)/\1/')
if [ -z "$CATEGORY" ]; then
  # Try to get category from categories array
  CATEGORY=$(grep -A 5 "categories:" "$MARKDOWN_FILE" | grep -m 1 "-" | sed 's/- *\(.*\)/\1/' | sed 's/^ *//' | sed 's/ *$//')
fi
FEATURED=$(grep -m 1 "featured:\|blogpost:" "$MARKDOWN_FILE" | sed 's/featured: *\(.*\)/\1/' | sed 's/blogpost: *\(.*\)/\1/')
if [ -z "$FEATURED" ]; then
  FEATURED="true"
fi

# Find and process image paths
echo "Processing images..."
IMAGE_PATHS=$(grep -o '!\[.*\](.*\)' "$MARKDOWN_FILE" | sed 's/.*(\(.*\))/\1/')
COVER_IMAGE=$(grep -m 1 "coverImage\|image:" "$MARKDOWN_FILE" | sed 's/.*: *"\(.*\)"/\1/' | sed 's/.*: *\(.*\)/\1/')

# Create the new frontmatter
NEW_FRONTMATTER="---
title: \"$TITLE\"
excerpt: \"$EXCERPT\"
date: \"$DATE\"
author: \"$AUTHOR\"
category: \"$CATEGORY\"
tags: ["
# Extract tags
TAGS=$(grep -A 10 "tags:" "$MARKDOWN_FILE" | grep -v "tags:" | grep -v "---" | grep -v "^$" | sed 's/- *//' | sed 's/^ *//' | sed 's/ *$//' | sed 's/^"\(.*\)"$/\1/' | tr '\n' ',' | sed 's/,/, /g' | sed 's/, $//')
if [ -z "$TAGS" ]; then
  TAGS="blog"
fi
NEW_FRONTMATTER="$NEW_FRONTMATTER$TAGS"
NEW_FRONTMATTER="$NEW_FRONTMATTER]
blogpost: $FEATURED
coverImage: \"$BASE_PATH/images/blog/$SLUG/"

# Copy images and update image paths in content
UPDATED_CONTENT="$CONTENT"

# Function to process images in content
process_images() {
  # Find all image references in markdown
  local md_content="$1"
  local image_refs=$(echo "$md_content" | grep -o '!\[.*\](.*\)' | sed 's/.*(\(.*\))/\1/')
  local updated_content="$md_content"  # Start with the original content
  
  debug_log "Found $(echo "$image_refs" | wc -l) image references"
  
  for img_path in $image_refs; do
    # Remove query parameters if any
    clean_img_path=$(echo "$img_path" | sed 's/\?.*//')
    
    # Try to find the image file
    local img_filename=$(basename "$clean_img_path")
    local source_img=""
    
    # Check if path is absolute or relative
    if [[ "$clean_img_path" == /* || "$clean_img_path" == http* ]]; then
      # For absolute paths or URLs, try to find the file in the source directory
      if [[ "$clean_img_path" == /* ]]; then
        # Check if file exists in public directory
        if [ -f "/Users/mariog/Work/portfolio_website/public$clean_img_path" ]; then
          source_img="/Users/mariog/Work/portfolio_website/public$clean_img_path"
        fi
      fi
      
      # If it's a URL or we couldn't find it, we'll need to download it
      if [ -z "$source_img" ]; then
        if [[ "$clean_img_path" == http* ]]; then
          echo "Will need to download: $clean_img_path"
          # Download the image to a temporary file
          temp_file="/tmp/$img_filename"
          curl -s -o "$temp_file" "$clean_img_path"
          if [ -f "$temp_file" ]; then
            source_img="$temp_file"
          else
            echo "Warning: Failed to download image from $clean_img_path"
            continue
          fi
        else
          echo "Warning: Could not find image at $clean_img_path"
          continue
        fi
      fi
    else
      # For relative paths, check in the source directory
      potential_locations=(
        "$SOURCE_DIR/$clean_img_path"
        "$SOURCE_DIR/$(basename "$clean_img_path")"
        "$(dirname "$MARKDOWN_FILE")/$clean_img_path"
        "$(dirname "$MARKDOWN_FILE")/$(basename "$clean_img_path")"
      )
      
      for loc in "${potential_locations[@]}"; do
        if [ -f "$loc" ]; then
          source_img="$loc"
          break
        fi
      done
      
      if [ -z "$source_img" ]; then
        echo "Warning: Could not find image at $clean_img_path"
        continue
      fi
    fi
    
    # Copy image to target directory
    if [ -n "$source_img" ]; then
      cp "$source_img" "$TARGET_IMAGE_DIR/$img_filename"
      echo "Copied image: $img_filename"
      
      # Update image reference in content
      new_img_path="$BASE_PATH/images/blog/$SLUG/$img_filename"
      updated_content=$(echo "$updated_content" | sed "s#$img_path#$new_img_path#g")
      debug_log "Updated image path: $img_path -> $new_img_path"
      
      # If this is the first image and we don't have a cover image, use it
      if [ -z "$COVER_IMAGE" ]; then
        COVER_IMAGE="$BASE_PATH/images/blog/$SLUG/$img_filename"
        debug_log "Using image as cover: $COVER_IMAGE"
      fi
    fi
  done
  
  # Return the updated content
  echo "$updated_content"
}

# Process images in content
# Save the original content in case image processing fails
ORIGINAL_CONTENT="$CONTENT"
PROCESSED_CONTENT=$(process_images "$CONTENT")
# Only update if processing was successful (non-empty result)
if [ -n "$PROCESSED_CONTENT" ]; then
  UPDATED_CONTENT="$PROCESSED_CONTENT"
else
  echo "Warning: Image processing failed. Using original content."
  UPDATED_CONTENT="$ORIGINAL_CONTENT"
fi

# Process cover image
if [ -n "$COVER_IMAGE" ]; then
  # Clean up the path
  clean_cover_path=$(echo "$COVER_IMAGE" | sed 's/\?.*//')
  cover_filename=$(basename "$clean_cover_path")
  
  # Try to find the cover image
  source_cover=""
  if [[ "$clean_cover_path" == /* || "$clean_cover_path" == http* ]]; then
    if [[ "$clean_cover_path" == /* ]]; then
      if [ -f "/Users/mariog/Work/portfolio_website/public$clean_cover_path" ]; then
        source_cover="/Users/mariog/Work/portfolio_website/public$clean_cover_path"
      fi
    fi
    
    if [ -z "$source_cover" ] && [[ "$clean_cover_path" == http* ]]; then
      echo "Downloading cover image: $clean_cover_path"
      temp_file="/tmp/$cover_filename"
      curl -s -o "$temp_file" "$clean_cover_path"
      if [ -f "$temp_file" ]; then
        source_cover="$temp_file"
      fi
    fi
  else
    potential_locations=(
      "$SOURCE_DIR/$clean_cover_path"
      "$SOURCE_DIR/$(basename "$clean_cover_path")"
      "$(dirname "$MARKDOWN_FILE")/$clean_cover_path"
      "$(dirname "$MARKDOWN_FILE")/$(basename "$clean_cover_path")"
    )
    
    for loc in "${potential_locations[@]}"; do
      if [ -f "$loc" ]; then
        source_cover="$loc"
        break
      fi
    done
  fi
  
  if [ -n "$source_cover" ]; then
    cp "$source_cover" "$TARGET_IMAGE_DIR/$cover_filename"
    echo "Copied cover image: $cover_filename"
    NEW_FRONTMATTER="${NEW_FRONTMATTER}${cover_filename}\""
  else
    echo "Warning: Could not find cover image at $COVER_IMAGE"
    # Use a default cover image name
    NEW_FRONTMATTER="${NEW_FRONTMATTER}cover.jpg\""
  fi
else
  # No cover image specified
  NEW_FRONTMATTER="${NEW_FRONTMATTER}cover.jpg\""
  echo "Warning: No cover image specified in frontmatter."
fi

# Finalize frontmatter
NEW_FRONTMATTER="$NEW_FRONTMATTER
---"

# Write the new markdown file
echo "$NEW_FRONTMATTER" > "$TARGET_DIR/index.md"
echo "" >> "$TARGET_DIR/index.md"

# Write the content to the file
if [ -n "$UPDATED_CONTENT" ]; then
  # Use printf instead of echo to preserve formatting
  printf "%s\n" "$UPDATED_CONTENT" >> "$TARGET_DIR/index.md"
  echo "Content successfully written to $TARGET_DIR/index.md"
else
  echo "Warning: No content to write! Using placeholder content."
  echo "# $TITLE" >> "$TARGET_DIR/index.md"
  echo "" >> "$TARGET_DIR/index.md"
  echo "This is a placeholder. The original content could not be processed." >> "$TARGET_DIR/index.md"
fi

echo "✅ Blog post imported successfully!"
echo "📝 Post: $TITLE"
echo "📂 Location: $TARGET_DIR/index.md"
echo "🖼️ Images: $TARGET_IMAGE_DIR"

# Check content was written successfully
CONTENT_LENGTH=$(wc -c < "$TARGET_DIR/index.md")
if [ "$CONTENT_LENGTH" -lt 100 ]; then
  echo "⚠️ Warning: The imported post is very short (${CONTENT_LENGTH} bytes). Please check it manually."
else
  echo "📄 Content length: ${CONTENT_LENGTH} bytes"
fi

# Handle original directory cleanup
if [ "$KEEP_ORIGINAL" = true ]; then
  echo "Keeping original directory as requested."
else
  # Skip deletion if source and target are the same
  if [ "$(realpath "$SOURCE_DIR")" == "$(realpath "$TARGET_DIR")" ]; then
    echo "Source and target directories are the same. Skipping deletion."
  else
    echo "Deleting original directory: $SOURCE_DIR"
    rm -rf "$SOURCE_DIR"
    echo "Original directory deleted successfully."
  fi
fi

echo ""
echo "To view your post, restart the development server with 'npm run dev'"

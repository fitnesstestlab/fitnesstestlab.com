#!/bin/bash

# Script to migrate images from .tmp/post/ to public/images/blog/ and update frontmatter

set -e

BLOG_DIR="content/blog"
SOURCE_DIR=".tmp/post"
PUBLIC_IMG_DIR="public/images/blog"

echo "Starting image migration for all blog posts..."
echo "=============================================="

# Counter for tracking
TOTAL=0
PROCESSED=0
SKIPPED=0

# Loop through all blog post directories
for POST_DIR in "$BLOG_DIR"/*; do
    if [ ! -d "$POST_DIR" ]; then
        continue
    fi
    
    TOTAL=$((TOTAL + 1))
    
    # Get the post directory name (e.g., 2023-01-06-bells-of-steel-ss3-safety-squat-bar-review)
    POST_NAME=$(basename "$POST_DIR")
    
    # Extract the slug by removing the date prefix (YYYY-MM-DD-)
    SLUG=$(echo "$POST_NAME" | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-//')
    
    # Look for matching source directory
    SOURCE_POST_DIR="$SOURCE_DIR/$SLUG"
    
    echo ""
    echo "[$TOTAL] Processing: $POST_NAME"
    echo "    Slug: $SLUG"
    
    # Check if source directory exists
    if [ ! -d "$SOURCE_POST_DIR" ]; then
        echo "    ⚠️  WARNING: Source directory not found: $SOURCE_POST_DIR"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    # Check if source has images directory
    SOURCE_IMG_DIR="$SOURCE_POST_DIR/images"
    if [ ! -d "$SOURCE_IMG_DIR" ]; then
        echo "    ⚠️  WARNING: No images directory in: $SOURCE_POST_DIR"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    # Count images
    IMG_COUNT=$(find "$SOURCE_IMG_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) | wc -l | tr -d ' ')
    
    if [ "$IMG_COUNT" -eq 0 ]; then
        echo "    ⚠️  WARNING: No images found in: $SOURCE_IMG_DIR"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    echo "    Found $IMG_COUNT images in source"
    
    # Create destination directory
    DEST_IMG_DIR="$PUBLIC_IMG_DIR/$POST_NAME"
    mkdir -p "$DEST_IMG_DIR"
    
    # Copy all images
    echo "    Copying images to: $DEST_IMG_DIR"
    cp -v "$SOURCE_IMG_DIR"/* "$DEST_IMG_DIR/" 2>/dev/null || true
    
    # Find the "Title" image for coverImage
    TITLE_IMG=$(find "$DEST_IMG_DIR" -type f -iname "*title*" | head -1)
    
    if [ -n "$TITLE_IMG" ]; then
        # Get just the filename
        TITLE_FILENAME=$(basename "$TITLE_IMG")
        COVER_PATH="/images/blog/$POST_NAME/$TITLE_FILENAME"
        echo "    ✅ Found Title image: $TITLE_FILENAME"
        
        # Update the frontmatter in the blog post
        INDEX_FILE="$POST_DIR/index.md"
        if [ -f "$INDEX_FILE" ]; then
            # Use sed to replace the coverImage line
            sed -i '' "s|^coverImage:.*|coverImage: $COVER_PATH|" "$INDEX_FILE"
            echo "    ✅ Updated coverImage in frontmatter"
            PROCESSED=$((PROCESSED + 1))
        else
            echo "    ⚠️  WARNING: index.md not found"
            SKIPPED=$((SKIPPED + 1))
        fi
    else
        echo "    ⚠️  WARNING: No Title image found, using first image"
        # Fallback: use first image
        FIRST_IMG=$(find "$DEST_IMG_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | head -1)
        if [ -n "$FIRST_IMG" ]; then
            FIRST_FILENAME=$(basename "$FIRST_IMG")
            COVER_PATH="/images/blog/$POST_NAME/$FIRST_FILENAME"
            echo "    ⚠️  Using: $FIRST_FILENAME"
            
            INDEX_FILE="$POST_DIR/index.md"
            if [ -f "$INDEX_FILE" ]; then
                sed -i '' "s|^coverImage:.*|coverImage: $COVER_PATH|" "$INDEX_FILE"
                echo "    ✅ Updated coverImage in frontmatter"
                PROCESSED=$((PROCESSED + 1))
            fi
        else
            echo "    ❌ ERROR: No images could be used"
            SKIPPED=$((SKIPPED + 1))
        fi
    fi
done

echo ""
echo "=============================================="
echo "Migration Complete!"
echo "Total posts: $TOTAL"
echo "Processed: $PROCESSED"
echo "Skipped: $SKIPPED"
echo "=============================================="

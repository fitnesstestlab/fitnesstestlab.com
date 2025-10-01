import os
import re

BLOG_ROOT = "content/blog"
IMAGES_ROOT = "public/images/blog"

def find_title_image(date_slug):
    """Find the image with 'Title' in its filename for a given date-slug."""
    img_dir = os.path.join(IMAGES_ROOT, date_slug)
    if not os.path.isdir(img_dir):
        return None
    
    for fname in os.listdir(img_dir):
        if "Title" in fname or "title" in fname:
            return f"/images/blog/{date_slug}/{fname}"
    
    # If no Title image found, return the first image
    for fname in os.listdir(img_dir):
        if fname.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            return f"/images/blog/{date_slug}/{fname}"
    
    return None

def update_blog_post_frontmatter(post_path, date_slug):
    """Update the coverImage in the frontmatter of a blog post."""
    with open(post_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the title image for this post
    title_image = find_title_image(date_slug)
    
    if not title_image:
        print(f"No title image found for {date_slug}")
        return False
    
    # Replace the coverImage in frontmatter
    # Pattern matches: coverImage: '/images/blog/...' or coverImage: "/images/blog/..."
    pattern = r"coverImage:\s*['\"]([^'\"]*)['\"]"
    
    if re.search(pattern, content):
        new_content = re.sub(pattern, f'coverImage: "{title_image}"', content)
        
        if new_content != content:
            with open(post_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated coverImage for {date_slug} to {title_image}")
            return True
        else:
            print(f"No change needed for {date_slug}")
    else:
        print(f"No coverImage field found in {date_slug}")
    
    return False

# Process all blog posts
for date_slug in os.listdir(BLOG_ROOT):
    post_dir = os.path.join(BLOG_ROOT, date_slug)
    if os.path.isdir(post_dir):
        post_path = os.path.join(post_dir, "index.md")
        if os.path.isfile(post_path):
            update_blog_post_frontmatter(post_path, date_slug)

print("\nDone updating all blog posts!")

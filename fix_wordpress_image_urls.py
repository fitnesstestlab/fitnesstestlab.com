import os
import re

BLOG_ROOT = "content/blog"

def fix_wordpress_image_urls(post_path, date_slug):
    """Replace WordPress image URLs with local image paths."""
    with open(post_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern to match WordPress image URLs
    # Matches: https://fitnesstestlab.com/wp-content/uploads/YYYY/MM/filename.ext
    # Also matches: //fitnesstestlab.com/wp-content/uploads/...
    pattern = r'https?://fitnesstestlab\.com/wp-content/uploads/\d{4}/\d{2}/([^"\'\s<>]+)'
    pattern2 = r'//fitnesstestlab\.com/wp-content/uploads/\d{4}/\d{2}/([^"\'\s<>]+)'
    
    def replace_url(match):
        filename = match.group(1)
        # Return the new local path
        return f"/images/blog/{date_slug}/{filename}"
    
    # Replace all WordPress URLs with local paths
    content = re.sub(pattern, replace_url, content)
    content = re.sub(pattern2, replace_url, content)
    
    if content != original_content:
        with open(post_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

# Process all blog posts
fixed_count = 0
for date_slug in os.listdir(BLOG_ROOT):
    post_dir = os.path.join(BLOG_ROOT, date_slug)
    if os.path.isdir(post_dir):
        post_path = os.path.join(post_dir, "index.md")
        if os.path.isfile(post_path):
            if fix_wordpress_image_urls(post_path, date_slug):
                print(f"✓ Fixed WordPress URLs in {date_slug}")
                fixed_count += 1

print(f"\n{'='*80}")
print(f"Fixed WordPress image URLs in {fixed_count} blog posts")

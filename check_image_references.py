import os
import re

BLOG_ROOT = "content/blog"
PUBLIC_ROOT = "public"

def find_broken_image_references():
    """Find broken image references in blog post content."""
    broken_refs = []
    fixed_posts = []
    
    for date_slug in os.listdir(BLOG_ROOT):
        post_dir = os.path.join(BLOG_ROOT, date_slug)
        if not os.path.isdir(post_dir):
            continue
            
        post_path = os.path.join(post_dir, "index.md")
        if not os.path.isfile(post_path):
            continue
        
        with open(post_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all image references in the content
        # Matches: ![alt](path), <img src="path">, and WordPress-style image URLs
        img_patterns = [
            r'!\[([^\]]*)\]\(([^)]+)\)',  # Markdown images
            r'<img[^>]+src=["\']([^"\']+)["\']',  # HTML img tags
            r'https?://fitnesstestlab\.com/wp-content/uploads/[^\s"\'<>]+',  # WordPress URLs
        ]
        
        post_images = set()
        for pattern in img_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                if pattern.startswith('!'):
                    img_path = match.group(2)
                elif pattern.startswith('<img'):
                    img_path = match.group(1)
                else:
                    img_path = match.group(0)
                
                post_images.add(img_path)
        
        # Check each image reference
        post_broken = []
        for img_path in post_images:
            # Skip external URLs (except WordPress ones which should be migrated)
            if img_path.startswith('http') and 'fitnesstestlab.com' not in img_path:
                continue
            
            # For WordPress URLs, these should be migrated
            if 'fitnesstestlab.com/wp-content' in img_path:
                post_broken.append(f"WordPress URL needs migration: {img_path}")
                continue
            
            # Check if local image file exists
            if img_path.startswith('/'):
                file_path = os.path.join(PUBLIC_ROOT, img_path.lstrip('/'))
            else:
                file_path = os.path.join(PUBLIC_ROOT, 'images', 'blog', date_slug, img_path)
            
            if not os.path.isfile(file_path):
                post_broken.append(f"Missing file: {img_path}")
        
        if post_broken:
            broken_refs.append({
                'post': date_slug,
                'issues': post_broken
            })
    
    return broken_refs

if __name__ == "__main__":
    broken = find_broken_image_references()
    
    if broken:
        print("Posts with broken or WordPress image references:")
        print("="*80)
        for item in broken:
            print(f"\n{item['post']}:")
            for issue in item['issues']:
                print(f"  - {issue}")
        print(f"\nTotal posts with issues: {len(broken)}")
    else:
        print("✓ All image references are valid!")

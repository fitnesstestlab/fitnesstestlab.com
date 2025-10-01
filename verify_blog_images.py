import os
import re

BLOG_ROOT = "content/blog"
IMAGES_ROOT = "public/images/blog"

def verify_blog_images():
    """Verify that all blog post images exist and are properly referenced."""
    issues = []
    success_count = 0
    
    for date_slug in os.listdir(BLOG_ROOT):
        post_dir = os.path.join(BLOG_ROOT, date_slug)
        if not os.path.isdir(post_dir):
            continue
            
        post_path = os.path.join(post_dir, "index.md")
        if not os.path.isfile(post_path):
            continue
        
        with open(post_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract coverImage from frontmatter
        cover_match = re.search(r'coverImage:\s*["\']?([^"\'\n]+)["\']?', content)
        if cover_match:
            cover_image = cover_match.group(1).strip()
            # Check if the image file exists
            image_path = os.path.join("public", cover_image.lstrip('/'))
            if os.path.isfile(image_path):
                success_count += 1
                print(f"✓ {date_slug}: {os.path.basename(cover_image)}")
            else:
                issues.append(f"✗ {date_slug}: Cover image NOT FOUND - {cover_image}")
        else:
            issues.append(f"⚠ {date_slug}: No coverImage field in frontmatter")
    
    print("\n" + "="*80)
    print(f"\nSummary:")
    print(f"  ✓ Success: {success_count} posts with valid cover images")
    print(f"  ✗ Issues: {len(issues)} posts with problems")
    
    if issues:
        print("\nIssues found:")
        for issue in issues:
            print(f"  {issue}")
    
    return success_count, issues

if __name__ == "__main__":
    verify_blog_images()

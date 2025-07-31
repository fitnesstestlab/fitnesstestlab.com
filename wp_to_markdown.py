import os
import re
import shutil
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
import yaml

# CONFIGURATION
WP_XML_PATH = "/Users/mariog/Work/fitnesstestlab.github.io.cline/.tmp/blog_content/fitnesstestlab.WordPress.2025-07-30.cleaned.xml"
WP_UPLOADS_PATH = "/Users/mariog/Work/fitnesstestlab.github.io.cline/.tmp/blog_content/uploads"
OUTPUT_BLOG_PATH = "/Users/mariog/Work/fitnesstestlab.github.io.cline/content/blog"
OUTPUT_IMAGE_PATH = "/Users/mariog/Work/fitnesstestlab.github.io.cline/public/images/blog"

# Ensure output directories exist
os.makedirs(OUTPUT_IMAGE_PATH, exist_ok=True)

# Helper to slugify titles for folder names
def slugify(value):
    value = value.lower()
    value = re.sub(r'[^a-z0-9]+', '-', value)
    return value.strip('-')

# Parse the WordPress XML
print(f"Parsing {WP_XML_PATH} ...")
tree = ET.parse(WP_XML_PATH)
root = tree.getroot()
channel = root.find('channel')

# Namespace map for XML
ns = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'wp': 'http://wordpress.org/export/1.2/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
}

for item in channel.findall('item'):

    post_type_el = item.find('wp:post_type', ns)
    post_type = post_type_el.text if post_type_el is not None else None
    if post_type != 'post':
        continue
    status_el = item.find('wp:status', ns)
    status = status_el.text if status_el is not None else None
    if status != 'publish':
        continue

    title_el = item.find('title')
    if title_el is None or not title_el.text:
        print("WARNING: Missing <title> in item, skipping.")
        continue
    title = title_el.text

    slug_el = item.find('wp:post_name', ns)
    slug = slug_el.text if slug_el is not None and slug_el.text else slugify(title)

    date_el = item.find('wp:post_date', ns)
    date = date_el.text if date_el is not None and date_el.text else "1970-01-01"
    date_str = date[:10]

    author_el = item.find('dc:creator', ns)
    author = author_el.text if author_el is not None and author_el.text else "Unknown"

    categories = [c.text for c in item.findall('category') if c.attrib.get('domain') == 'category' and c.text]
    tags = [c.text for c in item.findall('category') if c.attrib.get('domain') == 'post_tag' and c.text]

    excerpt_el = item.find('excerpt:encoded', ns)
    excerpt = excerpt_el.text.strip() if excerpt_el is not None and excerpt_el.text else ""
    content_el = item.find('content:encoded', ns)
    content = content_el.text if content_el is not None and content_el.text else ""

    # Log warnings for missing required fields
    if not content:
        print(f"WARNING: Missing content for post '{title}' ({slug})")
    if not author or author == "Unknown":
        print(f"WARNING: Missing author for post '{title}' ({slug})")
    if not date or date == "1970-01-01":
        print(f"WARNING: Missing date for post '{title}' ({slug})")

    # Find all image srcs in the content
    image_urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    local_image_paths = []
    # Create a subdirectory for images for this post
    post_image_dir_name = f"{date_str}-{slug}"
    post_image_dir = os.path.join(OUTPUT_IMAGE_PATH, post_image_dir_name)
    os.makedirs(post_image_dir, exist_ok=True)
    for url in image_urls:
        # Only handle images from uploads
        m = re.search(r'/uploads/(.*)', url)
        if m:
            rel_path = m.group(1)
            src_path = os.path.join(WP_UPLOADS_PATH, rel_path)
            dest_filename = os.path.basename(rel_path)
            dest_path = os.path.join(post_image_dir, dest_filename)
            if os.path.exists(src_path):
                shutil.copy2(src_path, dest_path)
                print(f"Copied image: {src_path} -> {dest_path}")
                # Update content to new image path (use subdirectory)
                new_img_url = f"/images/blog/{post_image_dir_name}/{dest_filename}"
                content = content.replace(url, new_img_url)
                local_image_paths.append(dest_path)
            else:
                print(f"WARNING: Image not found: {src_path}")

    # Prepare frontmatter
    frontmatter = {
        'title': title,
        'excerpt': excerpt,
        'date': date_str,
        'author': author,
        'category': categories[0] if categories else "",
        'tags': tags,
        'blogpost': True,
    }
    # Optionally set coverImage if any images found
    if local_image_paths:
        first_img = os.path.basename(local_image_paths[0])
        frontmatter['coverImage'] = f"/images/blog/{post_image_dir_name}/{first_img}"

    # Write Markdown file
    folder_name = f"{date_str}-{slug}"
    post_dir = os.path.join(OUTPUT_BLOG_PATH, folder_name)
    os.makedirs(post_dir, exist_ok=True)
    md_path = os.path.join(post_dir, "index.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("---\n")
        yaml.dump(frontmatter, f, allow_unicode=True, sort_keys=False)
        f.write("---\n\n")
        f.write(content.strip())
    print(f"Created: {md_path}")

print("Migration complete.")

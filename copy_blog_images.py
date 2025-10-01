import os
import shutil

SRC_ROOT = ".tmp/post"
DEST_ROOT = "public/images/blog"

for slug in os.listdir(SRC_ROOT):
    src_img_dir = os.path.join(SRC_ROOT, slug, "images")
    # Find the matching date-slug directory in public/images/blog
    for dest_dir in os.listdir(DEST_ROOT):
        if dest_dir.endswith(slug):
            dest_img_dir = os.path.join(DEST_ROOT, dest_dir)
            if os.path.isdir(src_img_dir):
                os.makedirs(dest_img_dir, exist_ok=True)
                for fname in os.listdir(src_img_dir):
                    src_file = os.path.join(src_img_dir, fname)
                    dest_file = os.path.join(dest_img_dir, fname)
                    shutil.copy2(src_file, dest_file)
                print(f"Copied images for {slug} to {dest_img_dir}")
            break

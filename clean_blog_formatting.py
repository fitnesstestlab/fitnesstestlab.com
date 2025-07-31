import os
import re
import glob

# Directory containing your blog posts
BLOG_DIR = "content/blog"
OUTPUT_DIR = "content/blog_cleaned"
LOG_PATH = "content/cleaning_log.txt"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Patterns and replacements
patterns = [
    # Thrive text block
    (re.compile(r"\[thrive_text_block[^\]]*\](.*?)\[/thrive_text_block\]", re.DOTALL),
     lambda m: f'<div class="thrive-text-block">{m.group(1).strip()}</div>'),
    # Thrive link
    (re.compile(r"\[thrive_link[^\]]*link='([^']+)'[^\]]*\](.*?)\[/thrive_link\]", re.DOTALL),
     lambda m: f'<a href="{m.group(1)}">{m.group(2).strip()}</a>'),
    # Easy Affiliate Links (with text)
    (re.compile(r"\[eafl [^\]]*text=\"([^\"]+)\"[^\]]*\]"),
     lambda m: m.group(1)),
    # Easy Affiliate Links (with name and text)
    (re.compile(r"\[eafl [^\]]*name=\"([^\"]+)\" text=\"([^\"]+)\"[^\]]*\]"),
     lambda m: m.group(2)),
    # Caption shortcode
    (re.compile(r"\[caption [^\]]*\](<img[^>]+>)(.*?)\[/caption\]", re.DOTALL),
     lambda m: f'<figure>{m.group(1)}<figcaption>{m.group(2).strip()}</figcaption></figure>'),
    # Remove layout shortcodes
    (re.compile(r"\[(one_half_first|one_half_last|/one_half_first|/one_half_last)\]"),
     lambda m: ""),
    # Thrive leads
    (re.compile(r"\[thrive_leads[^\]]*\]"), lambda m: ""),
]

# HTML blocks to remove (optional, can be extended)
html_remove_patterns = [
    re.compile(r'<div class="group[^"]*"[^>]*>.*?</div>', re.DOTALL),
    re.compile(r'<span[^>]*>\s*</span>', re.DOTALL),
    re.compile(r'<script[^>]*>.*?</script>', re.DOTALL),
    re.compile(r'<iframe[^>]*>.*?</iframe>', re.DOTALL),
]

# Process all index.md files
log = []
for md_path in glob.glob(f"{BLOG_DIR}/*/index.md"):
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
    orig_content = content
    changes = []
    # Apply replacements
    for pat, repl in patterns:
        def _log_repl(m):
            before = m.group(0)
            after = repl(m)
            if before != after:
                changes.append((before, after))
            return after
        content = pat.sub(_log_repl, content)
    # Remove unwanted HTML blocks
    for pat in html_remove_patterns:
        content, n = pat.subn("", content)
        if n > 0:
            changes.append((f"[Removed {n} block(s) matching {pat.pattern}]", ""))
    # Write cleaned file
    rel_dir = os.path.relpath(os.path.dirname(md_path), BLOG_DIR)
    out_dir = os.path.join(OUTPUT_DIR, rel_dir)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "index.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    # Log changes
    if changes:
        log.append(f"File: {md_path}")
        for before, after in changes:
            log.append("--- Before ---\n" + before + "\n--- After ---\n" + after + "\n")
        log.append("\n")

# Write log
with open(LOG_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(log))

print(f"Cleaning complete. Cleaned files in '{OUTPUT_DIR}', log at '{LOG_PATH}'")

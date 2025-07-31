# Removes NULL bytes from a file (useful for cleaning XML files with invalid characters)
input_path = "/Users/mariog/Work/fitnesstestlab.github.io.cline/.tmp/blog_content/fitnesstestlab.WordPress.2025-07-30.xml"
output_path = "/Users/mariog/Work/fitnesstestlab.github.io.cline/.tmp/blog_content/fitnesstestlab.WordPress.2025-07-30.cleaned.xml"

with open(input_path, "rb") as f:
    data = f.read()

cleaned_data = data.replace(b"\x00", b"")

with open(output_path, "wb") as f:
    f.write(cleaned_data)

print("NULL bytes removed. Cleaned file saved as:", output_path)

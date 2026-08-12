import re

with open("/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/pages/About.tsx", "r") as f:
    content = f.read()

start_marker = "{/* ── Recognition & Awards ──────────────────────────────────────────────── */}"
end_marker = "{/* ── Global Presence ───────────────────────────────────────────────────── */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + content[end_idx:]
    with open("/Users/mdsunny/Downloads/Premium Environmental Network Website/src/app/pages/About.tsx", "w") as f:
        f.write(new_content)
    print("Success")
else:
    print("Failed")

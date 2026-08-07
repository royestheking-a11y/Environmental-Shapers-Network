import os
import re

def migrate_frontend(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    modified = False

    # Replace asynchronous loading in useEffect for frontend sections
    # e.g., const saved = localStorage.getItem("esn_...");
    if 'localStorage.getItem(' in content and 'useEffect' in content:
        # Example pattern: const saved = localStorage.getItem("esn_stats_admin");
        # We replace it with fetchFirestoreData
        content = re.sub(
            r'const\s+(\w+)\s*=\s*localStorage\.getItem\("([^"]+)"\);',
            r'const \1 = await fetchFirestoreData("\2", null);',
            content
        )
        content = content.replace('localStorage.getItem(', 'await fetchFirestoreData(')
        
        # Add import if fetchFirestoreData is used
        if 'fetchFirestoreData' in content and 'fetchFirestoreData' not in content[:500]:
            depth = filepath.count('/') - filepath.find('src/app') - 1
            rel_path = '../' * depth + 'lib/useFirestore'
            content = f'import {{ fetchFirestoreData, saveFirestoreData }} from "{rel_path}";\n' + content
        modified = True

    if modified:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Migrated {filepath}")

for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            # migrate_frontend(path)

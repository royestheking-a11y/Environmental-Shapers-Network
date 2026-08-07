import os
import re

def migrate_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content
    modified = False

    # Get relative path to useFirestore
    depth = filepath.count('/') - filepath.find('src/') - 1
    rel_path = '../' * depth + 'lib/useFirestore'
    
    # 1. Replace getter localStorage blocks that missed the first script
    getter_block = re.search(r'try\s*\{\s*const [^=]+=\s*localStorage\.getItem[^}]+\}\s*catch[^\}]*\}\s*', content)
    if getter_block:
        content = content.replace(getter_block.group(0), '')
        modified = True

    # 2. Add fetchFirestoreData and saveFirestoreData imports if needed
    if 'localStorage' in content and 'useFirestore' not in content:
        if 'import' in content:
            content = f'import {{ fetchFirestoreData, saveFirestoreData, useFirestoreData }} from "{rel_path}";\n' + content
        modified = True

    # 3. Replace synchronous localStorage.getItem in useEffects or normal components with useFirestoreData
    # Pattern: const [data, setData] = useState(JSON.parse(localStorage.getItem(...) || '[]'))
    # This is complex to regex safely, let's target specific files instead.

    if modified:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Migrated {filepath}")

for root, _, files in os.walk('src/'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            # migrate_file(path)

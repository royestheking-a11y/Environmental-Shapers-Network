import os
import re

def migrate_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # If it's an admin view using getInitial...
    if 'getInitial' in content and 'localStorage.getItem' in content:
        # Find the function name
        match = re.search(r'export function (getInitial\w+)\(\)', content)
        if match:
            func_name = match.group(1)
            # Remove localStorage block from the getter function
            content = re.sub(r'try\s*\{\s*const saved = localStorage\.getItem[^}]+\}\s*catch[^\}]*\}\s*', '', content)
            
            # Find the useState that uses it
            state_match = re.search(r'const \[(\w+), set\w+\] = useState<([^>]+)>\(' + func_name + r'\);', content)
            if state_match:
                state_var = state_match.group(1)
                state_type = state_match.group(2)
                
                # Find the local storage key from the save function or old getter
                key_match = re.search(r'localStorage\.setItem\("([^"]+)"', content)
                if key_match:
                    key = key_match.group(1)
                    
                    # Replace import
                    if 'useFirestoreData' not in content:
                        # calculate relative path to src/lib/useFirestore
                        depth = filepath.count('/') - filepath.find('src/app') - 1
                        rel_path = '../' * depth + 'lib/useFirestore'
                        content = content.replace('export default function', f'import {{ useFirestoreData }} from "{rel_path}";\n\nexport default function')
                    
                    # Replace useState
                    old_state = state_match.group(0)
                    new_state = f'const [{state_var}, set{state_var.capitalize()}, loading] = useFirestoreData<{state_type}>("{key}", {func_name}());'
                    content = content.replace(old_state, new_state)
                    
                    # Remove localStorage.setItem
                    content = re.sub(r'localStorage\.setItem\("[^"]+", JSON\.stringify\([^\)]+\)\);', '', content)
                    
                    with open(filepath, 'w') as f:
                        f.write(content)
                    print(f"Migrated {filepath}")

for root, _, files in os.walk('src/app'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            migrate_file(os.path.join(root, file))

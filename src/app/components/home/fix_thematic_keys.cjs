const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ThematicFocusAreasSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The key attribute is currently on motion.div. We need to move it to the Link.
content = content.replace(
    /<Link to={\`\/thematic-areas\/\$\{theme\.slug\}\`} className="block h-full group">([\s\S]*?)<motion\.div\s+key={theme\.title}/g,
    '<Link key={theme.title} to={`/thematic-areas/${theme.slug}`} className="block h-full group">$1<motion.div '
);

fs.writeFileSync(filePath, content);
console.log('Successfully fixed keys');

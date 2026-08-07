const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ThematicFocusAreasSection.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add slug to each theme
content = content.replace('title: "Sustainable Development Goals"', 'slug: "sdgs", title: "Sustainable Development Goals"');
content = content.replace('title: "Climate Change"', 'slug: "climate-change", title: "Climate Change"');
content = content.replace('title: "Displacement & Migration"', 'slug: "displacement-migration", title: "Displacement & Migration"');
content = content.replace('title: "Livelihoods"', 'slug: "livelihoods", title: "Livelihoods"');
content = content.replace('title: "Biodiversity"', 'slug: "biodiversity", title: "Biodiversity"');
content = content.replace('title: "Green Energy"', 'slug: "green-energy", title: "Green Energy"');
content = content.replace('title: "Disaster Risk Reduction"', 'slug: "drr", title: "Disaster Risk Reduction"');
content = content.replace('title: "Urban Resilience"', 'slug: "urban-resilience", title: "Urban Resilience"');
content = content.replace('title: "Blue Economy"', 'slug: "blue-economy", title: "Blue Economy"');

// 2. Wrap motion.div in a Link
if (!content.includes('import { Link } from "react-router"')) {
    content = content.replace('import { motion } from "motion/react";', 'import { motion } from "motion/react";\nimport { Link } from "react-router";');
}

// 3. Change motion.div rendering to Link
const divRegex = /<motion\.div([\s\S]*?)className="p-8 rounded-3xl bg-\[#F8FCF9\] hover:bg-white shadow-sm hover:shadow-xl hover:shadow-\[#0A3D2A\]\/10 border border-transparent hover:border-\[#0A3D2A\]\/5 transition-all group flex flex-col h-full"([\s\S]*?)<\/motion\.div>/g;

content = content.replace(divRegex, (match, p1, p2) => {
    return `<Link to={\`/thematic-areas/\${theme.slug}\`} className="block h-full group">
              <motion.div\${p1}className="p-8 rounded-3xl bg-[#F8FCF9] group-hover:bg-white shadow-sm group-hover:shadow-xl group-hover:shadow-[#0A3D2A]/10 border border-transparent group-hover:border-[#0A3D2A]/5 transition-all flex flex-col h-full"\${p2}</motion.div>
            </Link>`;
});

fs.writeFileSync(filePath, content);
console.log('Successfully updated ThematicFocusAreasSection.tsx');

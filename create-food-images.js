const fs = require('fs');
const path = require('path');

const foodItems = [
  'soto-ayam', 'pecel-lele', 'kfc', 'mcdonalds', 'pizza-hut', 'subway', 'dominos',
  'jus-jeruk', 'kopi-hitam', 'es-cendol', 'jus-alpukat', 'teh-tarik',
  'es-krim', 'pudding', 'kue-lapis', 'baklava', 'tiramisu', 'cheesecake'
];

const createSVG = (name) => {
  const colors = ['#FFA500', '#8B4500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return `data:image/svg+xml;base64,${Buffer.from(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="300" fill="#FFF6F6"/>
<circle cx="200" cy="150" r="80" fill="${color}"/>
<path d="M160 140H240V160H160V140Z" fill="#FFFFFF"/>
<text x="200" y="240" text-anchor="middle" fill="#333333" font-family="Arial" font-size="16" font-weight="bold">${name.replace('-', ' ').toUpperCase()}</text>
</svg>
`).toString('base64')}`;
};

// Create all food images
foodItems.forEach(item => {
  const svgData = createSVG(item);
  const filePath = path.join(__dirname, 'public', 'food', `${item}.jpg`);
  
  // Write the SVG data as a data URL
  fs.writeFileSync(filePath, svgData);
  console.log(`Created: ${item}.jpg`);
});

console.log('All food images created successfully!');
